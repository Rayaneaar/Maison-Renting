export default function Spinner({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-white/50">
      <div className="h-10 w-10 rounded-full border border-white/10 border-t-cyan animate-spin" />
      <span className="text-[11px] uppercase tracking-[0.25em]">{label}</span>
    </div>
  );
}
