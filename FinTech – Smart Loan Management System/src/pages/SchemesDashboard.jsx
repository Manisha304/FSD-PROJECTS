import { CATEGORIES } from '../data/categories.js';
import { useApp } from '../contexts/AppContext.jsx';

export default function SchemesDashboard() {
  const { openCategory } = useApp();

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-1 bg-theme-brand rounded-full" />
          <span className="text-xs font-semibold text-theme-brand uppercase tracking-widest">Our Offerings</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-theme-primary">Services Offered</h2>
        <p className="text-theme-muted mt-2">
  Select a category to view available schemes.
</p>
</div>
        
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {CATEGORIES.map((c, idx) => (
          <div
            key={c.id}
            className="clickable-item relative overflow-hidden group"
            onClick={() => openCategory(c.id)}
          >
            <div className="icon-box relative z-10">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6">
                <g dangerouslySetInnerHTML={{ __html: c.path }} />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-theme-primary relative z-10">{c.name}</h3>



<div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-theme-light text-theme-brand text-xs font-semibold relative z-10 w-fit">
  {c.schemes.length} Schemes Available

</div>








            <div className="absolute top-0 right-0 w-24 h-24 bg-theme-gradient-light rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
