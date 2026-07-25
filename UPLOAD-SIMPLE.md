# Website upload karna — bilkul shuru se

Beginner ke liye. Har step ek-ek karke. Jaldi mat kariye.

---

## Poori kahani 1 line me

> Apne computer par `dist` folder banao → uska ZIP banao → cPanel me upload
> karo → extract karo → ho gaya.

Bas itna hi hai. Ab detail me.

---

# HISSA 1 — Computer par file taiyaar karna

## Step 1 — PowerShell kholein

Apne project folder me jaayein:

```
C:\Users\Rahul\Desktop\HDD RECOVERD PROJECTS\fintool
```

Us folder ke andar khaali jagah par **Shift dabakar right-click** karein →
**"Open PowerShell window here"** par click karein.

Ek kaala window khulega. Bas.

---

## Step 2 — Naya code laayein

Ye likhein aur Enter dabayein:

```powershell
git pull origin main
```

Kuch lines aayengi. Koi laal "error" na ho to theek hai.

---

## Step 3 — Website banayein

Ye likhein aur Enter dabayein:

```powershell
npm run build
```

**Ab 30 second rukiye.** Bahut saari lines chalengi. Sabse aakhir me ye dikhna
chahiye:

```
✅ Prerendered 24 routes + 404, sitemap regenerated (24 URLs).
```

Ye line dikh gayi? **Shabash.** Aage badhein.

Nahi dikhi? Poora output mujhe bhej dijiye.

---

## Step 4 — Ek zaroori check

Ye likhein aur Enter:

```powershell
dir dist\.htaccess
```

**Agar file ka naam dikhe** → sab sahi hai. ✅

**Agar "File Not Found" aaye** → Step 2 aur 3 dobara karein.

> **Ye file kyun zaroori hai?**
> Iske bina aapki website ka sirf homepage chalega. `/emi`, `/income-tax`
> jaise saare naye pages **"404 Not Found"** dikhayenge.

---

# HISSA 2 — ZIP banana

## Step 5 — `dist` folder dhundhein

File Explorer me apna project folder kholein. Andar aapko dikhega:

```
fintool/
├── dist          ← YE wala chahiye ✅
├── dist-ssr      ← ye NAHI chahiye ❌
├── src
├── node_modules
└── package.json
```

> **Yaad rakhein:** `dist` = aapki website. `dist-ssr` = bekaar ki temporary
> file. Sirf **`dist`** ka kaam hai.

---

## Step 6 — ZIP banayein

1. **`dist`** folder par **right-click**
2. **Send to** par jaayein
3. **Compressed (zipped) folder** par click karein

Wahin `dist.zip` naam ki file ban jayegi (lagbhag 4 MB).

> Windows 11 me "Send to" nahi dikhe to right-click menu me neeche
> **"Show more options"** par click karein.

---

# HISSA 3 — cPanel me upload

## Step 7 — cPanel kholein

1. Apne hosting ka cPanel kholein (aksar `aapkisite.com/cpanel`)
2. Login karein
3. **File Manager** dhundhein aur click karein

---

## Step 8 — `public_html` me jaayein

Left side me folder ki list hogi. **`public_html`** par click karein.

> **`public_html` hi aapki website hai.** Jo bhi is folder me hai, wahi
> internet par dikhta hai.

---

## Step 9 — Chhupi hui files dikhayein (SKIP MAT KARNA)

1. Upar right corner me **Settings** button par click karein
2. **Show Hidden Files (dotfiles)** par tick lagayein
3. **Save** dabayein

> **Ye kyun?**
> `.htaccess` file ka naam dot (.) se shuru hota hai. Windows aur cPanel
> aisi files chhupa dete hain. Ye setting ON kiye bina aapko pata hi nahi
> chalega ki wo upload hui ya nahi.

---

## Step 10 — Purani website hatayein

> ⚠️ **Pehle backup:** darr lag raha hai to sab files select karke upar
> **Compress** dabayein, zip banakar **Download** kar lein. Phir aage badhein.

1. Upar **Select All** par click karein
2. **Delete** dabayein
3. **"Skip the trash"** par tick karein
4. Confirm karein

Ab `public_html` khaali hai.

---

## Step 11 — ZIP upload karein

1. Upar **Upload** button par click karein
2. Naya page khulega → **Select File** dabayein
3. Apna `dist.zip` chunein
4. Blue progress bar poora hone tak rukiye (~1 minute)
5. Neeche **"Go Back to..."** link par click karein
6. Upar **Reload** dabayein — ab `dist.zip` dikhega

---

## Step 12 — ZIP kholein (extract)

1. `dist.zip` par **right-click**
2. **Extract** par click karein
3. **Extract Files** dabayein
4. Ho jane par **Close** dabayein
5. **Reload** dabayein

---

## Step 13 — Sahi jagah par hai ya nahi, dekhein

Ab do me se ek cheez hui hogi:

### Situation A — `dist` naam ka folder ban gaya

Matlab files ek folder ke andar chali gayin. Theek karna hai:

1. **`dist`** folder par double-click karke andar jaayein
2. **Select All** dabayein
3. Upar **Move** par click karein
4. Box me likhein: `/public_html`
5. **Move Files** dabayein
6. Wapas `public_html` me aayein
7. Khaali `dist` folder aur `dist.zip` — dono **delete** kar dein

### Situation B — files seedha dikh rahi hain

`index.html`, `emi`, `assets` sab seedha `public_html` me hain?
Bas `dist.zip` **delete** kar dein. Kaam khatam.

---

## Sahi structure aisa dikhega

```
public_html/
├── .htaccess        ← dikh rahi hai? (Step 9 kiya tha na?)
├── index.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── assets/
├── emi/
├── income-tax/
├── ppf/
├── fd/
├── goal-sip/
└── blog/
```

- ✅ **Sahi:** `public_html/index.html`
- ❌ **Galat:** `public_html/dist/index.html`

---

# HISSA 4 — Check karna

## Step 14 — Browser me kholein

| Ye URL kholein | Ye dikhna chahiye |
|---|---|
| `smartfintool.com` | SIP calculator |
| **`smartfintool.com/emi`** | **EMI calculator** ← sabse important |
| `smartfintool.com/income-tax` | Income tax calculator |
| `smartfintool.com/sitemap.xml` | Codes ki list |
| `smartfintool.com/abcd` | 404 page |

### **`/emi` khul gaya = SAB HO GAYA** 🎉

Purani site dikh rahi hai? **Ctrl + Shift + R** dabayein (cache saaf hoga).

---

# Kuch galat ho to

### `/emi` par "404 Not Found"

`.htaccess` upload nahi hui.

**Fix:** cPanel me Step 9 (hidden files ON) karein → `public_html` me
`.htaccess` dikh rahi hai? Nahi → apne computer se `dist` ke andar wali
`.htaccess` alag se upload karein.

---

### "500 Internal Server Error"

`.htaccess` ki koi line aapke server par support nahi hai.

**Fix:**
1. `.htaccess` par right-click → **Edit**
2. Sabse neeche `<IfModule mod_headers.c>` se lekar `</IfModule>` tak dhundhein
3. Har line ke aage `#` laga dein
4. **Save Changes** → site dobara kholein

Phir bhi na chale to mujhe batayein.

---

### Har URL par homepage hi khul raha hai

`.htaccess` me koi purani line hai jo sab kuch homepage par bhej rahi hai.

**Fix:** `.htaccess` edit karein → `RewriteRule . /index.html` jaisi line
dhundhein → **delete** kar dein → Save.

---

### Site bilkul khaali / white page

`dist` ke **andar** ki files upload honi chahiye, `dist` folder khud nahi.
Step 13 (Situation A) dobara karein.

---

# Aakhri 3 kaam

## 1. Google ko batayein

[Search Console](https://search.google.com/search-console) kholein:

- **Sitemaps** → `sitemap.xml` likhein → Submit
- **URL Inspection** me ek-ek karke daalein aur **"Request Indexing"** dabayein:
  - `smartfintool.com/emi`
  - `smartfintool.com/income-tax`
  - `smartfintool.com/ppf`
  - `smartfintool.com/fd`
  - `smartfintool.com/goal-sip`

> Roz sirf 10 URL ki limit hai.

## 2. Admin password

cPanel par `.env` file kaam nahi karti. Password apne computer par set karein:

```powershell
echo VITE_ADMIN_PASSWORD=ApnaMazbootPassword123 > .env
npm run build
```

Phir naya `dist` dobara upload karein.

## 3. Sabar rakhein

Google ko 1-2 hafte lagenge. Roz check karke pareshan mat hoiye.

---

# Agli baar update karna ho to

Sirf 4 kaam:

```powershell
git pull origin main
npm run build
```

Phir `dist` ka ZIP → upload → extract. Bas.

`.htaccess` har baar apne aap `dist` me aa jaati hai — alag se kuch nahi karna.

---

# Ek nazar me poora process

```
1.  PowerShell kholein
2.  git pull origin main
3.  npm run build
4.  dir dist\.htaccess          ← file dikhni chahiye
5.  dist folder par right-click → Send to → Compressed folder
6.  cPanel → File Manager → public_html
7.  Settings → Show Hidden Files → ON
8.  Select All → Delete
9.  Upload → dist.zip
10. right-click → Extract
11. Files seedha public_html me hain? (nahi to Move karein)
12. smartfintool.com/emi kholein → khul gaya? DONE 🎉
```
