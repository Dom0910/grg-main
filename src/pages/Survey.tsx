import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  propertyCount: z.number().min(1, "Must manage at least 1 property"),
  painPoint: z.string().min(10, "Please provide more detail about your pain point"),
});

const Survey = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      propertyCount: 1,
      painPoint: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.from("survey_responses").insert({
        user_id: session?.user.id,
        email: values.email,
        name: values.name,
        property_count: values.propertyCount,
        pain_point: values.painPoint,
      });

      if (error) throw error;

      toast({
        title: "Survey submitted successfully!",
        description: "Thank you for your feedback.",
      });

      navigate("/chat");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error submitting survey",
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Quick Survey</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="propertyCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Airbnb properties you manage</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="painPoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>If you could wave a magic wand and fix one problem or eliminate a time-consuming task with your Airbnb, what would it be?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your biggest challenge..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-[#9b87f5] hover:bg-[#9b87f5]/90"
            >
              Try it now
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Survey;