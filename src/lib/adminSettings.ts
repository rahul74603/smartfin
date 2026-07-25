export const ADMIN_SETTINGS_STORAGE_KEY = 'smartfintool:admin-settings:v1';
export const ADMIN_SETTINGS_EVENT = 'smartfintool:admin-settings-updated';

export type SIPDefaults = {
  monthlyInvestment: number;
  rateOfReturn: number;
  years: number;
  inflationRate: number;
};

export type SWPDefaults = {
  totalInvestment: number;
  withdrawalAmount: number;
  expectedReturn: number;
  tenure: number;
};

export type LumpsumDefaults = {
  investment: number;
  rateOfReturn: number;
  years: number;
  inflationRate: number;
};

export type CompoundDefaults = {
  principal: number;
  rate: number;
  time: number;
  frequency: number;
};

export type SimpleDefaults = {
  principal: number;
  rate: number;
  time: number;
};

export type AdminSettings = {
  brand: {
    siteName: string;
    tagline: string;
    founderName: string;
    supportEmail: string;
  };
  hero: {
    subtitle: string;
  };
  legal: {
    riskDisclaimer: string;
  };
  defaults: {
    sip: SIPDefaults;
    swp: SWPDefaults;
    lumpsum: LumpsumDefaults;
    compound: CompoundDefaults;
    simple: SimpleDefaults;
  };
};

export const defaultAdminSettings: AdminSettings = {
  brand: {
    siteName: 'SmartFintool',
    tagline: 'Wealth Intelligence',
    founderName: 'Rahul Kumar',
    supportEmail: 'help@smartfintool.com',
  },
  hero: {
    subtitle: 'Advanced calculators for SIP, SWP, Lumpsum, Compound Interest and Simple Interest planning.',
  },
  legal: {
    riskDisclaimer:
      'Important: Mutual Fund investments are subject to market risks. Calculator outputs are mathematical estimates, not guaranteed returns.',
  },
  defaults: {
    sip: {
      monthlyInvestment: 5000,
      rateOfReturn: 12,
      years: 10,
      inflationRate: 6,
    },
    swp: {
      totalInvestment: 1000000,
      withdrawalAmount: 10000,
      expectedReturn: 12,
      tenure: 10,
    },
    lumpsum: {
      investment: 100000,
      rateOfReturn: 12,
      years: 10,
      inflationRate: 6,
    },
    compound: {
      principal: 100000,
      rate: 8,
      time: 5,
      frequency: 1,
    },
    simple: {
      principal: 100000,
      rate: 10,
      time: 5,
    },
  },
};

const clampNumber = (value: unknown, fallback: number, min: number, max: number) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, numeric));
};

const stringOrFallback = (value: unknown, fallback: string) => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const sanitizeSettings = (raw: unknown): AdminSettings => {
  const source = (raw as Partial<AdminSettings>) ?? {};
  const defaults = defaultAdminSettings;

  return {
    brand: {
      siteName: stringOrFallback(source.brand?.siteName, defaults.brand.siteName),
      tagline: stringOrFallback(source.brand?.tagline, defaults.brand.tagline),
      founderName: stringOrFallback(source.brand?.founderName, defaults.brand.founderName),
      supportEmail: stringOrFallback(source.brand?.supportEmail, defaults.brand.supportEmail),
    },
    hero: {
      subtitle: stringOrFallback(source.hero?.subtitle, defaults.hero.subtitle),
    },
    legal: {
      riskDisclaimer: stringOrFallback(source.legal?.riskDisclaimer, defaults.legal.riskDisclaimer),
    },
    defaults: {
      sip: {
        monthlyInvestment: clampNumber(
          source.defaults?.sip?.monthlyInvestment,
          defaults.defaults.sip.monthlyInvestment,
          500,
          1000000
        ),
        rateOfReturn: clampNumber(source.defaults?.sip?.rateOfReturn, defaults.defaults.sip.rateOfReturn, 1, 50),
        years: clampNumber(source.defaults?.sip?.years, defaults.defaults.sip.years, 1, 50),
        inflationRate: clampNumber(source.defaults?.sip?.inflationRate, defaults.defaults.sip.inflationRate, 1, 20),
      },
      swp: {
        totalInvestment: clampNumber(
          source.defaults?.swp?.totalInvestment,
          defaults.defaults.swp.totalInvestment,
          1000,
          100000000
        ),
        withdrawalAmount: clampNumber(
          source.defaults?.swp?.withdrawalAmount,
          defaults.defaults.swp.withdrawalAmount,
          100,
          1000000
        ),
        expectedReturn: clampNumber(
          source.defaults?.swp?.expectedReturn,
          defaults.defaults.swp.expectedReturn,
          1,
          50
        ),
        tenure: clampNumber(source.defaults?.swp?.tenure, defaults.defaults.swp.tenure, 1, 50),
      },
      lumpsum: {
        investment: clampNumber(source.defaults?.lumpsum?.investment, defaults.defaults.lumpsum.investment, 1000, 100000000),
        rateOfReturn: clampNumber(
          source.defaults?.lumpsum?.rateOfReturn,
          defaults.defaults.lumpsum.rateOfReturn,
          1,
          50
        ),
        years: clampNumber(source.defaults?.lumpsum?.years, defaults.defaults.lumpsum.years, 1, 50),
        inflationRate: clampNumber(
          source.defaults?.lumpsum?.inflationRate,
          defaults.defaults.lumpsum.inflationRate,
          1,
          20
        ),
      },
      compound: {
        principal: clampNumber(source.defaults?.compound?.principal, defaults.defaults.compound.principal, 1000, 100000000),
        rate: clampNumber(source.defaults?.compound?.rate, defaults.defaults.compound.rate, 1, 50),
        time: clampNumber(source.defaults?.compound?.time, defaults.defaults.compound.time, 1, 50),
        frequency: [1, 4, 12].includes(Number(source.defaults?.compound?.frequency))
          ? Number(source.defaults?.compound?.frequency)
          : defaults.defaults.compound.frequency,
      },
      simple: {
        principal: clampNumber(source.defaults?.simple?.principal, defaults.defaults.simple.principal, 1000, 100000000),
        rate: clampNumber(source.defaults?.simple?.rate, defaults.defaults.simple.rate, 1, 50),
        time: clampNumber(source.defaults?.simple?.time, defaults.defaults.simple.time, 1, 50),
      },
    },
  };
};

export const loadAdminSettings = (): AdminSettings => {
  if (typeof window === 'undefined') {
    return defaultAdminSettings;
  }

  try {
    const raw = window.localStorage.getItem(ADMIN_SETTINGS_STORAGE_KEY);
    if (!raw) {
      return defaultAdminSettings;
    }

    return sanitizeSettings(JSON.parse(raw));
  } catch (error) {
    console.error('Failed to load admin settings:', error);
    return defaultAdminSettings;
  }
};

export const saveAdminSettings = (settings: AdminSettings) => {
  if (typeof window === 'undefined') {
    return;
  }

  const sanitized = sanitizeSettings(settings);
  window.localStorage.setItem(ADMIN_SETTINGS_STORAGE_KEY, JSON.stringify(sanitized));
  window.dispatchEvent(new Event(ADMIN_SETTINGS_EVENT));
};

export const resetAdminSettings = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(ADMIN_SETTINGS_STORAGE_KEY);
  window.dispatchEvent(new Event(ADMIN_SETTINGS_EVENT));
};
