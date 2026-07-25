# Top rank karne ke liye — kya bacha hai

Technical SEO ab **lagbhag poora ho chuka hai**. Isliye ye doc zyadatar un
cheezon ke baare me hai jo **sirf aap kar sakte hain** — kyunki asli bottleneck
ab code nahi hai.

---

## Pehle: aaj maine 2 asli problem theek ki

### 1. Har visitor 1.7 MB JavaScript download kar raha tha

Build output audit kiya to mila:

- **PDF library (550 KB)** har page pe load ho rahi thi — jabki wo sirf
  "Download PDF" button dabane par chahiye
- **Firebase (94 KB)** har page pe — jabki wo sirf `/admin` pe chahiye

Matlab SIP calculator kholne wala banda 644 KB aisa code download kar raha tha
jo use kabhi use hi nahi karna tha.

**Ab:** `1696 KB → 1050 KB` (38% kam). Dono on-demand load hote hain.

> Ye sirf speed ki baat nahi — **Core Web Vitals Google ka ranking signal hai**.
> Mobile pe 4G par ye farak seedha LCP me dikhta hai.

### 2. E-E-A-T — finance sites ke liye sabse bada gate

Financial calculator **YMYL** ("Your Money or Your Life") content hai. Google
iske liye **sabse sakht** quality bar lagata hai, kyunki galat financial info
kisi ka nuksan kar sakti hai.

Aapke site pe author signal sirf ek `<meta name="author">` tag me tha — jo
**koi insaan dekhta hi nahi**, aur Google ke quality raters insaan hote hain.

**Ab har tool page pe visible dikhta hai:**
- Kaun maintain karta hai (About page se linked)
- Numbers kab verify kiye gaye
- **Official source links** — incometax.gov.in, indiabudget.gov.in, RBI, AMFI, SEBI

Schema me bhi `author`, `reviewedBy`, `lastReviewed` add kiye.

> Google ki YMYL guideline seedha kehti hai: *"cite sources"* aur *"highlight
> the author's experience and expertise"*. Ab dono hain.

---

## Ab jo bacha hai — priority order me

### 🔴 #1 — Backlinks (sabse bada bottleneck, 60% asar)

Ye **poori tarah aapke haath me hai**, aur iske bina baaki sab kuch bekaar hai.

Abhi aapke site pe **shayad zero quality backlinks** hain. Groww ke paas lakhon
hain. Ye single sabse badi wajah hai ki aap "sip calculator" pe nahi aayenge.

**Kya karein (asli tareeke, spam nahi):**

| Kaam | Kaise | Kitna time |
|---|---|---|
| **r/IndiaInvestments** pe genuinely help karein | Kisi ke sawaal ka **poora jawaab** likhein, phir calculator link karein. Sirf link daalne pe ban ho jayenge | Hafte me 2-3 |
| **Quora** — "how much SIP for 1 crore" type | Detailed answer + calculator link | Hafte me 2-3 |
| **Twitter/X** pe calculation threads | "₹5000 extra EMI dene se ₹13.9 lakh bachta hai" — screenshot ke saath | Hafte me 1 |
| **Local Indore business/CA groups** | CA logon ko tax calculator dikhayein, wo clients ko share karenge | Ek baar |
| **Product Hunt / IndieHackers** launch | Free tool hai, wahan chalta hai | Ek baar |

**Sabse important:** ek bhi spammy backlink mat khareedein. Google penalty
lagayega aur recover karna mushkil hai.

---

### 🟠 #2 — Har tool ke liye Hinglish supporting article (25% asar)

Ye aapka **asli competitive advantage** hai. Groww/ClearTax ke articles English
me corporate tone me hote hain. Aapke blogs Hinglish me hain — **wo aapke
audience ki bhasha hai** aur competitors wahan nahi hain.

Har nayi tool ke liye ek article likhein aur tool se link karein:

| Article idea | Target keyword | Tool link |
|---|---|---|
| "Home loan prepayment kab aur kaise karein?" | home loan prepayment calculator | `/emi` |
| "New vs Old regime — 15 lakh salary pe kaunsa better?" | new vs old regime 15 lakh | `/income-tax` |
| "PPF me 5 April se pehle paisa daalne ka fayda" | ppf best deposit date | `/ppf` |
| "FD pe asal me kitna milta hai? Tax ke baad ka sach" | fd post tax return | `/fd` |
| "1 crore ke liye kitni SIP? Umar ke hisab se" | 1 crore ke liye kitni sip | `/goal-sip` |

**Format jo kaam karta hai:**
- Sawaal seedha title me
- Pehle paragraph me hi seedha jawaab (featured snippet ke liye)
- Ek real example **numbers ke saath**
- Beech me calculator ka link
- Aakhir me 5-6 FAQ

---

### 🟡 #3 — Google Search Console har hafte dekhein (10% asar)

Ye **muft ka keyword research** hai jo koi paid tool nahi de sakta.

**Performance → Queries** kholein. Wahan aise keywords milenge jinpe aap
**already dikh rahe hain position 8-20 par**. Ye sabse aasan jeet hai:

1. Jis query pe impressions hain par clicks kam → **title/description improve karein**
2. Jis query pe position 11-20 hai → us topic pe **content badhayein**
3. Jo query aapne socha hi nahi tha → **naya section ya article** banayein

Position 11-20 se 5-10 pe laana, position 50 se 10 pe laane se **bahut aasan**
hai.

---

### 🟢 #4 — Chhote technical kaam (5% asar)

Ye maine jaan-boojh kar nahi kiye kyunki impact kam hai:

- **14 meta descriptions 160+ chars ke hain** → SERP me kat jaate hain.
  Indexing pe asar nahi, sirf click-through pe. `src/seo/config.ts` me chhota karein.
- **`/disclaimer` sirf 364 words ka hai** → thin content. 600+ karein.
- **charts chunk 182 KB eager hai** → SIP/SWP pe chart chahiye, par EMI/Tax pe
  nahi. Aur lazy kar sakte hain.
- **Blog articles ko 4 se badhakar 8-10 internal links** dein.

---

## Jo NAHI karna

| ❌ Mat karein | Kyun |
|---|---|
| Backlinks khareedna | Google penalty. Recover karna mahina lagta hai |
| AI se 50 article ek din me | Google ka "scaled content abuse" policy — direct penalty |
| Keyword stuffing | 2010 me kaam karta tha, ab nuksan karta hai |
| Roz-roz sitemap resubmit | Kuch fayda nahi, crawl budget waste |
| Dusri sites se content copy | Duplicate content, index se bahar |

---

## Honest timeline

| Kab | Kya |
|---|---|
| 1-2 hafte | Pages index hona shuru |
| 1 mahina | Brand search ("smartfintool") pe #1 |
| 2-3 mahine | Long-tail pe impressions ("emi calculator with prepayment") |
| 4-6 mahine | Long-tail pe real clicks, 100-500 visits/mahina |
| 8-12 mahine | Medium keywords pe page 1, **agar backlinks bane** |
| 12+ mahine | "sip calculator" jaise head keywords pe ladai possible |

**"sip calculator" pe 6 mahine me #1 nahi aayega.** Groww ka domain authority
80+ hai, aapka 0-5 hoga. Jo bhi ye promise kare, wo jhooth bol raha hai.

**Lekin** "1 crore ke liye kitni sip chahiye" jaise long-tail pe **3-4 mahine
me** aa sakte hain — aur wahi shuruaati traffic laata hai.

---

## Agla hafta ka plan

1. **Deploy karein** — `npm run build`, phir upload/push
2. **Search Console** me sitemap resubmit (24 URLs)
3. **5 nayi URLs** pe "Request Indexing" dabayein
4. **Ek Hinglish article likhein** — "Home loan prepayment kab karein"
5. **r/IndiaInvestments pe 2 genuine jawaab** dein

Har hafte yehi dohrayein. **6 mahine consistency** = result. Ye shortcut wala
kaam nahi hai.

---

## Technical status (reference)

| Item | Status |
|---|---|
| Prerendered pages | 24 ✅ |
| Har page: 1 H1, unique title/canonical | ✅ |
| JSON-LD valid + author/reviewedBy | ✅ |
| Visible E-E-A-T + gov source links | ✅ |
| Orphan pages | 0 ✅ |
| Eager JS | 1050 KB (tha 1696) ✅ |
| PDF / Firebase | on-demand ✅ |
| Calc tests | 50/50 ✅ |
| ESLint | clean ✅ |
