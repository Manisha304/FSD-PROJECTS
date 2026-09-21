import { useApp } from '../contexts/AppContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Navbar() {
  const { currentView, switchView, contactAdmin, getUnreadNotifications } = useApp();
  const { logout, isAdmin, isAgent, isClient, currentUser } = useAuth();

  function handleLogout() {
    logout();
    switchView('loginView');
  }

  const unreadNotifs = getUnreadNotifications(currentUser?.role).length;

  const isActive = (views) => views.includes(currentView);

  const initials = currentUser?.name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <header className="navbar-white py-2.5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="FinTech" className="w-8 h-8 object-contain" />
        <span className="text-lg font-bold text-theme-primary tracking-tight">FinTech</span>
      </div>
      <div className="hidden md:flex items-center gap-0.5">
        {(isClient || isAgent) && (
          <button
            onClick={() => switchView(isAgent ? 'agentDashboardView' : 'clientDashboardView')}
            className={`nav-link-white ${isActive(['clientDashboardView', 'agentDashboardView']) ? 'active' : ''}`}
          >
            Dashboard
          </button>
        )}
        {(isClient || isAgent) && (
          <button
            onClick={() => switchView('schemesView')}
            className={`nav-link-white ${isActive(['schemesView', 'categoryListView', 'formView', 'successView']) ? 'active' : ''}`}
          >
            Services
          </button>
        )}
        {isAdmin && (
          <button
            onClick={() => switchView('adminDashboardView')}
            className={`nav-link-white ${isActive(['adminDashboardView']) ? 'active' : ''}`}
          >
            Dashboard
          </button>
        )}
        <button
          onClick={() => switchView('submissionsView')}
          className={`nav-link-white ${isActive(['submissionsView']) ? 'active' : ''}`}
        >
          {isClient ? 'My Applications' : isAgent ? 'All Applications' : 'Applications'}
        </button>
        {!isAdmin && (
          <button onClick={contactAdmin} className="nav-link-white">
            Contact Admin
          </button>
        )}
        <div className="w-px h-5 bg-[#E2E8F0] mx-2" />
        {unreadNotifs > 0 && (
          <button onClick={() => switchView(isAdmin ? 'adminDashboardView' : isAgent ? 'agentDashboardView' : 'clientDashboardView')} className="relative p-2 text-[#64748B] hover:text-[#2563EB] rounded-lg transition-all duration-200 hover:bg-[#F0F5FF]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadNotifs > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">{unreadNotifs}</span>}
          </button>
        )}
        <div className="flex items-center gap-2 pl-2 ml-1 border-l border-[#E2E8F0]">
          <div className="profile-avatar-sm">{initials}</div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-semibold text-theme-primary leading-tight">{currentUser?.name}</span>
            <span className="role-badge-blue">{currentUser?.role}</span>
          </div>
          <button onClick={() => switchView('profileView')} className="p-1.5 text-[#64748B] hover:text-[#2563EB] rounded-lg transition-all duration-200 hover:bg-[#F0F5FF]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          <button onClick={handleLogout} className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] rounded-lg transition-all duration-200 hover:bg-[#FEF2F2]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
