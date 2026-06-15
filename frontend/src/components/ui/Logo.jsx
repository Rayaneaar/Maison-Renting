import { Link } from "react-router-dom";

export default function Logo({ className = "", lightText = false }) {
  const textColor = lightText ? "text-white" : "text-black";

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center">
        <span className={`font-serif text-3xl font-bold ${textColor}`}>I</span>
        <svg 
          className="w-5 h-5 -ml-0.5 mt-0.5" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
            stroke="#006233" 
            strokeWidth="1.5" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className={`font-serif text-2xl tracking-[0.05em] font-medium ${textColor}`}>
        immo<span className="font-bold">Maroc</span>
      </span>
    </Link>
  );
}
