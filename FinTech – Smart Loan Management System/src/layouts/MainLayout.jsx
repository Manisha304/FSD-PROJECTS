import Navbar from '../components/Navbar.jsx';
import BottomNav from '../components/BottomNav.jsx';
import Chatbot from '../components/Chatbot.jsx';
import Toast from '../components/Toast.jsx';

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col items-center px-4 py-8 md:py-12 pb-24 md:pb-12 w-full max-w-7xl mx-auto">
        {children}
      </main>
      <BottomNav />
      <Chatbot />
      <Toast />
    </>
  );
}
