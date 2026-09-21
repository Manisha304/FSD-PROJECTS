import { useApp } from '../contexts/AppContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function BottomNav() {
  const { currentView, switchView, contactAdmin, getUnreadNotifications } = useApp();
  const { logout, currentUser, isAdmin, isAgent, isClient } = useAuth();

  function handleLogout() {
    logout();
    switchView('loginView');
  }

  const unreadNotifs = getUnreadNotifications(currentUser?.role).length;

  const isActive = (views) => views.includes(currentView);

  return (
    <div className="bottom-nav safe-area shadow-[0_-2px_10px_rgba(37,99,235,0.06)]">
      <button
        onClick={() => switchView(isAdmin ? 'adminDashboardView' : isAgent ? 'agentDashboardView' : 'clientDashboardView')}
        className={isActive(['clientDashboardView', 'agentDashboardView', 'adminDashboardView']) ? 'active' : ''}
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Dashboard
      </button>
      {(isClient || isAgent) && (
        <button
          onClick={() => switchView('schemesView')}
          className={isActive(['schemesView', 'categoryListView', 'formView', 'successView']) ? 'active' : ''}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Services
        </button>
      )}
      <button
        onClick={() => switchView('submissionsView')}
        className={currentView === 'submissionsView' ? 'active' : ''}
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {isClient ? 'Apps' : 'Apps'}
        {unreadNotifs > 0 && <span className="absolute top-0 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{unreadNotifs}</span>}
      </button>
      <button
        onClick={() => switchView('profileView')}
        className={isActive(['profileView']) ? 'active' : ''}
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Profile
      </button>
      {!isAdmin && (
        <button
  onClick={() => switchView('contactView')}
  className={isActive(['contactView']) ? 'active' : ''}
>
         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Contact
        </button>
      )}
      <button onClick={handleLogout}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </div>
  );
}
