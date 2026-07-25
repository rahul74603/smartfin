import { Target } from 'lucide-react';
import type { BlogPost } from '../../data/blogData';

export const financialGoalSettingPost: BlogPost = {
  id: 'financial-goal-setting',
  title: 'Financial Goal Setting: 5-Step SMART Framework For Every Indian Investor',
  seoTitle: 'SMART Financial Goal Setting Framework',
  description: 'Learn how to set and achieve financial goals using the proven SMART framework. Calculate exact SIP amounts for house, car, education, and retirement goals with practical examples.',
  category: 'Financial Planning',
  readTime: 12,
  publishDate: '2026-02-10',
  author: 'SmartFintool Team',
  authorTitle: 'Financial Education Experts',
  icon: <Target className="w-6 h-6" />,
  keyTopics: ['SMART goal framework', 'Goal-based investing', 'House down payment planning', 'Child education planning', 'Car purchase planning', 'Priority setting'],
  seoKeywords: ['financial goal setting india', 'how to set investment goals', 'smart investing india', 'goal based investing', 'ghar ke liye investment', 'child education planning'],
  content: `
      <div class="space-y-8">

        <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border-l-4 border-emerald-600">
          <p class="text-xl font-bold text-emerald-700 mb-2">🎯 Goals Ke Bina Investing = Bina Nakshe Ke Safar</p>
          <p class="text-gray-700">80% log invest toh karte hain, lekin unhe pata nahi ki woh invest kyun kar rahe hain. Iska result? Galat funds choose karna, paisa beech mein nikaal lena, aur targets miss karna.</p>
        </div>

        <p class="text-lg text-gray-700 leading-relaxed">
          Sochiye ki aap Mumbai se Delhi ja rahe hain bina GPS ke, bina map ke. Aap pahunche toh jaoge, lekin shayad Pune mein nikloge! 
          Investing mein bhi yehi hota hai. <strong class="text-emerald-700">Jab tak aapke goals clear nahi hain, tab tak aapka paisa sahi jagah nahi lagega.</strong>
        </p>

        <h2 class="text-3xl font-black text-slate-900 mt-10 pb-3 border-b-2 border-emerald-200">SMART Goals Framework: Kya Hai Ye?</h2>

        <p class="text-gray-700 text-lg leading-relaxed mb-6">
          SMART ek proven system hai goals set karne ka. Har letter ek quality represent karta hai jo aapka goal hona chahiye:
        </p>

        <div class="space-y-4">
          <div class="bg-white rounded-2xl p-6 border-2 border-blue-300 shadow-sm">
            <div class="flex items-start gap-4">
              <span class="bg-blue-600 text-white font-black text-2xl rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">S</span>
              <div>
                <h3 class="text-xl font-black text-blue-700">Specific (Saaf Goal)</h3>
                <p class="text-gray-600 mt-2">"Paisa bachana chahta hun" — ye goal nahi hai. <strong>"Ghar ke liye ₹20 Lakh ka down payment banana hai"</strong> — ye goal hai! Goal jitna specific hoga, achieve karna utna aasaan hoga.</p>
                <div class="bg-blue-50 rounded-xl p-3 mt-3">
                  <p class="text-sm text-blue-700"><strong>❌ Vague:</strong> "Zyada save karna hai"</p>
                  <p class="text-sm text-blue-700 mt-1"><strong>✅ Specific:</strong> "Beti ki engineering degree ke liye ₹15 Lakh collect karne hain"</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border-2 border-green-300 shadow-sm">
            <div class="flex items-start gap-4">
              <span class="bg-green-600 text-white font-black text-2xl rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">M</span>
              <div>
                <h3 class="text-xl font-black text-green-700">Measurable (Measure Hone Wala)</h3>
                <p class="text-gray-600 mt-2">Aapko pata hona chahiye ki aap kitna aage badhe hain. Iske liye exact rupee amount aur timeline dono zaroori hain. Monthly progress track karo.</p>
                <div class="bg-green-50 rounded-xl p-3 mt-3">
                  <p class="text-sm text-green-700"><strong>Tool:</strong> Hamare SIP Calculator se har mahine check karo ki aap target se kitne door hain.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border-2 border-amber-300 shadow-sm">
            <div class="flex items-start gap-4">
              <span class="bg-amber-600 text-white font-black text-2xl rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">A</span>
              <div>
                <h3 class="text-xl font-black text-amber-700">Achievable (Realistic Hona)</h3>
                <p class="text-gray-600 mt-2">Agar aapki income ₹30,000 hai aur aap ₹25,000 ki SIP lagana chahte hain — ye realistic nahi. Goal ambitious hona chahiye, lekin achievable bhi. 20-30% income invest karna ek healthy starting point hai.</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border-2 border-purple-300 shadow-sm">
            <div class="flex items-start gap-4">
              <span class="bg-purple-600 text-white font-black text-2xl rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">R</span>
              <div>
                <h3 class="text-xl font-black text-purple-700">Relevant (Aapke Life Se Related)</h3>
                <p class="text-gray-600 mt-2">Goal aapki zindagi se connected hona chahiye. Dost ka dekh ke invest karna ya trend follow karna galat hai. Pucho khud se: "Ye goal meri priorities ke saath align hai kya?"</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border-2 border-red-300 shadow-sm">
            <div class="flex items-start gap-4">
              <span class="bg-red-600 text-white font-black text-2xl rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">T</span>
              <div>
                <h3 class="text-xl font-black text-red-700">Time-Bound (Deadline Hona)</h3>
                <p class="text-gray-600 mt-2">Bina deadline ke koi bhi goal sirf sapna hai. "5 saal mein ghar kharidna hai" — ye time-bound goal hai. Deadline hone se aap motivated rehte hain aur sahi fund choose kar sakte hain.</p>
              </div>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-black text-slate-900 mt-10 pb-3 border-b-2 border-blue-200">5 Common Indian Financial Goals: Kaise Plan Karein</h2>

        <div class="space-y-6">

          <div class="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 class="text-xl font-bold text-blue-800 mb-4">🏠 Goal 1: Ghar Ka Down Payment</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600 mb-2"><strong>Target:</strong> ₹20 Lakh in 7 years</p>
                <p class="text-sm text-gray-600"><strong>Recommended Fund:</strong> Aggressive Hybrid Fund</p>
                <p class="text-sm text-gray-600"><strong>Expected Return:</strong> 11% CAGR</p>
              </div>
              <div class="bg-white rounded-xl p-4 text-center">
                <p class="text-xs text-gray-400 mb-1">Required Monthly SIP</p>
                <p class="text-2xl font-black text-blue-700">₹14,800/month</p>
              </div>
            </div>
          </div>

          <div class="bg-purple-50 rounded-2xl p-6 border border-purple-200">
            <h3 class="text-xl font-bold text-purple-800 mb-4">🎓 Goal 2: Bacche Ki Higher Education</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600 mb-2"><strong>Target:</strong> ₹30 Lakh in 15 years</p>
                <p class="text-sm text-gray-600"><strong>Recommended Fund:</strong> Large Cap Equity Fund</p>
                <p class="text-sm text-gray-600"><strong>Expected Return:</strong> 12% CAGR</p>
              </div>
              <div class="bg-white rounded-xl p-4 text-center">
                <p class="text-xs text-gray-400 mb-1">Required Monthly SIP</p>
                <p class="text-2xl font-black text-purple-700">₹5,940/month</p>
              </div>
            </div>
          </div>

          <div class="bg-green-50 rounded-2xl p-6 border border-green-200">
            <h3 class="text-xl font-bold text-green-800 mb-4">🚗 Goal 3: Dream Car</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600 mb-2"><strong>Target:</strong> ₹8 Lakh in 3 years</p>
                <p class="text-sm text-gray-600"><strong>Recommended Fund:</strong> Debt Fund/Short Duration</p>
                <p class="text-sm text-gray-600"><strong>Expected Return:</strong> 8% CAGR</p>
              </div>
              <div class="bg-white rounded-xl p-4 text-center">
                <p class="text-xs text-gray-400 mb-1">Required Monthly SIP</p>
                <p class="text-2xl font-black text-green-700">₹21,000/month</p>
              </div>
            </div>
          </div>

          <div class="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <h3 class="text-xl font-bold text-amber-800 mb-4">💍 Goal 4: Shadi Ka Kharcha</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600 mb-2"><strong>Target:</strong> ₹15 Lakh in 5 years</p>
                <p class="text-sm text-gray-600"><strong>Recommended Fund:</strong> Balanced Advantage Fund</p>
                <p class="text-sm text-gray-600"><strong>Expected Return:</strong> 10% CAGR</p>
              </div>
              <div class="bg-white rounded-xl p-4 text-center">
                <p class="text-xs text-gray-400 mb-1">Required Monthly SIP</p>
                <p class="text-2xl font-black text-amber-700">₹19,400/month</p>
              </div>
            </div>
          </div>

          <div class="bg-red-50 rounded-2xl p-6 border border-red-200">
            <h3 class="text-xl font-bold text-red-800 mb-4">🏖️ Goal 5: Retirement Corpus</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600 mb-2"><strong>Target:</strong> ₹3 Crore in 25 years</p>
                <p class="text-sm text-gray-600"><strong>Recommended Fund:</strong> Flexi Cap/Index Fund</p>
                <p class="text-sm text-gray-600"><strong>Expected Return:</strong> 12% CAGR</p>
              </div>
              <div class="bg-white rounded-xl p-4 text-center">
                <p class="text-xs text-gray-400 mb-1">Required Monthly SIP</p>
                <p class="text-2xl font-black text-red-700">₹13,050/month</p>
              </div>
            </div>
          </div>

        </div>

        <h2 class="text-3xl font-black text-slate-900 mt-10 pb-3 border-b-2 border-slate-200">Goal Priority Kaise Set Karein?</h2>

        <p class="text-gray-700 text-lg mb-6">Agar aapke paas multiple goals hain aur limited paisa, toh is order ko follow karo:</p>

        <div class="space-y-3">
          <div class="flex items-center gap-4 bg-red-50 rounded-xl p-4 border border-red-200">
            <span class="bg-red-600 text-white font-black rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
            <div>
              <p class="font-bold text-red-800">Emergency Fund (Sabse Pehle)</p>
              <p class="text-sm text-gray-600">6 mahine ka kharcha liquid mein rakhna mandatory hai.</p>
            </div>
          </div>
          <div class="flex items-center gap-4 bg-orange-50 rounded-xl p-4 border border-orange-200">
            <span class="bg-orange-600 text-white font-black rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
            <div>
              <p class="font-bold text-orange-800">Insurance (Health + Life)</p>
              <p class="text-sm text-gray-600">Bina protection ke investing risky hai.</p>
            </div>
          </div>
          <div class="flex items-center gap-4 bg-blue-50 rounded-xl p-4 border border-blue-200">
            <span class="bg-blue-600 text-white font-black rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
            <div>
              <p class="font-bold text-blue-800">Short-term Goals (1-3 Saal)</p>
              <p class="text-sm text-gray-600">Debt funds ya liquid investments mein.</p>
            </div>
          </div>
          <div class="flex items-center gap-4 bg-green-50 rounded-xl p-4 border border-green-200">
            <span class="bg-green-600 text-white font-black rounded-full w-8 h-8 flex items-center justify-center text-sm">4</span>
            <div>
              <p class="font-bold text-green-800">Long-term Goals (5+ Saal)</p>
              <p class="text-sm text-gray-600">Equity mutual funds mein aggressively invest karo.</p>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white mt-10">
          <h3 class="text-2xl font-black mb-3">🎯 Aaj Hi Apna Goal Plan Banao</h3>
          <p class="text-emerald-100 mb-4">Hamare SIP Calculator mein apna goal amount aur timeline daalo — hum batayenge kitni SIP karni hai. Goal-based investing se aap kabhi track se nahi bhatkenge.</p>
          <a href="/" class="bg-white text-emerald-700 px-6 py-3 rounded-full font-black text-sm cursor-pointer hover:bg-emerald-50 transition inline-block">→ Goal Calculator Use Karein</a>
        </div>

      </div>
    `,
  faqs: [
    { q: "Ek saath kitne financial goals rakh sakte hain?", a: "Ideally 3-5 goals. Zyada goals honge toh focus divided ho jaata hai. Prioritize karo: emergency fund, insurance, ek-do short term goals, aur retirement. Baki goals baad mein add karo jab income badhe." },
    { q: "Short term goals ke liye kahan invest karein?", a: "1-3 saal ke goals ke liye Liquid Funds, Ultra Short Duration Funds, ya Short Duration Debt Funds best hain. Market risk kam hota hai aur FD se thoda better returns milte hain. Equity funds 3 saal se kam ke goals ke liye risky hain." },
    { q: "Kya goals change ho sakte hain baad mein?", a: "Bilkul! Life ka koi certainty nahi. Shadi, bacche, job change, income badh na — in sab se goals change hote hain. Har saal apne goals review karo aur SIP amounts accordingly adjust karo. Financial planning ek one-time kaam nahi hai." },
    { q: "Bacche ki education ke liye kab se plan start karein?", a: "Jitna jaldi ho sake — ideally bacche ke janam ke saath hi. Agar aap abhi shuru karo aur baccha 2 saal ka hai, toh 16 saal mein ₹30 Lakh ke liye sirf ₹5,000/month chahiye. Agar 10 saal mein shuru karo toh ₹15,000+/month lagenge." },
    { q: "Goal-based investing aur regular investing mein kya fark hai?", a: "Regular investing mein aap sirf ek fund mein daalta rehte ho bina purpose ke. Goal-based investing mein har goal ke liye alag fund hota hai, alag risk level hoti hai, aur alag timeline hoti hai. Ye zyada organized aur effective hai kyunki aap clearly jaante ho ki kab kitna paisa chahiye." }
  ]
};