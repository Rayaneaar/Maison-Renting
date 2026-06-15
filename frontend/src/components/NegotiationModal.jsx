import { useState, useRef, useEffect } from "react";
import api from "../lib/api";
import PillButton from "./ui/PillButton";
import { formatPrice } from "../lib/format";
import { useAuth } from "../context/AuthContext";

export default function NegotiationModal({ offer, onClose, onUpdate }) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [proposedAmount, setProposedAmount] = useState("");
  const [status, setStatus] = useState("pending");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const isSeller = user.id === offer.property.user_id;
  const isBuyer = user.id === offer.client_id;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [offer.messages]);

  const submitReply = async (e) => {
    e.preventDefault();
    if (!message.trim() && status === "pending") return;
    setSubmitting(true);
    setError("");
    try {
      const res = await api.post(`/offers/${offer.id}/reply`, {
        message: message || `Updated status to ${status}`,
        proposed_amount: proposedAmount || null,
        status: status !== "pending" ? status : undefined,
      });
      onUpdate(res.data);
      setMessage("");
      setProposedAmount("");
      setStatus("pending");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl h-[85vh] bg-white rounded-3xl shadow-2xl animate-fade-up flex flex-col overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-zinc-100 flex justify-between items-start shrink-0">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-2">
              {offer.type} Negotiation
            </p>
            <h3 className="font-medium text-2xl lg:text-3xl text-black">{offer.property.title}</h3>
            <p className="text-zinc-500 text-sm mt-2">
              Current Status: <span className="font-medium text-black">{offer.status}</span>
              {offer.amount && ` • Current Offer: ${formatPrice(offer.amount)}`}
              {offer.viewing_date && ` • Viewing: ${new Date(offer.viewing_date).toLocaleString()}`}
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-black text-3xl font-light transition-colors leading-none">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 bg-zinc-50/50">
          {offer.messages?.map((msg) => {
            const isMe = msg.user_id === user.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">{msg.user?.name || "User"}</div>
                <div className={`p-4 rounded-2xl max-w-[80%] ${isMe ? "bg-black text-white" : "bg-white border border-zinc-200 text-black shadow-sm"}`}>
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  {msg.proposed_amount && (
                    <p className={`mt-3 text-xs pt-2 font-medium ${isMe ? "border-t border-white/20 text-white/90" : "border-t border-zinc-100 text-zinc-600"}`}>
                      Proposed Amount: {formatPrice(msg.proposed_amount)}
                    </p>
                  )}
                </div>
                <div className="text-[10px] text-zinc-400 mt-2">{new Date(msg.created_at).toLocaleString()}</div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 lg:p-6 border-t border-zinc-100 shrink-0 bg-white">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={submitReply} className="flex flex-col gap-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-sm text-black placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none transition-all"
              rows={2}
              placeholder="Type your message here..."
            />
            
            <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-white border border-zinc-200 rounded-full px-4 py-2 text-xs text-zinc-700 focus:outline-none focus:border-black appearance-none"
                >
                  <option value="pending">Keep Pending</option>
                  {isSeller && <option value="accepted">Accept Request</option>}
                  {isSeller && <option value="rejected">Decline Request</option>}
                  <option value="countered">Counter Offer</option>
                  {isBuyer && <option value="withdrawn">Withdraw</option>}
                </select>

                {status === "countered" && (
                  <input
                    type="number"
                    value={proposedAmount}
                    onChange={(e) => setProposedAmount(e.target.value)}
                    placeholder="New Amount"
                    className="bg-zinc-50 border border-zinc-200 rounded-full text-black text-sm px-4 py-2 w-28 sm:w-32 focus:outline-none focus:border-black"
                  />
                )}
              </div>

              <PillButton type="submit" variant="solid" size="md" className="w-full sm:w-auto text-center justify-center" disabled={submitting}>
                {submitting ? "Sending..." : "Send Reply"}
              </PillButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
