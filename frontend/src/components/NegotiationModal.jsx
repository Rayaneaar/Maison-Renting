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

  // Auto-scroll to bottom of messages
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl h-[85vh] glass-strong rounded-sm animate-fade-up flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex justify-between items-start shrink-0">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyan font-bold mb-2">
              {offer.type} Negotiation
            </p>
            <h3 className="font-serif text-3xl">{offer.property.title}</h3>
            <p className="text-white/50 text-sm mt-1">
              Current Status: <span className="text-white">{offer.status}</span>
              {offer.amount && ` • Current Offer: ${formatPrice(offer.amount)}`}
              {offer.viewing_date && ` • Viewing: ${new Date(offer.viewing_date).toLocaleString()}`}
            </p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white text-2xl">×</button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {offer.messages?.map((msg) => {
            const isMe = msg.user_id === user.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className="text-[10px] text-white/40 mb-1">{msg.user?.name || "User"}</div>
                <div className={`p-4 rounded-sm max-w-[80%] ${isMe ? "bg-white/10 text-white" : "glass text-white/80"}`}>
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  {msg.proposed_amount && (
                    <p className="mt-3 text-xs text-cyan border-t border-white/10 pt-2">
                      Proposed Amount: {formatPrice(msg.proposed_amount)}
                    </p>
                  )}
                </div>
                <div className="text-[9px] text-white/30 mt-1">{new Date(msg.created_at).toLocaleString()}</div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Box */}
        <div className="p-8 border-t border-white/10 shrink-0 bg-black/20">
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <form onSubmit={submitReply} className="flex flex-col gap-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-transparent border border-white/10 rounded-sm p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan resize-none"
              rows={2}
              placeholder="Type your message..."
            />
            
            <div className="flex items-end justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-ink-900 border border-white/10 rounded-sm px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-cyan"
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
                    className="bg-transparent border-b border-white/20 text-white text-sm px-2 py-1 w-32 focus:outline-none focus:border-cyan"
                  />
                )}
              </div>

              <PillButton type="submit" variant="cyan" size="sm" disabled={submitting}>
                {submitting ? "Sending..." : "Send"}
              </PillButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
