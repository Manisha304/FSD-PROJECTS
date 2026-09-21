import { useApp } from '../contexts/AppContext.jsx';
import { CATEGORIES } from '../data/categories.js';

export default function ServiceOverview() {
  const { openServiceDetail } = useApp();

  return (
    <div className="w-full space-y-8">
      <div className="section-top">
        <div>
          <span className="eyebrow">Explore services</span>
          <h1>AI-driven financial products built for speed and clarity.</h1>
          <p>Pick any category and discover services designed to simplify loans, savings, insurance, pensions, and welfare benefits.</p>
        </div>
      </div>

      <div className="service-grid">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className="service-card"
            onClick={() => openServiceDetail(category.id)}
          >
            <div className="service-card-icon" dangerouslySetInnerHTML={{ __html: category.path }} />
            <div>
              <p className="service-card-tag">Category</p>
              <h2>{category.name}</h2>
              <p>{category.desc}</p>
            </div>
            <span className="service-card-cta">Explore</span>
          </button>
        ))}
      </div>
    </div>
  );
}
