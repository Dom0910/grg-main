import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const AdminSummaryCard = () => {
  const { toast } = useToast();

  const { data: surveyResponses } = useQuery({
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
  });

  const { data: feedbackSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["feedback_summary", surveyResponses],
    queryFn: async () => {
      if (!surveyResponses) return null;

      const { data, error } = await supabase.functions.invoke("summarize-feedback", {
        body: { feedbackData: surveyResponses },
      });

      if (error) {
        console.error("Error fetching summary:", error);
        toast({
          variant: "destructive",
          title: "Error generating summary",
          description: "Please try again in a few minutes.",
        });
        return null;
      }

      return data.summary;
    },
    enabled: !!surveyResponses && surveyResponses.length > 0,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return (
    <Card className="p-6 mb-8 bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Feedback Summary</h2>
      {isLoadingSummary ? (
        <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
      ) : feedbackSummary ? (
        <p className="text-gray-700 whitespace-pre-wrap">{feedbackSummary}</p>
      ) : (
        <p className="text-gray-500 italic">No feedback summary available</p>
      )}
    </Card>
  );
};