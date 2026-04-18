import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Send, Mail, MessageSquare } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic guard against empty/whitespace-only input (fields are also `required` in the UI).
    if (![formData.name, formData.email, formData.subject, formData.message].every((v) => v.trim())) {
      toast({
        title: "Please fill all fields",
        description: "Name, email, subject, and message are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Build a mailto link with encoded subject/body so special characters don't break the URL.
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    
    const mailtoLink = `mailto:klarotech18@gmail.com?subject=${subject}&body=${body}`;

    const a = document.createElement("a");
     a.href = mailtoLink;
     a.target = "_self";
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);

    toast({
      title: "Opening email...",
      description: "Your default email app will open with the message pre-filled.",
    });

    // Clear form regardless of client availability.
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <PageHeader 
          title="Contact Us" 
          description="Have questions or feedback? We'd love to hear from you."
        />

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <div className="p-6 rounded-xl bg-card border border-border text-center">
            <Mail className="h-6 w-6 text-primary mx-auto mb-3" />
            <h3 className="font-medium text-foreground mb-1">Email</h3>
            <p className="text-sm text-muted-foreground">klarotech18@gmail.com</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border text-center">
            <MessageSquare className="h-6 w-6 text-primary mx-auto mb-3" />
            <h3 className="font-medium text-foreground mb-1">Feedback</h3>
            <p className="text-sm text-muted-foreground">We welcome suggestions</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border text-center">
            <Send className="h-6 w-6 text-primary mx-auto mb-3" />
            <h3 className="font-medium text-foreground mb-1">Response Time</h3>
            <p className="text-sm text-muted-foreground">Within 24-48 hours</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="What's this about?"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Your message..."
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default Contact;
