import { useState } from "react";
import api from "../lib/api";
import PillButton from "./ui/PillButton";
import UnderlineInput from "./ui/UnderlineInput";

export default function OfferModal({ property, onClose }) {
  const isRent = property.type === "rent";
  const [type, setType] = useState(isRent ? "booking" : "offer");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [viewingDate, setViewingDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const getDays = () => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };
  const days = getDays();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (type === 'offer' && !amount && !message.trim()) {
      setError("Please enter an offer amount or a message.");
      return;
    }
    if (type === 'viewing' && !viewingDate) {
      setError("Please select a date for your viewing.");
      return;
    }
    if (type === 'booking' && (!startDate || !endDate)) {
      setError("Please select a start and end date.");
      return;
    }
    setSubmitting(true);
    try {
      const finalAmount = type === 'booking' && days > 0 ? (days * property.price) : (amount || null);
      
      await api.post(`/properties/${property.slug}/offers`, {
        type,
        amount: finalAmount,
        message: message || null,
        viewing_date: viewingDate || null,
        start_date: startDate || null,
        end_date: endDate || null,
      });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit your request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 font-sans text-black">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-fade-up p-6 lg:p-8 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-zinc-400 hover:text-black text-2xl"
        >
          ×
        </button>

        {done ? (
          <div className="text-center py-8">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 font-bold">
              Received
            </p>
            <h3 className="font-medium text-4xl mb-4 text-black tracking-tight">Thank you</h3>
            <p className="text-zinc-600 mb-8">
              Your request has been delivered to the owner of{" "}
              <span className="text-black font-medium">{property.title}</span>. They will
              be in touch shortly.
            </p>
            <PillButton variant="solid" onClick={onClose} className="w-full justify-center">
              Close
            </PillButton>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
               {isRent ? (
                 <button onClick={() => setType("booking")} className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${type === "booking" ? "bg-black text-white shadow-sm" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-black"}`}>Booking</button>
               ) : (
                 <button onClick={() => setType("offer")} className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${type === "offer" ? "bg-black text-white shadow-sm" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-black"}`}>Offer</button>
               )}
               <button onClick={() => setType("inquiry")} className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${type === "inquiry" ? "bg-black text-white shadow-sm" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-black"}`}>Inquire</button>
            </div>
            
            <h3 className="font-medium text-3xl mb-2 tracking-tight line-clamp-1">{property.title}</h3>
            <p className="text-zinc-500 text-sm mb-8">
              {type === "offer" && "Submit a formal offer to the seller."}
              {type === "booking" && "Request specific dates to book this rental property."}
              {type === "viewing" && "Request a private tour of this residence."}
              {type === "inquiry" && "Ask the seller a question about the property."}
            </p>

            {error && (
              <div className="mb-6 text-sm text-red-600 border border-red-200 bg-red-50 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-6">
              {type === "offer" && (
                <UnderlineInput
                  label="Your Offer (MAD)"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000000"
                />
              )}
              {type === "booking" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-black transition-colors cursor-pointer">
                      <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Check-in</span>
                      <input
                        type="date"
                        value={startDate}
                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                        onKeyDown={(e) => e.preventDefault()}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-transparent text-sm text-black focus:outline-none cursor-pointer"
                      />
                    </label>
                    <label className="block bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-black transition-colors cursor-pointer">
                      <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Check-out</span>
                      <input
                        type="date"
                        value={endDate}
                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                        onKeyDown={(e) => e.preventDefault()}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-transparent text-sm text-black focus:outline-none cursor-pointer"
                      />
                    </label>
                  </div>
                  {days > 0 && (
                    <div className="bg-zinc-50 rounded-xl p-4 flex justify-between items-center animate-fade-in border border-zinc-100 mt-4">
                      <div className="text-sm">
                        <span className="text-zinc-500 block mb-1">Total Stay</span>
                        <span className="text-black font-medium">{days} {days === 1 ? 'Night' : 'Nights'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-500 text-sm block mb-1">Total Price</span>
                        <span className="font-medium text-xl tracking-tight text-black">{(days * property.price).toLocaleString()} MAD</span>
                      </div>
                    </div>
                  )}
                </>
              )}
              {type === "viewing" && (
                <label className="block bg-zinc-50 border border-zinc-200 rounded-xl p-3 focus-within:border-black transition-colors cursor-pointer">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Preferred Date & Time</span>
                  <input
                    type="datetime-local"
                    value={viewingDate}
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                    onKeyDown={(e) => e.preventDefault()}
                    onChange={(e) => setViewingDate(e.target.value)}
                    className="w-full bg-transparent text-sm text-black focus:outline-none cursor-pointer"
                  />
                </label>
              )}
              <UnderlineInput
                as="textarea"
                rows={3}
                label={type === "inquiry" ? "Your Question" : "Additional Message"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={type === "inquiry" ? "What are the HOA fees?" : "Optional message to the owner"}
              />
              <PillButton
                type="submit"
                variant="solid"
                size="lg"
                className="w-full mt-2 justify-center"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Send Request"}
              </PillButton>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
