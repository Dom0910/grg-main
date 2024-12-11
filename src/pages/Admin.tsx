import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../App";
import Header from "../components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  const { data: surveyResponses, isLoading: isLoadingSurveys } = useQuery({
    queryKey: ["survey_responses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("survey_responses")
        .select(`
          *,
          profiles:profiles(username)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.is_admin,
  });

  const { data: chatSubmissions, isLoading: isLoadingChats } = useQuery({
    queryKey: ["chat_submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_submissions")
        .select(`
          *,
          profiles:profiles(username)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.is_admin,
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
        
        <Tabs defaultValue="surveys" className="w-full">
          <TabsList>
            <TabsTrigger value="surveys">Survey Responses</TabsTrigger>
            <TabsTrigger value="chats">Chat Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="surveys">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Survey Responses</h2>
              
              {isLoadingSurveys ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Properties</TableHead>
                        <TableHead>Pain Point</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {surveyResponses?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {new Date(item.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{item.profiles?.username || "Anonymous"}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.property_count}</TableCell>
                          <TableCell className="max-w-md">{item.pain_point}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chats">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Chat Submissions</h2>
              
              {isLoadingChats ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Response</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chatSubmissions?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {new Date(item.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{item.profiles?.username || "Anonymous"}</TableCell>
                          <TableCell className="max-w-md whitespace-pre-wrap">{item.message}</TableCell>
                          <TableCell className="max-w-md whitespace-pre-wrap">{item.response}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;