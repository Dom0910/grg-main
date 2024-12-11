import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-16 container-padding bg-primary text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight flex flex-col gap-4">
          <span>Protect your Airbnb reputation</span>
          <span>Craft Perfect Replies</span>
          <span>Remove negative reviews</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
          Negative reviews hurt. Our AI helps. Join the beta test for free.
        </p>
        <div className="flex justify-center">
          <button 
            onClick={() => navigate("/survey")}
            className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
          >
            Try it today
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="mt-16 glass-card rounded-xl p-4 max-w-4xl mx-auto animate-float">
        <img 
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
          alt="Dashboard Preview"
          className="rounded-lg w-full"
        />
      </div>
    </section>
  );
};

export default Hero;