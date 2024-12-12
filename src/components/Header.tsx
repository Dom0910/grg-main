import { Menu, X, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../App";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

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
          GuestReview Genius
        </a>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-neutral-400 hover:text-white transition-colors">
            How it works
          </a>
          {profile?.is_admin && (
            <button 
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Shield size={16} />
              Admin
            </button>
          )}
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
            <a href="#how-it-works" className="text-neutral-400 hover:text-white transition-colors">
              How it works
            </a>
            {profile?.is_admin && (
              <button 
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Shield size={16} />
                Admin
              </button>
            )}
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