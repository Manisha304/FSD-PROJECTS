import { useApp } from '../contexts/AppContext.jsx';

export default function Success() {
  const { switchView } = useApp();

  return (
    <div className="w-full max-w-sm my-auto text-center">
      <div className="card py-12 !border-t-4 !border-t-[#10B981]">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-theme-primary mb-2">Submitted!</h2>
        <p className="text-theme-muted mb-8 px-4">Application recorded successfully.</p>
        <button onClick={() => switchView('schemesView')} className="btn-primary !w-auto !px-8 mx-auto">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Services
          </span>
        </button>
      </div>
    </div>
  );
}
