import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Lock, LogOut, RefreshCcw, Save, Settings2, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth, googleProvider } from "@/firebase";
import { signInWithPopup, signOut } from "firebase/auth"; // Added Firebase
import {
  defaultAdminSettings,
  loadAdminSettings,
  resetAdminSettings,
  saveAdminSettings,
  type AdminSettings,
} from '@/lib/adminSettings';

const ADMIN_SESSION_KEY = 'smartfintool:admin-auth';
const ADMIN_AUTH_USER_KEY = 'smartfintool:admin-auth-user';

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleIdentityApi {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    ux_mode?: 'popup' | 'redirect';
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: 'outline' | 'filled_blue' | 'filled_black';
      size?: 'large' | 'medium' | 'small';
      text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
      shape?: 'pill' | 'rectangular' | 'circle' | 'square';
      width?: number;
      logo_alignment?: 'left' | 'center';
    }
  ) => void;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleIdentityApi;
      };
    };
  }
}

type AdminAuthUser = {
  provider: 'google' | 'password';
  email?: string;
  name?: string;
  picture?: string;
};

type GoogleTokenPayload = {
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  exp?: number;
};

const parseNumber = (value: string, fallback: number) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const parseAllowedEmails = (value: string | undefined) =>
  (value ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = window.atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const decodeGoogleCredential = (credential: string): GoogleTokenPayload | null => {
  const parts = credential.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(parts[1])) as GoogleTokenPayload;
  } catch {
    return null;
  }
};

const readAuthSession = (): AdminAuthUser | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawAuthUser = window.sessionStorage.getItem(ADMIN_AUTH_USER_KEY);
  if (rawAuthUser) {
    try {
      const parsed = JSON.parse(rawAuthUser) as AdminAuthUser;
      if (parsed?.provider === 'google' || parsed?.provider === 'password') {
        return parsed;
      }
    } catch {
      return null;
    }
  }

  if (window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
    return { provider: 'password' };
  }

  return null;
};

const persistAuthSession = (user: AdminAuthUser) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  window.sessionStorage.setItem(ADMIN_AUTH_USER_KEY, JSON.stringify(user));
};

const clearAuthSession = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  window.sessionStorage.removeItem(ADMIN_AUTH_USER_KEY);
};

const AdminPanel = () => {
  const configuredPassword = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined)?.trim();
  const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim();
  const allowedAdminEmails = useMemo(
    () => parseAllowedEmails(import.meta.env.VITE_ADMIN_ALLOWED_EMAILS as string | undefined),
    []
  );
  /**
   * The literal fallback 'admin123' used to apply in production AND the login
   * screen printed it on-page for every visitor. Anyone hitting /admin could
   * read the password and sign in. In production there is now no fallback at
   * all — if VITE_ADMIN_PASSWORD is unset, password login is disabled outright
   * and only the Google allowlist works.
   */
  const resolvedPassword = configuredPassword || (import.meta.env.DEV ? 'admin123' : '');
  const passwordLoginEnabled = resolvedPassword.length > 0;
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [authUser, setAuthUser] = useState<AdminAuthUser | null>(() => readAuthSession());

  const isAuthenticated = Boolean(authUser);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [settings, setSettings] = useState<AdminSettings>(() => loadAdminSettings());

  // === NEW FIREBASE LOGIN FUNCTION (Fixes invalid_client error) ===
  const handleFirebaseLogin = async () => {
    if (!googleClientId) {
      setAuthError('VITE_GOOGLE_CLIENT_ID missing in .env');
      return;
    }
    setIsGoogleLoading(true);
    try {
      setAuthError('');
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email?.toLowerCase() || '';

      if (allowedAdminEmails.length > 0 && !allowedAdminEmails.includes(userEmail)) {
        setAuthError(`Access denied for ${userEmail}.`);
        await signOut(auth);
        setIsGoogleLoading(false);
        return;
      }

      const sessionUser: AdminAuthUser = {
        provider: 'google',
        email: userEmail,
        name: result.user.displayName || '',
        picture: result.user.photoURL || '',
      };

      persistAuthSession(sessionUser);
      setAuthUser(sessionUser);
      setAuthError('');
      setPassword('');
    } catch (error: unknown) {
      setAuthError('Google login failed. Please try again.');
      console.error(error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // === OLD FUNCTION KEPT AS REQUESTED ===
  const handleGoogleCredential = useCallback((response: GoogleCredentialResponse) => {
    const credential = response.credential;
    if (!credential) {
      setAuthError('Google login failed. Please try again.');
      return;
    }

    const payload = decodeGoogleCredential(credential);
    if (!payload?.email || !payload.email_verified) {
      setAuthError('Google account email verify nahi ho paya.');
      return;
    }

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      setAuthError('Google credential expired. Please try login again.');
      return;
    }

    const normalizedEmail = payload.email.toLowerCase();
    if (allowedAdminEmails.length > 0 && !allowedAdminEmails.includes(normalizedEmail)) {
      setAuthError(`Access denied for ${normalizedEmail}.`);
      return;
    }

    const sessionUser: AdminAuthUser = {
      provider: 'google',
      email: normalizedEmail,
      name: payload.name,
      picture: payload.picture,
    };

    persistAuthSession(sessionUser);
    setAuthUser(sessionUser);
    setAuthError('');
    setPassword('');
  }, [allowedAdminEmails]);

  // === OLD USE-EFFECT KEPT AS REQUESTED (But disabled logic so it doesn't cause errors) ===
  useEffect(() => {
    if (isAuthenticated || !googleClientId || !googleButtonRef.current) {
      return;
    }

    /*
    // Old script loading code commented out to fix your error but kept the text so lines are not deleted
    setIsGoogleLoading(true);
    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !googleButtonRef.current || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredential,
          ux_mode: 'popup',
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        googleButtonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleButtonRef.current, { theme: 'outline', size: 'large' });
      })
      .catch(() => { if (!cancelled) setAuthError('Google login load nahi hua. Thodi der baad try karein.'); })
      .finally(() => { if (!cancelled) setIsGoogleLoading(false); });
    */
  }, [googleClientId, handleGoogleCredential, isAuthenticated]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!passwordLoginEnabled) {
      setAuthError('Password login is disabled. Please sign in with Google.');
      return;
    }
    if (password === resolvedPassword) {
      const sessionUser: AdminAuthUser = { provider: 'password' };
      persistAuthSession(sessionUser);
      setAuthUser(sessionUser);
      setAuthError('');
      setPassword('');
      return;
    }
    setAuthError('Wrong password. Please try again.');
  };

  const updateBrand = (field: keyof AdminSettings['brand'], value: string) => {
    setSettings((prev) => ({ ...prev, brand: { ...prev.brand, [field]: value } }));
  };

  const updateHero = (field: keyof AdminSettings['hero'], value: string) => {
    setSettings((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  const updateLegal = (field: keyof AdminSettings['legal'], value: string) => {
    setSettings((prev) => ({ ...prev, legal: { ...prev.legal, [field]: value } }));
  };

  const updateDefaults = <
    K extends keyof AdminSettings['defaults'],
    F extends keyof AdminSettings['defaults'][K]
  >(
    calculator: K,
    field: F,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const fallback = settings.defaults[calculator][field] as number;
    const parsed = parseNumber(event.target.value, fallback);
    setSettings((prev) => ({
      ...prev,
      defaults: {
        ...prev.defaults,
        [calculator]: {
          ...prev.defaults[calculator],
          [field]: parsed,
        },
      },
    }));
  };

  const saveChanges = () => {
    saveAdminSettings(settings);
    setStatusMessage(`Saved successfully (${new Date().toLocaleString('en-IN')})`);
  };

  const loadSavedData = () => {
    setSettings(loadAdminSettings());
    setStatusMessage('Loaded latest saved settings');
  };

  const resetData = () => {
    resetAdminSettings();
    setSettings(defaultAdminSettings);
    setStatusMessage('Settings reset to default values');
  };

  const logout = async () => {
    if (authUser?.provider === 'google') {
      await signOut(auth); // Added Firebase signout
    }
    clearAuthSession();
    setAuthUser(null);
    setStatusMessage('');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-10 sm:py-16">
        <Card className="border border-slate-200 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-[#0f172a] text-white p-8">
            <CardTitle className="flex items-center gap-3 text-2xl font-black">
              <ShieldCheck className="w-7 h-7 text-blue-400" />
              Admin Login
            </CardTitle>
            <CardDescription className="text-slate-300">
              Secure area for SmartFintool website settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Login with Google</p>
              {googleClientId ? (
                <>
                  <div ref={googleButtonRef} className="hidden" /> {/* Kept ref to avoid breaking anything */}
                  <Button 
                    type="button"
                    onClick={handleFirebaseLogin}
                    disabled={isGoogleLoading}
                    className="w-full bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 py-6 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-sm"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google logo" />
                    {isGoogleLoading ? 'Loading Google login...' : 'Sign in with Google'}
                  </Button>
                  {isGoogleLoading ? <p className="text-xs text-slate-500">Loading Google login...</p> : null}
                  {allowedAdminEmails.length > 0 ? (
                    <p className="text-xs text-slate-500">
                      Allowed admin emails: <span className="font-semibold">{allowedAdminEmails.join(', ')}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-amber-700">
                      Secure access ke liye <code>VITE_ADMIN_ALLOWED_EMAILS</code> set karna recommended hai.
                    </p>
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  <code>VITE_GOOGLE_CLIENT_ID</code> missing hai. Google login enable karne ke liye ye env variable set karo.
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 pt-5 space-y-3">
              <p className="text-sm font-semibold text-slate-700">Password Fallback</p>
              {!configuredPassword && import.meta.env.DEV && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  <code>VITE_ADMIN_PASSWORD</code> not set. Dev-only fallback password:{' '}
                  <code>admin123</code>. Set the env var before deploying.
                </div>
              )}
              {!configuredPassword && !import.meta.env.DEV && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                  Admin password is not configured. Set <code>VITE_ADMIN_PASSWORD</code> in your
                  hosting environment and redeploy.
                </div>
              )}

              <form className="space-y-4" onSubmit={handleLogin}>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="admin-password">
                  Password
                </label>
                <div className="flex gap-2">
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none"
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                  />
                  <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-500">
                    <Lock className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </div>
              </form>
            </div>

            {authError ? <p className="text-sm text-red-600 font-semibold">{authError}</p> : null}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-10 pb-24">
      <Card className="border border-slate-200 shadow-xl rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-t-3xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-black flex items-center gap-3">
                <Settings2 className="w-7 h-7 text-blue-300" />
                Admin Panel
              </CardTitle>
              <CardDescription className="text-slate-300">
                Website branding, legal text, and calculator defaults
              </CardDescription>
              {authUser?.provider === 'google' && authUser.email ? (
                <p className="mt-2 text-xs text-blue-200">Signed in as: {authUser.email}</p>
              ) : (
                <p className="mt-2 text-xs text-blue-200">Signed in with password fallback</p>
              )}
            </div>
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Brand Settings</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Site Name</label>
                <input
                  value={settings.brand.siteName}
                  onChange={(event) => updateBrand('siteName', event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tagline</label>
                <input
                  value={settings.brand.tagline}
                  onChange={(event) => updateBrand('tagline', event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Founder Name</label>
                <input
                  value={settings.brand.founderName}
                  onChange={(event) => updateBrand('founderName', event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Support Email</label>
                <input
                  value={settings.brand.supportEmail}
                  onChange={(event) => updateBrand('supportEmail', event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Hero and Disclaimer</h2>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Homepage Subtitle</label>
              <textarea
                value={settings.hero.subtitle}
                onChange={(event) => updateHero('subtitle', event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 min-h-20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Risk Disclaimer</label>
              <textarea
                value={settings.legal.riskDisclaimer}
                onChange={(event) => updateLegal('riskDisclaimer', event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 min-h-24"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Calculator Default Inputs</h2>

            <div className="grid lg:grid-cols-2 gap-4">
              <Card className="border border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">SIP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Monthly Investment</label>
                      <input
                        type="number"
                        value={settings.defaults.sip.monthlyInvestment}
                        onChange={(event) => updateDefaults('sip', 'monthlyInvestment', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Return %</label>
                      <input
                        type="number"
                        value={settings.defaults.sip.rateOfReturn}
                        onChange={(event) => updateDefaults('sip', 'rateOfReturn', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Years</label>
                      <input
                        type="number"
                        value={settings.defaults.sip.years}
                        onChange={(event) => updateDefaults('sip', 'years', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Inflation %</label>
                      <input
                        type="number"
                        value={settings.defaults.sip.inflationRate}
                        onChange={(event) => updateDefaults('sip', 'inflationRate', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">SWP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Lumpsum</label>
                      <input
                        type="number"
                        value={settings.defaults.swp.totalInvestment}
                        onChange={(event) => updateDefaults('swp', 'totalInvestment', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Monthly Withdraw</label>
                      <input
                        type="number"
                        value={settings.defaults.swp.withdrawalAmount}
                        onChange={(event) => updateDefaults('swp', 'withdrawalAmount', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Return %</label>
                      <input
                        type="number"
                        value={settings.defaults.swp.expectedReturn}
                        onChange={(event) => updateDefaults('swp', 'expectedReturn', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Years</label>
                      <input
                        type="number"
                        value={settings.defaults.swp.tenure}
                        onChange={(event) => updateDefaults('swp', 'tenure', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Lumpsum</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Investment</label>
                      <input
                        type="number"
                        value={settings.defaults.lumpsum.investment}
                        onChange={(event) => updateDefaults('lumpsum', 'investment', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Return %</label>
                      <input
                        type="number"
                        value={settings.defaults.lumpsum.rateOfReturn}
                        onChange={(event) => updateDefaults('lumpsum', 'rateOfReturn', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Years</label>
                      <input
                        type="number"
                        value={settings.defaults.lumpsum.years}
                        onChange={(event) => updateDefaults('lumpsum', 'years', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Inflation %</label>
                      <input
                        type="number"
                        value={settings.defaults.lumpsum.inflationRate}
                        onChange={(event) => updateDefaults('lumpsum', 'inflationRate', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-emerald-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Compound</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Principal</label>
                      <input
                        type="number"
                        value={settings.defaults.compound.principal}
                        onChange={(event) => updateDefaults('compound', 'principal', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Rate %</label>
                      <input
                        type="number"
                        value={settings.defaults.compound.rate}
                        onChange={(event) => updateDefaults('compound', 'rate', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Time (Yrs)</label>
                      <input
                        type="number"
                        value={settings.defaults.compound.time}
                        onChange={(event) => updateDefaults('compound', 'time', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Frequency</label>
                      <select
                        value={settings.defaults.compound.frequency}
                        onChange={(event) =>
                          setSettings((prev) => ({
                            ...prev,
                            defaults: {
                              ...prev.defaults,
                              compound: {
                                ...prev.defaults.compound,
                                frequency: parseNumber(event.target.value, 1),
                              },
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      >
                        <option value={1}>Yearly</option>
                        <option value={4}>Quarterly</option>
                        <option value={12}>Monthly</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-rose-200 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Simple Interest</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Principal</label>
                      <input
                        type="number"
                        value={settings.defaults.simple.principal}
                        onChange={(event) => updateDefaults('simple', 'principal', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Rate %</label>
                      <input
                        type="number"
                        value={settings.defaults.simple.rate}
                        onChange={(event) => updateDefaults('simple', 'rate', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Time (Yrs)</label>
                      <input
                        type="number"
                        value={settings.defaults.simple.time}
                        onChange={(event) => updateDefaults('simple', 'time', event)}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button onClick={saveChanges} className="bg-blue-600 hover:bg-blue-500 rounded-xl">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={loadSavedData} className="rounded-xl">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Reload Saved
            </Button>
            <Button variant="destructive" onClick={resetData} className="rounded-xl">
              Reset Defaults
            </Button>

            {statusMessage ? <p className="text-sm text-emerald-700 font-semibold">{statusMessage}</p> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;