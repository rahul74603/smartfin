# cPanel pe upload kaise karein — bilkul simple

---

## Sabse pehle ek zaroori baat

Maine aapke liye **`.htaccess` file banayi hai**. Ye cPanel ke liye **zaroori**
hai. Iske bina `/emi`, `/income-tax` jaise saare pages **404 dikhayenge** —
sirf homepage chalega.

`vercel.json` aur `_redirects` jo pehle bane the, wo **Vercel/Netlify ke liye
the**. cPanel (Apache) unhe padhta hi nahi.

Isliye pehle **naya build** lein:

```powershell
git pull origin main
npm run build
```

Ab `dist/` folder taiyaar hai — **4.4 MB, 54 files**.

---

## Sirf 5 step

### Step 1 — `dist` folder ka ZIP banayein

Windows me:

1. `dist` folder pe **right-click**
2. **Send to** → **Compressed (zipped) folder**
3. `dist.zip` ban jayega

> ⚠️ **`dist` folder ko zip karein, uske andar ki files ko nahi.** Aage
> dono cases handle kar lenge, par folder zip karna aasan hai.

---

### Step 2 — cPanel me File Manager kholein

1. cPanel me login karein
2. **File Manager** pe click karein
3. Left side me **`public_html`** folder pe click karein

Ye wahi folder hai jahan aapki website rehti hai.

---

### Step 3 — Purani files hatayein

`public_html` ke andar jo bhi purani website ki files hain, unhe delete karein.

1. Upar **Settings** (top-right) → **Show Hidden Files (dotfiles)** tick karein
   → Save
   *(ye zaroori hai, warna purani `.htaccess` dikhegi hi nahi)*
2. **Select All** karein
3. **Delete** dabayein
4. "Skip the trash" tick karke confirm karein

> 💡 Darr lag raha hai? Pehle purani files ka zip bana ke download kar lein —
> backup ho jayega.

---

### Step 4 — ZIP upload karke extract karein

1. `public_html` ke andar hi rahein
2. Upar **Upload** button dabayein
3. `dist.zip` select karein, upload hone dein (4.4 MB, ~1 minute)
4. Wapas File Manager me aayein, **Reload** dabayein
5. `dist.zip` pe **right-click** → **Extract** → **Extract Files**

Ab do me se ek situation hogi:

**Situation A:** `public_html` ke andar `dist` naam ka folder ban gaya
→ Uske andar jaayein, **Select All** → **Move** → path me `/public_html`
likhein → Move Files
→ Phir khaali `dist` folder aur `dist.zip` delete kar dein

**Situation B:** files seedha `public_html` me aa gayin
→ Bas `dist.zip` delete kar dein

**Sahi structure aisa dikhna chahiye:**

```
public_html/
├── .htaccess          ← ye dikhna zaroori hai (hidden files ON karein)
├── index.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── assets/
├── emi/
│   └── index.html
├── income-tax/
├── ppf/
├── fd/
├── goal-sip/
├── blog/
└── ... baaki folders
```

> ❌ **Galat:** `public_html/dist/index.html`
> ✅ **Sahi:** `public_html/index.html`

---

### Step 5 — Check karein

Browser me ye URLs kholein:

| URL | Kya dikhna chahiye |
|---|---|
| `smartfintool.com` | SIP calculator |
| `smartfintool.com/emi` | **EMI calculator** |
| `smartfintool.com/income-tax` | Income tax calculator |
| `smartfintool.com/ppf` | PPF calculator |
| `smartfintool.com/sitemap.xml` | XML list (24 URLs) |
| `smartfintool.com/kuch-bhi` | 404 page |

**Agar `/emi` chal gaya to sab sahi hai.** ✅

---

## Kuch galat ho to

### `/emi` pe 404 aa raha hai

`.htaccess` upload nahi hui. File Manager me **Settings → Show Hidden Files**
ON karein aur dekhein ki `public_html/.htaccess` hai ya nahi. Nahi hai to
`dist/.htaccess` dobara upload karein.

### "500 Internal Server Error"

`.htaccess` ki koi line aapke server pe support nahi hai. Fix:

1. `.htaccess` pe right-click → **Edit**
2. Sabse neeche wale `<IfModule mod_headers.c>` block ko `#` laga ke comment
   kar dein
3. Save karke dobara check karein

Phir bhi na chale to mujhe batayein — main halki version bana dunga.

### Homepage chal raha hai par baaki sab 404

Yehi `.htaccess` wali problem hai. Upar wala fix karein.

### Har URL pe homepage hi dikh raha hai

Aapke server pe koi **purana SPA rule** hai jo sab kuch `index.html` pe bhej
raha hai. `.htaccess` kholein aur `RewriteRule . /index.html` jaisi koi line ho
to **hata dein**. Wo hamari prerendering ko bekaar kar deti hai.

### Purani website dikh rahi hai

Browser cache. **Ctrl + Shift + R** dabayein, ya incognito me kholein.

---

## Upload ke baad ye karein

1. **Search Console** → Sitemaps → `sitemap.xml` resubmit (ab **24 URLs**)
2. **URL Inspection** me 5 nayi URLs pe **"Request Indexing"**:
   `/emi`, `/income-tax`, `/ppf`, `/fd`, `/goal-sip`
3. **Admin password** — cPanel me `.env` kaam nahi karti. Password apne
   computer pe set karke build karein:
   ```powershell
   echo VITE_ADMIN_PASSWORD=ApnaStrongPassword123 > .env
   npm run build
   ```
   Phir `dist/` dobara upload karein.

---

## Agli baar update karna ho to

```powershell
git pull origin main
npm run build
```

Phir `dist` ka zip banakar wahi Step 4 dohrayein. **`.htaccess` har baar
`dist/` me apne aap aa jaati hai** — alag se kuch nahi karna.

---

## FTP se karna ho (FileZilla)

ZIP wala tarika aasan hai, par FTP bhi chalega:

1. FileZilla me cPanel FTP details se connect karein
2. Right side me `public_html` kholein
3. Left side me apne computer ka `dist` folder kholein
4. `dist` ke **andar ki saari files** select karke right side me drag karein
5. **Zaroori:** FileZilla me **Server → Force showing hidden files** ON karein,
   warna `.htaccess` upload nahi hogi

> FTP se 54 files upload hone me 5-10 minute lag sakte hain. ZIP wala tarika
> 1 minute me ho jaata hai.
