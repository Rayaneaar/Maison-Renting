import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { formatPrice, FALLBACK_IMAGE } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";
import OfferModal from "../components/OfferModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft, ArrowRight, X, Navigation, Info, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function PropertyDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOffer, setShowOffer] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/properties/${slug}`)
      .then((res) => setProperty(res.data.data))
      .catch(() => setProperty(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <Spinner label="Loading..." />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-2xl text-zinc-500 font-medium">Not found</p>
      </div>
    );
  }

  const images = property.images?.length
    ? property.images
    : [{ url: property.primary_image || FALLBACK_IMAGE }];
  const currentImg = images[activeImg]?.url || FALLBACK_IMAGE;

  const nextImg = () => setActiveImg((prev) => (prev + 1) % images.length);
  const prevImg = () => setActiveImg((prev) => (prev - 1 + images.length) % images.length);

  const handleEnquire = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/properties/${slug}` } } });
      return;
    }
    setShowOffer(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white text-black min-h-screen font-sans"
    >
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-10">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-10">
            <div>
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-black text-xs font-medium uppercase tracking-wider mb-6 lg:mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Collection
              </button>
              <h1 className="text-4xl lg:text-7xl font-medium tracking-tight mb-4">
                {property.title}
              </h1>
              <p className="text-lg lg:text-xl text-zinc-500">{property.city}, {property.address}</p>
            </div>
            <div className="flex flex-col w-full lg:w-auto lg:items-end mt-4 lg:mt-0">
              <p className="text-3xl lg:text-4xl font-medium mb-4">{formatPrice(property.price, property.type)}</p>
              <button 
                onClick={handleEnquire}
                className="bg-black text-white px-8 py-3 text-sm hover:bg-zinc-800 transition-colors w-full lg:w-auto"
              >
                {property.type === 'rent' ? 'Request to Book' : 'Make an Enquiry'}
              </button>
            </div>
          </div>

          <div className="relative aspect-video lg:aspect-[21/9] w-full overflow-hidden bg-zinc-100 mb-12 lg:mb-16">
            <motion.img 
              layoutId={`property-image-${property.id}`}
              src={currentImg} 
              alt={property.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {images.length > 1 && (
              <div className="absolute bottom-6 right-6 flex gap-2">
                <button onClick={prevImg} className="w-10 h-10 bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors">
                  <ArrowLeft className="w-4 h-4 text-black" />
                </button>
                <button onClick={nextImg} className="w-10 h-10 bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors">
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-medium mb-6">About the property</h2>
              <p className="text-zinc-600 leading-relaxed text-lg mb-12">
                {property.description || "A magnificent architectural masterpiece offering unparalleled design and sophisticated living spaces."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 py-10 border-t border-b border-zinc-200">
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Total Area</p>
                  <p className="text-2xl font-medium">{property.area} M²</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Layout</p>
                  <p className="text-2xl font-medium">{property.bedrooms} Bed, {property.bathrooms} Bath</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Property Type</p>
                  <p className="text-2xl font-medium capitalize">{property.type}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Reference</p>
                  <p className="text-2xl font-medium uppercase tracking-wider">MSN-{String(property.id).padStart(4, "0")}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-zinc-50 p-8 mb-8">
                <h3 className="font-medium mb-6">Location Data</h3>
                <div className="flex items-center gap-4 text-zinc-600 mb-4">
                  <Navigation className="w-5 h-5 text-black" />
                  <span>{property.latitude?.toFixed(4) || "43.7384"} N, {property.longitude?.toFixed(4) || "7.4246"} E</span>
                </div>
              </div>

              <div className="bg-zinc-50 p-8">
                <h3 className="font-medium mb-6">Contact Agent</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-zinc-200 rounded-full" />
                  <div>
                    <p className="font-medium">{property.owner?.name || "immoMaroc Advisory"}</p>
                    <p className="text-sm text-zinc-500">Senior Broker</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white border border-zinc-200 py-2 hover:border-black transition-colors flex justify-center items-center gap-2 text-sm">
                    <Phone className="w-4 h-4" /> Call
                  </button>
                  <button className="flex-1 bg-white border border-zinc-200 py-2 hover:border-black transition-colors flex justify-center items-center gap-2 text-sm">
                    <Mail className="w-4 h-4" /> Email
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />

      {showOffer && (
        <OfferModal property={property} onClose={() => setShowOffer(false)} />
      )}
    </motion.div>
  );
}
