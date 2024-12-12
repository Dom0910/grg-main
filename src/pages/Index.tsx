import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Testimonials />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;