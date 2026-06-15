import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, ChevronLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function MiniChat() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const [reqsRes, offersRes] = await Promise.all([
        api.get("/my/requests"),
        user.role === 'seller' ? api.get("/my/offers") : Promise.resolve({ data: [] })
      ]);
      const reqsData = Array.isArray(reqsRes.data) ? reqsRes.data : [];
      const offersData = Array.isArray(offersRes.data) ? offersRes.data : [];
      const all = [...reqsData, ...offersData];
      // Only keep accepted
      const accepted = all.filter(o => o.status === 'accepted');
      
      // Remove duplicates if any (though shouldn't be since one is client_id one is property.owner_id)
      const unique = Array.from(new Map(accepted.map(item => [item.id, item])).values());
      
      setConversations(unique);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (open && user) {
      fetchConversations();
    }
  }, [open, user]);

  const selectThread = (thread) => {
    setActiveThread(thread);
  };

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeThread) return;
    
    setLoading(true);
    try {
      const res = await api.post(`/offers/${activeThread.id}/reply`, {
        message: input,
      });
      // Update thread in place
      setActiveThread(res.data.offer);
      setInput("");
      // Update in list
      setConversations(prev => prev.map(c => c.id === activeThread.id ? res.data.offer : c));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-white text-ink-950 shadow-2xl hover:scale-105 transition-transform duration-300 ${open ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
        {conversations.length > 0 && !open && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-ink-950"></span>
        )}
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] flex flex-col glass-strong shadow-2xl transition-all duration-500 origin-bottom-right ${open ? 'scale-100 opacity-100 rounded-2xl h-[500px]' : 'scale-50 opacity-0 h-[0px] pointer-events-none overflow-hidden'}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.05] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {activeThread && (
              <button onClick={() => setActiveThread(null)} className="text-white/40 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h3 className="font-sans font-medium text-white tracking-tight">
                {activeThread ? activeThread.property?.title : 'Messages'}
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
                {activeThread ? `Active ${activeThread.type}` : 'Active Conversations'}
              </p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!user ? (
          <div className="flex-1 flex items-center justify-center p-5 text-center text-white/50 text-sm">
            Please log in to view your messages.
          </div>
        ) : !activeThread ? (
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <div className="flex items-center justify-center h-full text-white/50 text-sm">
                No active conversations.
              </div>
            ) : (
              conversations.map(c => (
                <button
                  key={c.id}
                  onClick={() => selectThread(c)}
                  className="w-full text-left p-4 hover:bg-white/5 rounded-xl transition-colors flex flex-col gap-1 border-b border-white/5 last:border-0"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan font-bold">{c.type}</span>
                  <span className="font-medium">{c.property?.title}</span>
                  <span className="text-xs text-white/50 line-clamp-1">
                    {c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1].message : 'No messages yet.'}
                  </span>
                </button>
              ))
            )}
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeThread.messages?.map((m) => {
                const isMe = m.user_id === user.id;
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 max-w-[85%] text-sm leading-relaxed ${isMe ? 'bg-white text-ink-950 rounded-2xl rounded-tr-sm' : 'bg-white/5 text-white/90 border border-white/[0.05] rounded-2xl rounded-tl-sm'}`}>
                      {m.message || (m.proposed_amount && `Proposed Amount: ${m.proposed_amount}`)}
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={send} className="p-4 border-t border-white/[0.05] shrink-0 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={loading}
                className="flex-1 bg-transparent border border-white/10 rounded-full px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="p-3 rounded-full bg-white text-ink-950 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
