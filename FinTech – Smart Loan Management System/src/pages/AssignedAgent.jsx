export default function AssignedAgent() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-1 bg-theme-brand rounded-full" />
          <span className="text-xs font-semibold text-theme-brand uppercase tracking-widest">
            Agent
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-theme-primary">
          Assigned Agent
        </h2>

        <p className="text-theme-muted mt-2">
          Your dedicated relationship manager.
        </p>
      </div>

      <div className="card space-y-4">
        <div>
          <h3 className="font-semibold text-theme-primary">
            Agent Name
          </h3>
          <p className="text-theme-muted">
            Karthavya S
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-theme-primary">
            Phone
          </h3>
          <p className="text-theme-muted">
            +91 98765 43210
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-theme-primary">
            Email
          </h3>
          <p className="text-theme-muted">
            karthavya@fintech.com
          </p>
        </div>
      </div>
    </div>
  );
}