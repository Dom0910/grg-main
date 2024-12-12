import { ArrowRight, ClipboardCheck, Brain, CheckCircle2 } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Share 3 Things",
      icon: ClipboardCheck,
      content: (
        <div className="space-y-2">
          <p className="font-medium">1. Guest's First Name – To personalize the response.</p>
          <p className="font-medium">2. The Review – Copy it from the Airbnb app.</p>
          <p className="font-medium">3. Additional Context – Share details about your interaction with the guest.</p>
        </div>
      ),
    },
    {
      number: "2",
      title: "AI Analysis",
      icon: Brain,
      content: (
        <div className="space-y-2">
          <p className="mb-4">Our AI evaluates the situation and offers guidance on how hosts can use Airbnb's rules to their advantage. It cross references all of Airbnb's policies, including:</p>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-accent" />
              <span>Review Policy</span>
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-accent" />
              <span>Content Policy</span>
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-accent" />
              <span>Community Standards</span>
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-accent" />
              <span>Terms of Service</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      number: "3",
      title: "Get Results & Action Plan",
      icon: CheckCircle2,
      content: (
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-2">If policies are violated:</p>
            <p>You'll receive a clear action plan to get the review removed, plus a script for talking to Airbnb Support.</p>
          </div>
          <div>
            <p className="font-medium mb-2">If no violations:</p>
            <p>Get a draft of a calm, professional response that:</p>
            <ul className="space-y-1 mt-2">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-accent" />
                <span>Acknowledges the feedback.</span>
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-accent" />
                <span>Reassures future guests.</span>
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-accent" />
                <span>Reinforces your commitment to quality.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-16 container-padding bg-neutral-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="glass-card p-8 rounded-xl flex flex-col items-start hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="bg-accent/10 p-3 rounded-lg mb-6">
                <step.icon className="w-6 h-6 text-accent" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-accent">Step {step.number}:</span>
                <h3 className="text-xl font-semibold">{step.title}</h3>
              </div>
              <div className="text-neutral-600 text-left">
                {step.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;