import Navbar from "../components/Navbar";
import PillButton from "../components/ui/PillButton";

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="font-serif text-[20vw] lg:text-[12rem] leading-none text-white/10">
          404
        </p>
        <h1 className="font-serif text-5xl mb-6 -mt-8">Lost in the estate</h1>
        <p className="text-white/50 font-sans mb-10 max-w-md">
          The page you are looking for has drifted beyond our collection.
        </p>
        <PillButton to="/" variant="cyan" size="lg">
          Return Home
        </PillButton>
      </div>
    </div>
  );
}
