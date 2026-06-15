import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <p className="font-serif text-3xl tracking-[0.3em] mb-4 text-black">MAISON</p>
          <p className="text-zinc-500 font-sans text-sm max-w-sm leading-relaxed">
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
      <div className="border-t border-zinc-100 py-6 text-center text-[11px] uppercase tracking-[0.22em] text-zinc-400">
        © {new Date().getFullYear()} Maison — All Rights Reserved
      </div>
    </footer>
  );
}
