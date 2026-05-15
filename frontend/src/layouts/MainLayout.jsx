import { Outlet } from 'react-router-dom';
import Footer from '../components/navigation/Footer.jsx';
import Header from '../components/navigation/Header.jsx';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f7faf5]">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
