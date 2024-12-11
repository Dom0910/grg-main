import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../App";
import Header from "../components/Header";
import { AdminSurveyTable } from "../components/admin/AdminSurveyTable";
import { AdminChatTable } from "../components/admin/AdminChatTable";
import { AdminSummaryCard } from "../components/admin/AdminSummaryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
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

  useEffect(() => {
    if (profile && !profile.is_admin) {
      navigate("/");
    }
  }, [profile, navigate]);

  if (!profile?.is_admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <AdminSummaryCard />
        
        <Tabs defaultValue="surveys" className="w-full">
          <TabsList>
            <TabsTrigger value="surveys">Survey Responses</TabsTrigger>
            <TabsTrigger value="chats">Chat Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="surveys">
            <AdminSurveyTable />
          </TabsContent>

          <TabsContent value="chats">
            <AdminChatTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;