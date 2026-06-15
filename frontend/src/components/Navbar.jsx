import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import PillButton from "./ui/PillButton";
import NotificationBell from "./NotificationBell";
import LanguageSwitcher from "../i18n/LanguageSwitcher";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-zinc-200 text-black py-4" : "py-8"}`}>
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl tracking-[0.3em] text-black">MAISON</Link>
        <nav className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.22em] text-zinc-600">
          <Link to="/properties" className="hover:text-black">{t("Collection")}</Link>
          <Link to="/properties?type=buy" className="hover:text-black">{t("Buy")}</Link>
          <Link to="/properties?type=rent" className="hover:text-black">{t("Rent")}</Link>
          {user && user.role === 'seller' && <Link to="/dashboard" className="hover:text-black">{t("Dashboard")}</Link>}
          {user && user.role === 'client' && <Link to="/chats" className="hover:text-black">{t("Chats")}</Link>}
        </nav>
        <div className="flex items-center gap-5">
          <LanguageSwitcher />
          {user ? (
            <div className="flex items-center gap-6">
              <NotificationBell />
              <Link to={`/profile/${user.id}`} className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 hover:text-black transition-colors">Profile</Link>
              <button onClick={handleLogout} className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 hover:text-black transition-colors">Logout</button>
            </div>
          ) : (
            <PillButton to="/login" variant="solid" size="sm">Sign In</PillButton>
          )}
        </div>
      </div>
    </header>
  );
}
