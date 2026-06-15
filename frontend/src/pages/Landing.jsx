import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { getFallbackImage } from "../lib/format";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HERO_IMAGE = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=85";

export default function Landing() {
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/properties")
      .then((res) => setFeatured(res.data.data.slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-sand text-black min-h-screen font-sans flex flex-col relative"
    >
      <div className="absolute top-0 w-full z-50">
        <Navbar />
      </div>

      <section className="relative w-full h-screen flex flex-col lg:flex-row pt-[60px] lg:pt-[80px]">
        <div className="hidden lg:flex w-1/2 h-full bg-sand relative p-12 flex-col justify-end z-10">
          <div className="max-w-md">
            <h2 className="text-xl font-medium tracking-tight mb-4">Elevating Real Estate</h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We specialize in curating exceptional properties that elevate your lifestyle. Explore a world of architectural brilliance and unmatched comfort.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 h-full relative">
          <img 
            src={HERO_IMAGE} 
            alt="Modern architectural home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 lg:bg-transparent" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent via-sand/60 to-transparent pointer-events-none" />
          
          <div className="max-w-4xl text-center flex flex-col items-center relative z-30 px-6 pt-20">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-[3.5rem] md:text-[5rem] lg:text-[7rem] font-medium leading-[0.95] tracking-tight mb-8 text-white lg:text-zinc-900 drop-shadow-sm lg:drop-shadow-none"
              style={{ letterSpacing: "-0.02em" }}
            >
              Discover the perfect<br/>home for your life
            </motion.h1>
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              onClick={() => navigate("/properties")}
              className="mt-4 pointer-events-auto bg-white text-black lg:bg-black lg:text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-zinc-200 lg:hover:bg-zinc-800 transition-colors"
            >
              Start Exploring
            </motion.button>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 px-6 lg:px-16 max-w-[1800px] mx-auto w-full bg-sand">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 lg:mb-12 gap-4">
          <h2 className="text-3xl lg:text-4xl font-medium tracking-tight">Featured Properties</h2>
          <Link to="/properties" className="text-sm font-medium hover:underline text-zinc-600">Explore all</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featured.map((p, idx) => (
            <div 
              key={p.id} 
              onClick={() => navigate(`/properties/${p.slug}`)}
              className="group cursor-pointer flex flex-col bg-white border border-zinc-200 overflow-hidden hover:shadow-lg transition-all duration-500 h-full"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                <motion.img
                  layoutId={`property-image-${p.id}`}
                  src={p.primary_image || getFallbackImage(p.id)}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-white/90 backdrop-blur text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
                    {p.type}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-1">{p.city}</p>
                    <h3 className="font-medium text-lg leading-tight group-hover:text-zinc-600 transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-zinc-100 flex items-end justify-between">
                  <div className="flex gap-4 text-sm text-zinc-500">
                    <span>{p.area} M²</span>
                    <span>{p.bedrooms} BED</span>
                  </div>
                  <p className="font-medium text-lg tracking-tight">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(p.price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 lg:py-24 px-6 lg:px-16 w-full bg-white border-t border-zinc-200">
        <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl lg:text-5xl font-medium tracking-tight mb-6 lg:mb-8">Redefining luxury real estate.</h2>
            <p className="text-zinc-500 text-base lg:text-lg leading-relaxed mb-6">
              We believe that finding a home is more than just a transaction; it is the beginning of a new chapter. Our curated collection of properties represents the pinnacle of design, comfort, and location.
            </p>
            <p className="text-zinc-500 text-base lg:text-lg leading-relaxed mb-8">
              Whether you are searching for a serene countryside retreat or a vibrant urban penthouse, our dedicated team is here to guide you every step of the way with transparency and expertise.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-black font-medium border-b border-black pb-1 hover:text-zinc-600 hover:border-zinc-600 transition-colors">
              Learn more about us
            </Link>
          </div>
          <div className="w-full lg:w-1/2 aspect-video lg:aspect-[4/3] bg-zinc-100 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80" alt="Beautiful interior" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}
