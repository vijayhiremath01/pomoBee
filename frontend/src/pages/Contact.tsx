import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Send, Mail, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
    
    setFormData({ name: '', email: '', subject: '', message: '' });
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
            <p className="text-sm text-muted-foreground">voidprotocol18@gmail.com</p>
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
