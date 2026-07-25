import { useLocation, useNavigate } from 'react-router-dom';
import { blogPosts } from '../data/blogData';
import { useEffect } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

export default function BlogDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Fixed: Extracting ID directly from URL path
  const id = location.pathname.split('/blog/')[1];
  const post = blogPosts.find(p => p.id === id);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | SmartFintool Blog`;
      // Meta description update logic
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', post.description);
      
      // Meta keywords update logic for SEO
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) metaKeywords.setAttribute('content', post.seoKeywords.join(', '));
    }
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) return <div className="text-center py-20">Post Not Found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-inter">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:gap-3 transition-all">
        <ArrowLeft className="w-5 h-5" /> Back to Resources
      </button>

      <article className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        
        <div className="p-8 sm:p-16 space-y-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{post.category}</span>
            <span className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase"><Clock className="w-4 h-4" /> {post.readTime} Min Read</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0f172a] leading-tight tracking-tighter">{post.title}</h1>
          
          <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed text-lg" 
               dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* FAQ Section for SEO */}
          <div className="mt-16 bg-blue-50 rounded-[2rem] p-8 border border-blue-100">
            <h2 className="text-2xl font-black text-blue-900 mb-6">Article FAQ</h2>
            <div className="space-y-6">
              {post.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-bold text-[#0f172a] mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}