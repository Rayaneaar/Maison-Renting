import { Link } from "react-router-dom";
import Logo from "./ui/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-12">
        <div className="lg:col-span-2">
          <Logo className="mb-6" />
          <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
            A curated portfolio of the world's most extraordinary residences.
            Architectural living, reimagined for the discerning few.
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500 mb-5">
            Explore
          </p>
          <ul className="space-y-3 text-sm text-zinc-600 font-sans">
            <li>
              <Link to="/properties" className="hover:text-black">
                Collection
              </Link>
            </li>
            <li>
              <Link to="/properties?type=buy" className="hover:text-black">
                Acquire
              </Link>
            </li>
            <li>
              <Link to="/properties?type=rent" className="hover:text-black">
                Reside
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500 mb-5">
            Studio
          </p>
          <ul className="space-y-3 text-sm text-zinc-600 font-sans">
            <li>Côte d'Azur</li>
            <li>New York</li>
            <li>Milano</li>
          </ul>
        </div>
      </div>
      <div className="mt-20 pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
        <p>
          © {new Date().getFullYear()} immoMaroc — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
