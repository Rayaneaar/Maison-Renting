import { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatPrice, compactNumber } from "../lib/format";
import Navbar from "../components/Navbar";
import Spinner from "../components/ui/Spinner";
import PillButton from "../components/ui/PillButton";
import NegotiationModal from "../components/NegotiationModal";
import PropertyCard from "../components/PropertyCard";

function StatCard({ label, value, delayClass, chartData = null }) {
  return (
    <div className={`bg-white p-8 animate-fade-up ${delayClass || ''}`}>
      <p className="text-zinc-500 text-xs tracking-wide mb-4">{label}</p>
      <p className="font-sans text-4xl lg:text-5xl font-medium tracking-tight text-black mb-8">{value}</p>
      
      {chartData && (
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <Bar dataKey="val" fill="#d4d4d8" radius={[2, 2, 0, 0]} activeBar={{ fill: '#000000' }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ background: "#000", border: "none", borderRadius: "0px", color: "#fff", fontSize: "12px" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function OfferRow({ o, onClick }) {
  return (
    <div 
      className="border-b border-zinc-200 last:border-0 pb-6 mb-6 cursor-pointer group animate-fade-in"
      onClick={() => onClick(o)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex-1">
          <p className="text-xl font-medium group-hover:text-zinc-600 transition-colors">{o.client?.name}</p>
          <div className="flex flex-wrap gap-3 sm:gap-4 items-center mt-2">
            <span className="text-[10px] uppercase tracking-widest text-black border border-black px-2 py-0.5 font-bold">{o.type}</span>
            <span className="text-zinc-500 text-sm truncate max-w-[150px] sm:max-w-xs">{o.property?.title}</span>
            <span className="text-zinc-400 text-xs">{new Date(o.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center sm:gap-6 mt-2 sm:mt-0">
          <div className="text-left sm:text-right">
             <p className="text-black font-medium text-xl">{o.amount ? formatPrice(o.amount) : "Inquiry"}</p>
             <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">{o.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [properties, setProperties] = useState([]);
  const [offers, setOffers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("portfolio");
  const [activeOffer, setActiveOffer] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      user.role === 'seller' ? api.get("/my/analytics") : Promise.resolve({ data: null }),
      user.role === 'seller' ? api.get("/my/properties") : Promise.resolve({ data: { data: [] } }),
      user.role === 'seller' ? api.get("/my/offers") : Promise.resolve({ data: [] }),
      api.get("/my/requests"),
    ])
      .then(([a, p, o, r]) => {
        setAnalytics(a.data);
        setProperties(p.data.data);
        setOffers(o.data);
        setSentRequests(r.data);
        
        setActiveOffer(current => {
          if (current) {
            const updated = [...o.data, ...r.data].find(x => x.id === current.id);
            return updated || current;
          }
          return current;
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.role]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (user.role !== 'seller' && tab === 'portfolio') {
      setTab('sent');
    }
  }, [user.role, tab]);

  if (loading && !analytics && !sentRequests.length) {
    return (
      <div className="bg-zinc-50 min-h-screen text-black">
        <Navbar />
        <div className="pt-40">
          <Spinner label="Loading dashboard" />
        </div>
      </div>
    );
  }

  const dummyChart1 = Array.from({length: 12}).map((_, i) => ({ val: Math.random() * 100 + 50 }));
  const dummyChart2 = Array.from({length: 12}).map((_, i) => ({ val: Math.random() * 50 + 20 + (i*10) }));
  const dummyChart3 = Array.from({length: 12}).map((_, i) => ({ val: Math.random() * 80 + 30 }));

  const tabs = [];
  if (user.role === 'seller') tabs.push({ id: "portfolio", label: "Portfolio", count: properties.length });
  if (user.role === 'seller') tabs.push({ id: "received", label: "Received", count: offers.length });
  tabs.push({ id: "sent", label: "Sent Requests", count: sentRequests.length });

  return (
    <div className="bg-zinc-50 min-h-screen text-black font-sans">
      <Navbar />
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 pt-36 pb-28">
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20 animate-fade-in">
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mb-4">Reliable facilities<br/>for stable investments</h1>
          </div>
          <div className="text-right max-w-sm hidden md:block">
            <p className="text-sm text-zinc-500 mb-2">Our assets are not just square meters, it's an opportunity for your capital to work for you.</p>
            <p className="text-sm text-zinc-500">We carefully select the best investment offers for our clients.</p>
          </div>
        </div>

        {user.role === 'seller' && analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <StatCard label="Total Residences" value={analytics.totals.properties ?? 0} chartData={dummyChart1} delayClass="[animation-delay:100ms]" />
            <StatCard label="Cumulative Views" value={compactNumber(analytics.totals.views ?? 0)} chartData={dummyChart2} delayClass="[animation-delay:200ms]" />
            <StatCard label="Pending Offers" value={analytics.totals.pending_offers ?? 0} chartData={dummyChart3} delayClass="[animation-delay:300ms]" />
          </div>
        )}

        <div className="flex gap-8 border-b border-zinc-200 mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`pb-4 text-sm font-medium transition-colors ${tab === t.id ? "border-b-2 border-black text-black" : "border-b-2 border-transparent text-zinc-500 hover:text-black"}`}>
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {tab === "received" && (
          <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm">
             {offers.length === 0 ? (
               <p className="text-zinc-500 italic">No received requests.</p>
             ) : (
               offers.map((o) => <OfferRow key={o.id} o={o} onClick={setActiveOffer} />)
             )}
          </div>
        )}

        {tab === "sent" && (
          <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm">
             {sentRequests.length === 0 ? (
               <p className="text-zinc-500 italic">No sent requests.</p>
             ) : (
               sentRequests.map((o) => <OfferRow key={o.id} o={o} onClick={setActiveOffer} />)
             )}
          </div>
        )}

        {tab === "portfolio" && user.role === "seller" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
             {properties.length === 0 ? (
               <p className="text-zinc-500 italic">No properties listed yet.</p>
             ) : (
               properties.map((p) => <PropertyCard key={p.id} property={p} />)
             )}
          </div>
        )}
      </div>

      {activeOffer && (
        <NegotiationModal 
          offer={activeOffer} 
          onClose={() => { setActiveOffer(null); load(); }} 
          onUpdate={(updated) => setActiveOffer(updated)} 
        />
      )}
    </div>
  );
}
