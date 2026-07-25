# Local project me changes merge karne ke commands

Branch ka naam: **`arena/019f99ea-smartfin`**
Repo: `https://github.com/rahul74603/smartfin.git`

---

## ⚠️ Pehle ye 2 baatein jaan lein

**1. `dist/` folder git me committed hai.** Aapke local pe bhi `dist/` hai (jab
aapne build kiya tha). Ye **conflict karega**. Ghabraiye mat — `dist/` to build
se dobara ban jaata hai, to conflict me hamesha **nayi wali** le lena hai.

**2. `react-helmet-async` package hata diya hai.** Isliye merge ke baad
`npm install` chalana **zaroori** hai, warna build fail hogi.

---

## Step 0 — Apna kaam bachaiye (pehle ye karein)

```bash
cd <apne project ka folder>

# Dekhein aapke paas koi un-committed change to nahi
git status
```

Agar kuch bhi uncommitted dikhe, use pehle safe karein:

```bash
git add -A
git commit -m "my local work before merge"
```

Ya agar wo changes nahi chahiye:

```bash
git checkout -- .
```

---

## Option A — Seedha local me merge karein (sabse aasan)

```bash
# 1. Latest changes GitHub se laayein
git fetch origin

# 2. Apni main branch pe jaayein
git checkout main
git pull origin main

# 3. Nayi branch merge karein
git merge origin/arena/019f99ea-smartfin
```

### Agar `dist/` me conflict aaye (aane ki poori sambhavna hai)

Aisa message dikhega:
```
CONFLICT (content): Merge conflict in dist/index.html
Automatic merge failed; fix conflicts and then commit the result.
```

To ye chala dein — `dist/` ki nayi wali copy le lega:

```bash
# dist/ ke saare conflicts me nayi wali file lein
git checkout --theirs dist/
git add dist/

# Agar package-lock.json me bhi conflict ho
git checkout --theirs package-lock.json
git add package-lock.json

# Baaki koi conflict bacha hai kya?
git status
```

Agar `dist/` aur `package-lock.json` ke alawa **kisi aur file** me conflict ho
to mujhe batayein — wo manually dekhna padega.

Sab clear hone par:

```bash
git commit -m "Merge SEO fixes and 5 new calculators"
```

### 4. Dependencies install karein (SKIP MAT KAREIN)

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` isliye chahiye kyunki repo me TypeScript 6 hai aur
> `typescript-eslint` abhi TS 5 maangta hai. Iske bina `npm install` error dega.

### 5. Sab kaam kar raha hai, verify karein

```bash
# Maths ke 50 tests — sab pass hone chahiye
npm run test:calc

# Poora build — 24 pages prerender honge
npm run build
```

Aapko aisa dikhna chahiye:
```
✅ All 50 assertions passed
✅ Prerendered 24 routes + 404, sitemap regenerated (24 URLs).
```

### 6. GitHub pe push karein

```bash
git push origin main
```

---

## Option B — GitHub pe Pull Request se (safe, review kar sakte hain)

Agar aap pehle changes dekhna chahte hain:

```bash
gh pr create \
  --base main \
  --head arena/019f99ea-smartfin \
  --title "SEO fixes + 5 new calculators (EMI, Income Tax, PPF, FD, Goal SIP)" \
  --body "Prerendering, per-page SEO, crawlable nav, aur 5 nayi tools with 50 passing calc tests."
```

Ya browser me kholein:
`https://github.com/rahul74603/smartfin/compare/main...arena/019f99ea-smartfin`

PR merge karne ke baad local pe:

```bash
git checkout main
git pull origin main
npm install --legacy-peer-deps
npm run build
```

---

## Option C — Sirf dekhna hai, merge nahi karna (test drive)

```bash
git fetch origin
git checkout arena/019f99ea-smartfin
npm install --legacy-peer-deps
npm run dev
```

Browser me kholein aur nayi tools try karein:
- http://localhost:5173/emi
- http://localhost:5173/income-tax
- http://localhost:5173/ppf
- http://localhost:5173/fd
- http://localhost:5173/goal-sip

Wapas apni branch pe:

```bash
git checkout main
```

---

## Agar kuch galat ho jaaye — sab wapas

Merge ke **beech** me ho aur cancel karna ho:

```bash
git merge --abort
```

Merge **ho chuka** hai lekin push nahi kiya, aur wapas jaana hai:

```bash
git reset --hard origin/main
```

> `--hard` aapke un-committed changes mita dega. Isliye Step 0 zaroori tha.

---

## Merge ke baad ye karna hai

1. **`.env` file banayein** (ye git me nahi aati):
   ```bash
   cp .env.example .env
   ```
   Phir `.env` me `VITE_ADMIN_PASSWORD` bhar dein.

2. **Deploy karein** — `npm run build` karke `dist/` upload karein, ya Vercel/
   Netlify pe push se apne aap ho jayega.

3. **SPA catch-all rule hata dein** agar host pe hai (`/* → /index.html 200`).
   Wo prerendered pages ko dhak dega. Details `DEPLOY-GUIDE.md` me hain.

4. **Search Console** me sitemap resubmit karein (ab 24 URLs hain).

---

## Ek nazar me — poora flow copy-paste ke liye

```bash
cd <project folder>
git status                                  # kuch uncommitted to nahi?
git add -A && git commit -m "my local work" # agar tha to

git fetch origin
git checkout main
git pull origin main
git merge origin/arena/019f99ea-smartfin

# conflict aaye to:
git checkout --theirs dist/ package-lock.json
git add dist/ package-lock.json
git commit -m "Merge SEO fixes and 5 new calculators"

npm install --legacy-peer-deps
npm run test:calc
npm run build
git push origin main
```
