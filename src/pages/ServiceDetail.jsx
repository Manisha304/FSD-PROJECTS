import { useApp } from '../contexts/AppContext.jsx';
import { CATEGORIES } from '../data/categories.js';

export default function ServiceDetail() {
  const { selectedService, switchView } = useApp();

  if (!selectedService) {
    return (
      <div className="empty-state-card">
        <h2>Select a service category first.</h2>
        <p>Return to the service overview to choose a category and see AI-powered details.</p>
        <button type="button" className="btn btn-primary btn-large" onClick={() => switchView('serviceOverviewView')}>
          View Services
        </button>
      </div>
    );
  }

  const features = selectedService.schemes.slice(0, 4).map((scheme) => scheme.name);

  return (
    <div className="service-detail-shell">
      <div className="section-top">
        <div>
          <span className="eyebrow">{selectedService.name}</span>
          <h1>{selectedService.desc}</h1>
          <p>Explore AI-first capabilities, secure workflows, and the top services available for this category.</p>
        </div>
        <button type="button" className="btn btn-outline-secondary" onClick={() => switchView('serviceOverviewView')}>
          Back to services
        </button>
      </div>

      <div className="service-detail-grid">
        <div className="glass-panel">
          <h2>What you can do</h2>
          <p>Access clear product paths, instant eligibility checks, and guided document uploads for every service.</p>
          <ul className="feature-list">
            <li>AI-driven service recommendations</li>
            <li>One profile for every application</li>
            <li>Shared document vault across categories</li>
            <li>Real-time progress tracking</li>
          </ul>
        </div>

        <div className="glass-panel glass-highlight">
          <h2>Top services</h2>
          <div className="feature-pill-grid">
            {features.map((name) => (
              <span key={name} className="feature-pill">{name}</span>
            ))}
          </div>
          <div className="detail-cta">
            <p>Ready to start?</p>
            <button type="button" className="btn btn-primary btn-large" onClick={() => switchView('categoryListView')}>
              Apply now
            </button>
          </div>
        </div>
      </div>

      <div className="service-detail-demo">
        <div className="demo-panel">
          <h3>AI Benefits</h3>
          <ul>
            <li>Personalized lender matching</li>
            <li>Eligibility scoring in seconds</li>
            <li>Approval probability estimates</li>
            <li>Secure digital document flow</li>
          </ul>
        </div>
        <div className="demo-panel demo-visual">
          <h3>Demo preview</h3>
          <div className="demo-visual-screen">
            <span>Dashboard snapshot</span>
          </div>
        </div>
      </div>
    </div>
  );
}
