import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import FilterDrawer from "../components/FilterDrawer";
import Spinner from "../components/ui/Spinner";

const EMPTY = {
  q: "",
  city: "",
  type: "",
  min_price: "",
  max_price: "",
  bedrooms: "",
};

import { motion } from "framer-motion";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filters = {
    ...EMPTY,
    q: searchParams.get("q") || "",
    city: searchParams.get("city") || "",
    type: searchParams.get("type") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    bedrooms: searchParams.get("bedrooms") || "",
  };

  const fetchProperties = useCallback(() => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    api
      .get("/properties", { params })
      .then((res) => setProperties(res.data.data))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const applyFilters = (next) => {
    const params = {};
    Object.entries(next).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    setSearchParams(params);
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-zinc-50 min-h-screen text-black font-sans"
    >
      <Navbar />

      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 pt-36 pb-28">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-4 font-bold">
              The Collection
            </p>
            <h1 className="font-medium text-5xl lg:text-6xl tracking-tight">Residences</h1>
          </div>

          <button
            onClick={() => setDrawerOpen(true)}
            className="self-start md:self-auto flex items-center gap-3 border border-zinc-200 hover:border-black bg-white px-7 py-3 text-[11px] uppercase tracking-[0.22em] transition-colors group"
          >
            <span className="h-1.5 w-1.5 bg-black" />
            Filters
            {activeCount > 0 && (
              <span className="ml-1 text-black font-bold">({activeCount})</span>
            )}
          </button>
        </div>

        {loading ? (
          <Spinner label="Curating" />
        ) : properties.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-medium text-3xl text-zinc-400 mb-4">
              No matching properties found
            </p>
            <p className="text-zinc-400 font-sans">
              Try adjusting your filters to broaden the search.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {properties.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onApply={applyFilters}
      />

      <Footer />
    </motion.div>
  );
}
