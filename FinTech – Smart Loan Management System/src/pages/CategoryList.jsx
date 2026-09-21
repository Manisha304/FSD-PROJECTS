import { useState } from 'react';
import { useApp } from '../contexts/AppContext.jsx';

export default function CategoryList() {
  const { currentCategory, switchView, openSchemeForm } = useApp();

  if (!currentCategory) {
    switchView('schemesView');
    return null;
  }

  return (
    <div className="w-full">
      <button onClick={() => switchView('schemesView')} className="btn-secondary mb-6 pl-3 group">
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Categories
      </button>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-1 bg-theme-brand rounded-full" />
          <span className="text-xs font-semibold text-theme-brand uppercase tracking-widest">{currentCategory.name}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-theme-primary">{currentCategory.name}</h2>
        <p className="text-theme-muted mt-2">{currentCategory.desc}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentCategory.schemes.map((s) => (
          <div
            key={s.id}
            className="clickable-item !p-5 !flex-row !items-center !justify-between group"
            onClick={() => openSchemeForm(s.id)}
          >
            <div className="flex items-center gap-3">
                <h4 className="font-semibold text-theme-primary group-hover:text-theme-brand transition-colors">
    {s.name}
  </h4>
              
            </div>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-theme-muted group-hover:text-theme-brand transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}
              </div>

    </div>
  );
}
     
