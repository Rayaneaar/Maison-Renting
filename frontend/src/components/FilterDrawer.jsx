import { useState, useEffect } from "react";
import PillButton from "./ui/PillButton";
import UnderlineInput from "./ui/UnderlineInput";

export default function FilterDrawer({ open, onClose, filters, onApply }) {
  const [local, setLocal] = useState(filters);

  useEffect(() => setLocal(filters), [filters, open]);

  const set = (key) => (e) =>
    setLocal((f) => ({ ...f, [key]: e.target.value }));

  const apply = () => {
    onApply(local);
    onClose();
  };

  const reset = () => {
    const cleared = {
      q: "",
      city: "",
      type: "",
      min_price: "",
      max_price: "",
      bedrooms: "",
    };
    setLocal(cleared);
    onApply(cleared);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white border-l border-zinc-200 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-10 overflow-y-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-medium text-4xl text-black">Refine</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-black text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-10 flex-1">
            <UnderlineInput
              label="Search"
              value={local.q || ""}
              onChange={set("q")}
              placeholder="Title, address…"
            />
            <UnderlineInput
              label="City / Location"
              value={local.city || ""}
              onChange={set("city")}
              placeholder="e.g. Milan"
            />

            <div>
              <span className="block text-[11px] uppercase tracking-[0.22em] text-zinc-500 mb-4 font-sans">
                Type
              </span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { v: "", l: "All" },
                  { v: "buy", l: "Buy" },
                  { v: "rent", l: "Rent" },
                ].map((opt) => (
                  <button
                    key={opt.l}
                    onClick={() => setLocal((f) => ({ ...f, type: opt.v }))}
                    className={`py-2.5 rounded-full text-[11px] uppercase tracking-[0.18em] border transition-all ${
                      local.type === opt.v
                        ? "border-black bg-black text-white"
                        : "border-zinc-200 text-zinc-500 hover:border-black hover:text-black"
                    }`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <UnderlineInput
                label="Min Price"
                type="number"
                value={local.min_price || ""}
                onChange={set("min_price")}
                placeholder="0"
              />
              <UnderlineInput
                label="Max Price"
                type="number"
                value={local.max_price || ""}
                onChange={set("max_price")}
                placeholder="Any"
              />
            </div>

            <UnderlineInput
              label="Min Bedrooms"
              type="number"
              value={local.bedrooms || ""}
              onChange={set("bedrooms")}
              placeholder="Any"
            />
          </div>

          <div className="flex gap-4 pt-10">
            <PillButton variant="outline" size="md" onClick={reset} className="flex-1">
              Reset
            </PillButton>
            <PillButton variant="solid" size="md" onClick={apply} className="flex-1">
              Apply
            </PillButton>
          </div>
        </div>
      </aside>
    </>
  );
}
