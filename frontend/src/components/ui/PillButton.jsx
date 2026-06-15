import { Link } from "react-router-dom";

const variants = {
  solid:
    "bg-black text-white hover:bg-zinc-800 hover:scale-[1.02]",
  outline:
    "bg-white text-black border border-zinc-200 hover:border-zinc-400",
  cyan: "bg-black text-white hover:bg-zinc-800 hover:scale-[1.02]", // fallback mapping
  ghost: "bg-transparent text-zinc-500 hover:text-black",
};

const sizes = {
  sm: "px-5 py-2.5 text-[10px]",
  md: "px-8 py-3.5 text-[11px]",
  lg: "px-10 py-4 text-[12px]",
};

export default function PillButton({
  children,
  variant = "solid",
  size = "md",
  to,
  className = "",
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium uppercase tracking-[0.2em] transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
