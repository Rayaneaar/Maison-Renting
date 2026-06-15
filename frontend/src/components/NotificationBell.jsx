import { useState, useEffect } from "react";
import api from "../lib/api";
import { toast } from "sonner";

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetch = async () => {
    try {
      const res = await api.get("/notifications");
      const newNotifications = res.data;
      
      setNotifications((prev) => {
        // Find newly arrived unread notifications
        const prevUnreadIds = new Set(prev.filter(n => !n.read_at).map(n => n.id));
        const currentUnread = newNotifications.filter(n => !n.read_at);
        
        currentUnread.forEach(n => {
          if (!prevUnreadIds.has(n.id) && prev.length > 0) {
            // New notification arrived!
            if (n.type.includes('offer_accepted') || n.type.includes('success')) {
              toast.success(n.data.message, { style: { background: '#111', color: '#fff', border: '1px solid #739E82' } });
            } else {
              toast(n.data.message, { style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } });
            }
          }
        });
        return newNotifications;
      });

      setUnread(newNotifications.filter((n) => !n.read_at).length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    await api.post(`/notifications/${id}/read`);
    fetch();
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative text-white/70 hover:text-white transition-colors">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan rounded-full" />}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 glass-strong p-4 rounded-sm animate-fade-up">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-4">Notifications</p>
          <div className="space-y-4">
            {notifications.map((n) => (
              <div key={n.id} className={`text-sm p-3 ${n.read_at ? "text-white/40" : "text-white"}`}>
                <p>{n.data.message}</p>
                {!n.read_at && <button onClick={() => markAsRead(n.id)} className="text-[10px] text-cyan uppercase underline">Mark read</button>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
