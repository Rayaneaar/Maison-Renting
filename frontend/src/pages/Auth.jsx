import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UnderlineInput from "../components/ui/UnderlineInput";
import PillButton from "../components/ui/PillButton";
import Logo from "../components/ui/Logo";

const SPLIT_IMAGE =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85";

export default function Auth({ mode = "login" }) {
  const isLogin = mode === "login";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "client",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      let user;
      const payload = { ...form, email: form.email.trim(), password: form.password.trim() };
      if (isLogin) {
        user = await login({ email: payload.email, password: payload.password });
      } else {
        user = await register(payload);
      }
      const dest = from || (user.role === "seller" ? "/dashboard" : "/properties");
      navigate(dest, { replace: true });
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors) {
        const flat = {};
        Object.entries(res.errors).forEach(([k, v]) => (flat[k] = v[0]));
        setErrors(flat);
      } else {
        setErrors({ general: res?.message || "Something went wrong." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white text-black">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src={SPLIT_IMAGE}
          alt="Architecture"
          className="absolute inset-0 h-full w-full object-cover animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/60" />
        <div className="absolute bottom-16 left-12 right-12">
          <Logo className="mb-6" lightText={true} />
          <p className="font-serif text-5xl leading-tight text-white/90 max-w-md">
            Step into a world reserved for the few.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-8 lg:py-16">
        <div className="w-full max-w-md animate-fade-up mt-8 lg:mt-0">
          <div className="lg:hidden flex justify-center mb-10">
            <Logo />
          </div>

          <p className="text-[11px] uppercase tracking-[0.3em] text-cyan font-bold mb-4">
            {isLogin ? "Welcome Back" : "Become a Member"}
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl mb-10">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>

          {errors.general && (
            <div className="mb-6 text-sm text-red-600 border border-red-200 bg-red-50 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {!isLogin && (
              <UnderlineInput
                label="Full Name"
                value={form.name}
                onChange={update("name")}
                placeholder="Jane Doe"
              />
            )}

            <div>
              <UnderlineInput
                label="Email"
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-2">{errors.email}</p>
              )}
            </div>

            <div>
              <UnderlineInput
                label="Password"
                type="password"
                value={form.password}
                onChange={update("password")}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-2">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <>
                <UnderlineInput
                  label="Confirm Password"
                  type="password"
                  value={form.password_confirmation}
                  onChange={update("password_confirmation")}
                  placeholder="••••••••"
                />

                <div>
                  <span className="block text-[11px] uppercase tracking-[0.22em] text-zinc-500 mb-4 font-sans">
                    I am a
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { v: "client", l: "Buyer / Renter" },
                      { v: "seller", l: "Owner / Agent" },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.v}
                        onClick={() =>
                          setForm((f) => ({ ...f, role: opt.v }))
                        }
                        className={`py-3 rounded-none text-[11px] uppercase tracking-[0.18em] border transition-all ${
                          form.role === opt.v
                              ? "border-cyan bg-cyan/10 text-cyan"
                              : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                        }`}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <PillButton
              type="submit"
              variant="solid"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting
                ? "Please wait…"
                : isLogin
                ? "Enter"
                : "Create Account"}
            </PillButton>
          </form>

          <p className="mt-10 text-sm text-zinc-500 font-sans">
            {isLogin ? "Not a member yet?" : "Already have an account?"}{" "}
            <Link
              to={isLogin ? "/register" : "/login"}
              className="text-cyan hover:text-cyan-light"
            >
              {isLogin ? "Create one" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
