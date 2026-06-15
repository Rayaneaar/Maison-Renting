import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import Spinner from "../components/ui/Spinner";
import PropertyCard from "../components/PropertyCard";
import { Star, Mail, Phone, Calendar } from "lucide-react";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get(`/users/${id}`)
      .then(res => setProfile(res.data))
      .catch(() => setError("User not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-zinc-50 min-h-screen text-black">
        <Navbar />
        <div className="pt-40">
          <Spinner label="Loading profile" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-zinc-50 min-h-screen text-black">
        <Navbar />
        <div className="pt-40 flex justify-center text-white/50">
          {error}
        </div>
      </div>
    );
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-zinc-50 min-h-screen text-black">
      <Navbar />
      
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10 pt-36 pb-28">
        
        {/* Header Profile Info */}
        <div className="glass rounded-2xl p-8 lg:p-12 mb-16 flex flex-col items-center text-center gap-6 animate-fade-in">
          <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <span className="text-5xl font-serif text-white/50">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="font-serif text-5xl text-white tracking-tight mb-3">{profile.name}</h1>
            <span className="text-[10px] uppercase tracking-widest text-cyan border border-cyan/30 px-3 py-1 rounded-none">
              {profile.role}
            </span>
          </div>
        </div>

        {/* Seller Specific Content */}
        {profile.role === 'seller' && (
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Left: Properties */}
            <div className="lg:col-span-2">
              <h3 className="font-serif text-3xl mb-8">Active Listings</h3>
              {profile.properties?.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {profile.properties.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              ) : (
                <p className="text-white/40 italic">No active properties available.</p>
              )}
            </div>
            
            {/* Right: Reviews */}
            <div className="space-y-8">
              <h3 className="font-serif text-3xl mb-8">Client Reviews</h3>
              {profile.reviews?.length > 0 ? (
                profile.reviews.map((review) => (
                  <div key={review.id} className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-sm font-serif">
                        {review.reviewer_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-white">{review.reviewer_name}</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-cyan fill-cyan' : 'text-white/10'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">"{review.comment}"</p>
                    <p className="text-[10px] text-white/20 mt-4 uppercase tracking-widest">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-white/40 italic">No reviews yet.</p>
              )}
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
