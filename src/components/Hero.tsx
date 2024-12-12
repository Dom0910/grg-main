import { ArrowRight, MessageSquareText, Shield, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-16 container-padding bg-primary text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Effortless Airbnb Reputation Management
        </h1>
        <p className="text-lg md:text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
          Stop stressing over unfair reviews. Our AI flags them instantly, disputes them with expert-crafted appeals, and creates personalized responses—so you can focus on hosting.
          <br /><br />
          Try the beta free today and lock in exclusive early adopter discounts - limited spots available!
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
      <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {/* Quick Response Card */}
        <div className="bg-white text-neutral-900 backdrop-blur rounded-xl p-6 flex flex-col items-center text-center animate-float">
          <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <MessageSquareText className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Review Replies Done in Seconds</h3>
          <p className="text-neutral-600">
            Effortlessly respond to your Airbnb reviews with personalized, professional responses in under 10 seconds. Save hours every month while maintaining a stellar online reputation with just one click.
          </p>
        </div>

        {/* Negative Review Card */}
        <div className="bg-white text-neutral-900 backdrop-blur rounded-xl p-6 flex flex-col items-center text-center animate-float [animation-delay:200ms]">
          <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold mb-3">The Negative Review Eraser</h3>
          <p className="text-neutral-600">
            We'll tell you if you can get a negative or unfair review removed. Then, we'll give you a word-for-word script to handle Airbnb support like a pro. No guesswork. No stress.
          </p>
        </div>

        {/* Superhost Card */}
        <div className="bg-white text-neutral-900 backdrop-blur rounded-xl p-6 flex flex-col items-center text-center animate-float [animation-delay:400ms]">
          <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Superhost Status Accelerator</h3>
          <p className="text-neutral-600">
            To be a Superhost, you need a high rating. The requirement is simple: 4.8 stars. But getting there? That's where we come in.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;