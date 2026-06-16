import { Link } from "react-router-dom";

export default function Logo({ className = "", lightText = false }) {
  const textColor = lightText ? "text-white" : "text-black";

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center">
        <span className={`font-serif text-3xl font-bold ${textColor}`}>I</span>
        <svg 
          className="w-6 h-6 -ml-0.5 mt-0.5" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon 
            points="50,5 76.4,86.4 7.2,36.1 92.8,36.1 23.6,86.4" 
            stroke="#006233" 
            strokeWidth="5" 
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
