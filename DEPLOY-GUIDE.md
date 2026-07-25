# Deploy Guide — env variables aur nayi tools

---

## 1. `VITE_ADMIN_PASSWORD` kaise set karein?

Sabse pehle samajh lein: **`.env` file kaam nahi karegi** agar aap Vercel/Netlify
pe deploy kar rahe hain, kyunki `.env` git me commit nahi hoti (aur honi bhi nahi
chahiye). Password **hosting platform ke dashboard** me set hota hai.

Ek important baat: Vite me `VITE_` wale variables **build ke time** JavaScript me
bake ho jaate hain. Matlab technically wo browser me dikh sakte hain. Isliye ye
password sirf ek halka sa gate hai — asli protection **Google login allowlist**
(`VITE_ADMIN_ALLOWED_EMAILS`) hai. Admin panel sirf localStorage me settings
likhta hai, koi server data nahi, to risk kam hai.

### Vercel pe

1. Vercel dashboard → apna project kholein
2. **Settings** → **Environment Variables**
3. Add karein:
   - Key: `VITE_ADMIN_PASSWORD`
   - Value: apna strong password (jaise `Sf#2026$Rahul!x9`)
   - Environments: **Production**, **Preview**, **Development** — teeno tick karein
4. **Save** dabayein
5. **Zaroori:** **Deployments** → latest → **⋯** → **Redeploy**
   (env variable purane build me apne aap nahi aayega, naya build chahiye)

### Netlify pe

1. Netlify dashboard → **Site configuration** → **Environment variables**
2. **Add a variable** → **Add a single variable**
3. Key `VITE_ADMIN_PASSWORD`, value apna password, scope **All**
4. **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

### cPanel / shared hosting / manual upload pe

Yahan dashboard nahi hota, to build **apne computer pe** karein:

```bash
# Project folder me .env file banayein (ye git me nahi jaayegi)
echo 'VITE_ADMIN_PASSWORD=ApnaStrongPassword123' > .env
echo 'VITE_ADMIN_ALLOWED_EMAILS=aapka@gmail.com' >> .env

npm run build

# Ab dist/ folder ka poora content public_html me upload kar dein
```

### Local development ke liye

```bash
cp .env.example .env
# .env kholein aur values bhar dein
npm run dev
```

### Check kaise karein ki laga ya nahi

Deploy ke baad `/admin` kholein:

| Kya dikhta hai | Matlab |
|---|---|
| Normal password box | ✅ Sahi laga hai |
| Laal box: "Admin password is not configured" | ❌ Env var nahi laga — redeploy karein |
| `admin123` screen pe likha dikhe | ❌ Purana build chal raha hai — cache clear karke redeploy |

### Baaki optional env variables

```
VITE_ADMIN_PASSWORD=<strong password>
VITE_ADMIN_ALLOWED_EMAILS=aapka@gmail.com,dusra@gmail.com   # Google login allowlist — asli security
VITE_FIREBASE_API_KEY=...                                    # sirf agar dusra Firebase project use karna ho
```

---

## 2. Nayi 5 tools jo add ki hain

Maine pehle **research kiya ki aapke niche me kis cheez ki sabse zyada demand
hai**, phir wahi banayi. EMI aur Income Tax India ke sabse zyada use hone wale
financial calculators hain — aapke site pe **dono nahi the**.

| URL | Tool | Kyun ye |
|-----|------|---------|
| `/emi` | EMI Calculator | Sabse zyada search hone wala financial calculator. Home/car/personal/education loan presets + **prepayment saving** |
| `/income-tax` | Income Tax FY 2026-27 | Doosra sabse bada. **New vs Old regime** side-by-side |
| `/ppf` | PPF Calculator | 7.1% pe maturity, saal-dar-saal table |
| `/fd` | FD & RD Calculator | Dono ek page pe |
| `/goal-sip` | Goal SIP Planner | **Ulta SIP** — goal daalo, monthly amount milega |

### Har tool me aisa kya hai jo competitors me nahi

Sirf calculator bana dena kaafi nahi hai — Groww aur ClearTax ke paas bhi hain.
Isliye har tool me ek **aisi cheez daali hai jo aksar missing hoti hai**:

- **EMI** → prepayment slider. "₹5,000 extra doge to loan 4 saal 5 mahine pehle
  khatam, ₹13.9 lakh interest bachega." Ye number log dhundhte hain.
- **Income Tax** → dono regime ka **slab-wise breakup**, surcharge me
  **marginal relief** (jo bahut calculators galat karte hain)
- **PPF** → **"5 April se pehle deposit karo"** wala insight, exact rupee me
  batata hai kitna zyada milega
- **FD** → **post-tax return**. 30% slab me 7% FD asal me sirf **4.9%** deti hai.
  Ye zyadatar FD calculators chhupa lete hain.
- **Goal SIP** → **step-up SIP** + inflation adjustment

### Maths galat na ho, iske liye

Nayi file `src/lib/calc.ts` me saare formulas hain, aur `scripts/test-calc.mjs`
me **50 test** hain jo **published values** se match karte hain (apne output se
nahi — warna bug lock ho jaata):

```bash
npm run test:calc
```

```
✓ 10L @ 9% × 10y  → EMI ≈ ₹12,668
✓ 50L @ 8.5% × 20y → EMI ≈ ₹43,391
✓ ₹12.75L salary → ZERO tax
✓ ₹15L taxable → total ₹1,09,200 (incl. 4% cess)
✓ ₹1.5L/yr × 15y @ 7.1% → ≈ ₹40.68 lakh
✓ ₹1L @ 7% × 5y quarterly → ≈ ₹1,41,478
✓ marginal relief caps the ₹50L cliff
────────────────────────────────
✅ All 50 assertions passed
```

**Rates verify kiye** (FY 2026-27 / AY 2027-28): slabs Budget 2026 me nahi badle,
standard deduction ₹75,000, 87A rebate ₹60,000 (₹12L tak), PPF 7.1%, EPF 8.25%.

---

## 3. Internal linking — ab kaisa hai

Google deep pages ko **internal links se dhundhta hai**. Pehle blog articles
orphan the. Ab:

```
Har page pe inbound links:
  /emi, /income-tax, /ppf, /fd, /goal-sip    23 links each
  /, /swp, /lumpsum, /compound, /simple      23 links each
  blog articles                              1-8 links

Orphan pages: NONE ✅
```

Har tool apne **6 sabse related** tools ko link karta hai (random footer dump
nahi) — jaise EMI se Income Tax (home loan deduction), FD se PPF (tax-free
comparison). Isse Google ko topic ka rishta samajh aata hai.

---

## 4. Verify — sab check ho chuka hai

| Check | Result |
|---|---|
| Prerendered pages | **24** (pehle 19) |
| Har page pe exactly 1 H1 | ✅ |
| Duplicate title / canonical | **NONE** |
| JSON-LD valid | ✅ sab 24 |
| Visible FAQ text (rich result ke liye zaroori) | ✅ har tool pe 6 |
| Orphan pages | **NONE** |
| SSR deterministic (hydration safe) | ✅ |
| Calc tests | ✅ 50/50 |
| ESLint | ✅ clean |

**JS band karke bhi** poora content dikhta hai — yahi Googlebot pehli baar
dekhta hai:

```bash
curl -s https://smartfintool.com/emi | grep "Your Monthly EMI"
```

---

## 5. Deploy ke baad ye karein

```bash
npm run build     # 24 pages + sitemap banega
```

1. **SPA catch-all rule hata dein** agar host pe hai (`/* → /index.html 200`).
   Wo prerendered pages ko dhak dega. `vercel.json` aur `public/_redirects` me
   sahi config already hai.
2. **Search Console** → Sitemaps → `sitemap.xml` resubmit karein (24 URLs)
3. **URL Inspection** → **"Request Indexing"** in 5 nayi URLs pe:
   `/emi`, `/income-tax`, `/ppf`, `/fd`, `/goal-sip`
   (roz 10 ki limit hai)
4. **`VITE_ADMIN_PASSWORD`** set karein (upar step 1)
5. **Firebase console** → Authorized domains me sirf `smartfintool.com` rakhein

---

## 6. Traffic — honest expectation

`/emi` aur `/income-tax` pe **competition bahut zyada hai** (Groww, ClearTax,
BankBazaar). Wahan turant number 1 nahi aayenge. Lekin **long-tail** pe aapka
chance acha hai, aur wahi shuruaati traffic laata hai:

- "emi calculator with prepayment option"
- "kitna prepayment karne se kitna bachega"
- "ppf 5 april deposit benefit"
- "fd post tax return calculator 30% slab"
- "1 crore ke liye kitni sip chahiye"
- "new vs old regime kaunsa better 15 lakh salary"

**Timeline:** 1-2 hafte me indexing, 3-8 hafte me impressions, 3-6 mahine me
meaningful clicks. Isse tez koi nahi kar sakta — jo kare wo jhooth bol raha hai.

**Sabse zyada asar isse padega:** blog articles ka Hinglish tone competitors ke
paas nahi hai. Har nayi tool ke liye ek Hinglish guide likhein aur tool se link
karein — "Home loan prepayment kab karna chahiye?", "New vs old regime kaise
choose karein". Yahi aapka asli competitive advantage hai.
