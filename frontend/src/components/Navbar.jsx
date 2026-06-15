import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import PillButton from "./ui/PillButton";
import NotificationBell from "./NotificationBell";
import LanguageSwitcher from "../i18n/LanguageSwitcher";
import Logo from "./ui/Logo";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${scrolled || mobileMenuOpen ? "bg-white/95 backdrop-blur-xl border-b border-zinc-200 text-black py-4" : "py-6 lg:py-8"}`}>
        <div className="mx-auto max-w-[1500px] px-6 lg:px-10 flex items-center justify-between">
          <Logo />
          
          <nav className="hidden lg:flex items-center gap-10 text-[11px] uppercase tracking-[0.22em] text-zinc-600">
            <Link to="/properties" className="hover:text-black">{t("Collection")}</Link>
            <Link to="/properties?type=buy" className="hover:text-black">{t("Buy")}</Link>
            <Link to="/properties?type=rent" className="hover:text-black">{t("Rent")}</Link>
            {user && user.role === 'seller' && <Link to="/dashboard" className="hover:text-black">{t("Dashboard")}</Link>}
            {user && user.role === 'client' && <Link to="/chats" className="hover:text-black">{t("Chats")}</Link>}
          </nav>

          <div className="hidden lg:flex items-center gap-5">
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

          <div className="lg:hidden flex items-center gap-5">
            {user && <NotificationBell />}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-black">
              {mobileMenuOpen ? <X className="w-7 h-7" strokeWidth={1} /> : <Menu className="w-7 h-7" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white pt-28 px-6 flex flex-col pb-10 overflow-y-auto"
          >
            <nav className="flex flex-col gap-8 text-sm uppercase tracking-[0.22em] text-black mt-4">
              <Link to="/properties" onClick={() => setMobileMenuOpen(false)}>{t("Collection")}</Link>
              <Link to="/properties?type=buy" onClick={() => setMobileMenuOpen(false)}>{t("Buy")}</Link>
              <Link to="/properties?type=rent" onClick={() => setMobileMenuOpen(false)}>{t("Rent")}</Link>
              {user && user.role === 'seller' && <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>{t("Dashboard")}</Link>}
              {user && user.role === 'client' && <Link to="/chats" onClick={() => setMobileMenuOpen(false)}>{t("Chats")}</Link>}
            </nav>

            <div className="mt-auto flex flex-col gap-8 pt-12 border-t border-zinc-100">
              <LanguageSwitcher />
              {user ? (
                <>
                  <Link to={`/profile/${user.id}`} onClick={() => setMobileMenuOpen(false)} className="text-sm uppercase tracking-[0.18em] text-zinc-500 hover:text-black">Profile</Link>
                  <button onClick={handleLogout} className="text-left text-sm uppercase tracking-[0.18em] text-zinc-500 hover:text-black">Logout</button>
                </>
              ) : (
                <div className="mt-4 w-full">
                  <PillButton to="/login" variant="solid" size="md" className="w-full text-center justify-center" onClick={() => setMobileMenuOpen(false)}>Sign In</PillButton>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
