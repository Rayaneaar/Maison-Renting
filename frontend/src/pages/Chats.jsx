import { useEffect, useState, useCallback } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/format";
import Navbar from "../components/Navbar";
import Spinner from "../components/ui/Spinner";
import NegotiationModal from "../components/NegotiationModal";

function OfferRow({ o, onClick }) {
  return (
    <div 
      className="border-b border-zinc-200 last:border-0 pb-6 mb-6 cursor-pointer group animate-fade-in"
      onClick={() => onClick(o)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex-1">
          <p className="font-medium text-xl sm:text-2xl group-hover:text-zinc-600 transition-colors">
            {o.property?.title}
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4 items-center mt-2">
            <span className="text-[10px] uppercase tracking-widest text-black border border-black font-bold px-2 py-0.5 rounded-full">
              {o.type}
            </span>
            <span className="text-zinc-500 text-sm max-w-[150px] sm:max-w-xs truncate">{o.property?.owner?.name || "Seller"}</span>
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

export default function Chats() {
  const { user } = useAuth();
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOffer, setActiveOffer] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/my/requests")
      .then((r) => {
        setSentRequests(r.data);
        setActiveOffer(current => {
          if (current) {
            const updated = r.data.find(x => x.id === current.id);
            return updated || current;
          }
          return current;
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !sentRequests.length) {
    return (
      <div className="bg-sand text-black min-h-screen">
        <Navbar />
        <div className="pt-40">
          <Spinner label="Loading chats" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sand text-black min-h-screen font-sans">
      <Navbar />
      <div className="mx-auto max-w-[1000px] px-6 lg:px-10 pt-36 pb-28">
        <div className="mb-16 animate-fade-in">
          <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold mb-4">Welcome, {user?.name}</p>
          <h1 className="font-medium text-4xl lg:text-5xl tracking-tight">Your Chats</h1>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm">
            {sentRequests.length === 0 ? (
            <p className="text-zinc-500 italic">You have no active chats or requests yet.</p>
            ) : (
            sentRequests.map((o) => <OfferRow key={o.id} o={o} onClick={setActiveOffer} />)
            )}
        </div>
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
