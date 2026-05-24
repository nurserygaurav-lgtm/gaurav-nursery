import { Outlet } from 'react-router-dom';
import Footer from '../components/navigation/Footer.jsx';
import Header from '../components/navigation/Header.jsx';
import LoginPopupModal from '../components/ui/LoginPopupModal.jsx';
import MobileBottomNav from '../components/navigation/MobileBottomNav.jsx';
import { brandContact } from '../data/brandContent.js';
import { MessageCircle } from 'lucide-react';

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
      <a
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-card transition hover:-translate-y-1 hover:bg-[#1ebe5d]"
        href={`https://wa.me/${brandContact.whatsappPhone}?text=${encodeURIComponent(brandContact.whatsappMessage)}`}
        rel="noreferrer"
        target="_blank"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
    </div>
  );
}
