import { useApp } from '../contexts/AppContext.jsx';

export default function Toast() {
  const { toast } = useApp();

  return (
    <div
      id="toast"
      style={{
        opacity: toast.visible ? 1 : 0,
        transform: toast.visible
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(20px)',
      }}
    >
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
