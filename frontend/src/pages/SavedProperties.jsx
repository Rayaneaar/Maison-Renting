import { useEffect, useState } from "react";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/ui/Spinner";
import PropertyCard from "../components/PropertyCard";

export default function SavedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/wishlist")
      .then((res) => setProperties(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-zinc-50 min-h-screen text-black">
        <Navbar />
        <div className="pt-40">
          <Spinner label="Loading saved properties" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 min-h-screen text-black flex flex-col">
      <Navbar />
      <div className="flex-1 mx-auto max-w-[1500px] w-full px-6 lg:px-10 pt-40 pb-20">
        <p className="text-[11px] uppercase tracking-[0.3em] text-cyan font-bold mb-4">Your Collection</p>
        <h1 className="font-serif text-6xl mb-16">Saved Properties</h1>

        {properties.length === 0 ? (
          <div className="glass p-12 text-center rounded-sm">
            <p className="text-white/40 italic text-xl">Your wishlist is currently empty.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {properties.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
