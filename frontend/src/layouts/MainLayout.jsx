import { Outlet } from 'react-router-dom';
import Footer from '../components/navigation/Footer.jsx';
import Header from '../components/navigation/Header.jsx';
import LoginPopupModal from '../components/ui/LoginPopupModal.jsx';
import MobileBottomNav from '../components/navigation/MobileBottomNav.jsx';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f7faf5]">
      <Header />
      <LoginPopupModal />
      <main>
        <Outlet />
      </main>
      <MobileBottomNav />
      <Footer />
    </div>
  );
}
