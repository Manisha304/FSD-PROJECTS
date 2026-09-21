import { useState } from 'react';
import { useApp } from '../contexts/AppContext.jsx';

const STEPS = [
  {
    title: 'One gateway for financial services',
    subtitle: 'Loans, insurance, investments, pensions and welfare — all under one AI-driven roof.',
    bullets: [
      'Streamlined application flow for every service.',
      'Unified profile and document vault.',
      'Real-time status updates and alerts.',
    ],
    badge: 'Smart onboarding',
  },
  {
    title: 'AI that understands your financial profile',
    subtitle: 'Intelligent eligibility, recommendations and approval probability in seconds.',
    bullets: [
      'AI eligibility score for every service.',
      'Bank and plan recommendations tailored to your needs.',
      'Automated document checks and risk scoring.',
    ],
    badge: 'AI-powered insights',
  },
  {
    title: 'All services in a consistent workflow',
    subtitle: 'Find the right offer, submit once, and track progress from a modern dashboard.',
    bullets: [
      'Single application flow across categories.',
      'Track approvals, documents, and payments in one place.',
      'Reuse profile data for faster future requests.',
    ],
    badge: 'Service control',
  },
  {
    title: 'Secure, modern and built for trust',
    subtitle: 'Your data stays protected with encrypted storage and enterprise-grade privacy controls.',
    bullets: [
      'Secure document vault with guided uploads.',
      'Privacy-first consent and user controls.',
      'Trusted partner network for faster approvals.',
    ],
    badge: 'Secure by design',
  },
];

export default function OnboardingTour() {
  const { completeTour, switchView } = useApp();
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  function handleNext() {
    if (step === STEPS.length - 1) {
      completeTour();
      switchView('loginView');
    } else {
      setStep(step + 1);
    }
  }

  function handleSkip() {
    completeTour();
    switchView('loginView');
  }

  return (
    <div className="tour-shell">
      <div className="tour-panel">
        <div className="tour-hero">
          <span className="tour-eyebrow">Product tour</span>
          <h1>Welcome to the future of fintech onboarding.</h1>
          <p>Follow a quick tour to understand how our AI-first platform powers every financial journey.</p>
          <div className="tour-progress">
            {STEPS.map((_, index) => (
              <div
                key={index}
                className={`tour-progress-dot ${index <= step ? 'active' : ''}`}
              />
            ))}
          </div>
          <button type="button" className="btn btn-outline-secondary" onClick={handleSkip}>
            Skip tour
          </button>
        </div>

        <div className="tour-card">
          <div className="tour-card-badge">{current.badge}</div>
          <h2>{current.title}</h2>
          <p className="tour-card-subtitle">{current.subtitle}</p>
          <ul className="tour-features">
            {current.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="tour-actions">
            <span>{step + 1} / {STEPS.length}</span>
            <button type="button" className="btn btn-primary btn-large" onClick={handleNext}>
              {step === STEPS.length - 1 ? 'Finish tour' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
