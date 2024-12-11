import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../App";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/90 backdrop-blur-lg border-b border-neutral-800">
      <nav className="container-padding mx-auto flex h-16 items-center justify-between">
        <a href="/" className="text-xl font-semibold text-white">
          Monet
        </a>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-neutral-400 hover:text-white transition-colors">
            Features
          </a>
          <a href="#testimonials" className="text-neutral-400 hover:text-white transition-colors">
            Testimonials
          </a>
          <a href="#pricing" className="text-neutral-400 hover:text-white transition-colors">
            Pricing
          </a>
          {session ? (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <button 
              onClick={() => navigate("/auth")}
              className="bg-white text-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-neutral-900/90 backdrop-blur-lg border-b border-neutral-800">
          <div className="container-padding py-4 flex flex-col gap-4">
            <a href="#features" className="text-neutral-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-neutral-400 hover:text-white transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-neutral-400 hover:text-white transition-colors">
              Pricing
            </a>
            {session ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <button 
                onClick={() => navigate("/auth")}
                className="bg-white text-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;