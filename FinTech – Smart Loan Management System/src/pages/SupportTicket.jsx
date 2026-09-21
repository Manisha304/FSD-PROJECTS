import { useApp } from '../contexts/AppContext.jsx';
export default function SupportTicket() {
  const { switchView } = useApp();
  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-1 bg-theme-brand rounded-full" />
          <span className="text-xs font-semibold text-theme-brand uppercase tracking-widest">
            Support
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-theme-primary">
          Raise a Support Ticket
        </h2>

        <p className="text-theme-muted mt-2">
          Describe your issue and our team will get back to you.
        </p>
      </div>

      <div className="card space-y-4">
        <input
          type="text"
          placeholder="Subject"
          className="input-field"
        />

        <textarea
          placeholder="Describe your issue..."
          rows="5"
          className="input-field"
        />

        <button
  className="btn-primary w-full"
  onClick={() => switchView('successView')}
>
  Submit Ticket
</button>
      </div>
    </div>
  );
}