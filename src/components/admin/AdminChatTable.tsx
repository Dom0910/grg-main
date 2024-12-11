import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AdminChatTable = () => {
  const { data: chatSubmissions, isLoading } = useQuery({
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
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Chat Submissions</h2>
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
                <TableCell className="max-w-md whitespace-pre-wrap">
                  {item.message}
                </TableCell>
                <TableCell className="max-w-md whitespace-pre-wrap">
                  {item.response}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};