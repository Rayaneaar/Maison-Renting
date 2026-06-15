export default function UnderlineInput({
  label,
  type = "text",
  as = "input",
  className = "",
  ...props
}) {
  const Tag = as;
  return (
    <label className="block group">
      {label && (
        <span className="block text-[11px] uppercase tracking-[0.22em] text-zinc-500 mb-3 font-sans">
          {label}
        </span>
      )}
      <Tag
        type={type}
        className={`w-full bg-transparent border-0 border-b border-zinc-200 pb-3 text-black placeholder-zinc-400 font-sans text-lg focus:outline-none focus:border-black transition-colors duration-300 ${className}`}
        {...props}
      />
    </label>
  );
}
