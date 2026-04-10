import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <PageHeader 
          title="Privacy Policy" 
          description="Last updated: January 2025"
        />

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your privacy is important to us. This Privacy Policy explains how Pomodoro Timer ("we", "our", or "us") 
              collects, uses, and protects your information when you use our web application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We collect minimal information to provide you with a better experience:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span><strong>Local Storage Data:</strong> Your timer settings and preferences are stored locally on your device.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span><strong>Analytics Data:</strong> We may collect anonymous usage statistics to improve our service.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span><strong>Contact Information:</strong> If you contact us, we collect the information you provide.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="space-y-2 text-muted-foreground mt-4">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Provide and maintain our service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Remember your preferences and settings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Improve user experience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Respond to your inquiries</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate security measures to protect your information. Your settings are stored 
              locally on your device and are not transmitted to our servers unless you explicitly opt-in to 
              cloud sync features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our application may display advertisements through Google AdSense. These third-party services 
              may collect information about your browsing behavior. Please refer to Google's privacy policy 
              for more information about how they handle your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our application and 
              store certain information. You can instruct your browser to refuse all cookies or to indicate 
              when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:klarotech18@gmail.com" className="text-primary hover:underline">
                klarotech18@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
