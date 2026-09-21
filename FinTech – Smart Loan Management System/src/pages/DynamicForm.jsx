import { useApp } from '../contexts/AppContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useState } from 'react';

export default function DynamicForm() {
  const {
    currentCategory,
    currentScheme,
    openCategory,
    addSubmission,
    switchView,
  } = useApp();

  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({});

  if (!currentCategory || !currentScheme) {
    switchView('schemesView');
    return null;
  }

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    addSubmission(formData, currentUser?.id);
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <button
        onClick={() => openCategory(currentCategory.id)}
        className="btn-secondary mb-6 pl-3 group"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-1 bg-theme-brand rounded-full" />
          <span className="text-xs font-semibold text-theme-brand uppercase tracking-widest">
            {currentCategory.name}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-theme-primary">
          {currentScheme.name}
        </h2>

        <p className="text-theme-muted mt-2">
          Fill the required details below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentScheme.fields && currentScheme.fields.length > 0 && (
          <div className="card !border-t-2 !border-t-[#3B82F6]">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-theme-light">
              <h3 className="text-lg font-semibold text-theme-primary">
                Required Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentScheme.fields.map((f, i) => (
                <div key={i}>
                  <label className="label">{f.l}</label>

                  {f.t === 'select' ? (
                    <select
                      name={f.n}
                      required
                      className="input-field"
                      onChange={handleChange}
                    >
                      <option value="">Select Option</option>
                      {f.o.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.t}
                      name={f.n}
                      required
                      className="input-field"
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          style={{ padding: '16px' }}
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Submit Application
          </span>
        </button>
      </form>
    </div>
  );
}