import { MessageSquare, Clock, ThumbsUp } from "lucide-react";

const caseStudies = [
  {
    title: "64% of Consumers Say Responsiveness Matters More Than a Perfect Rating",
    description: "Be the responsive host guests prefer. GuestReview Genius makes it effortless to reply promptly and professionally to every review.",
    icon: Clock,
  },
  {
    title: "71% of Consumers Change Their Minds After Reading a Good Response to a Negative Review",
    description: "Rebuild trust effortlessly. GuestReview Genius crafts thoughtful, professional responses that turn critics into loyal customers.",
    icon: MessageSquare,
  },
  {
    title: "33% of Unhappy Customers Upgrade or Take Down Their Negative Reviews After a Personalized Response Within a Day",
    description: "One-third of unhappy guests are ready to forgive—you just need the right words, fast. GuestReview Genius delivers them for you.",
    icon: ThumbsUp,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 container-padding bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          A better way to Protect your Airbnb's reputation
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <div 
              key={index} 
              className="glass-card p-8 rounded-xl flex flex-col items-start hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="bg-accent/10 p-3 rounded-lg mb-6">
                <study.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-xl mb-4 text-left">
                {study.title}
              </h3>
              <p className="text-neutral-600 text-left">
                {study.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;