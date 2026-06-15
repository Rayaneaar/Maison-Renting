import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatPrice, getFallbackImage } from "../lib/format";

export default function PropertyCard({ property }) {
  const navigate = useNavigate();

  return (
    <div 
      className="group cursor-pointer flex flex-col bg-white border border-zinc-200 overflow-hidden hover:shadow-lg transition-all duration-500 h-full"
      onClick={() => navigate(`/properties/${property.slug}`)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        <motion.img 
          layoutId={`property-image-${property.id}`}
          src={property.primary_image || getFallbackImage(property.id)}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
            {property.type}
          </span>
          {property.featured && (
            <span className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
              Featured
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-1">{property.city}</p>
            <h3 className="font-medium text-lg leading-tight group-hover:text-zinc-600 transition-colors line-clamp-2">
              {property.title}
            </h3>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-zinc-100 flex items-end justify-between">
          <div className="flex gap-4 text-sm text-zinc-500">
            <span>{property.area} M²</span>
            <span>{property.bedrooms} BED</span>
          </div>
          <p className="font-medium text-lg tracking-tight">
            {formatPrice(property.price, property.type)}
          </p>
        </div>
      </div>
    </div>
  );
}
