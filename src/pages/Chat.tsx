import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import Header from "../components/Header";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: userMessage },
      });

      if (error) throw error;

      // Add assistant response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8 mt-16">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">AI Review Assistant</h1>
            <p className="text-secondary text-lg mb-2">Share 3 things:</p>
            <div className="text-secondary text-lg space-y-1">
              <p>1. Guest's First Name – To personalize the response.</p>
              <p>2. The Review – Copy it from the Airbnb app.</p>
              <p>3. Additional Context – Share details about your interactions with the guest. Be detailed!</p>
            </div>
          </div>

          <div className="glass-card rounded-lg p-6 min-h-[500px] flex flex-col">
            <ScrollArea className="flex-grow mb-6 pr-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-accent text-white'
                          : 'bg-neutral-100'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your guest review here..."
                className="min-h-[100px]"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#1A1F2C] text-white relative
                         before:absolute before:inset-0 before:p-[2px] 
                         before:bg-gradient-to-r before:from-[#9b87f5] before:to-[#1EAEDB]
                         before:rounded-md before:-z-10 before:content-['']
                         hover:before:opacity-80 transition-all duration-300
                         rounded-md"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                    Generating response...
                  </div>
                ) : (
                  'Send'
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;