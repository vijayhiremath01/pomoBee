import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';

const TermsAndConditions = () => {
  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <PageHeader 
          title="Terms and Conditions" 
          description="Last updated: January 2025"
        />

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Pomodoro Timer ("the Service"), you agree to be bound by these Terms 
              and Conditions. If you do not agree with any part of these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pomodoro Timer is a web-based productivity application that helps users manage their time 
              using the Pomodoro Technique. The service includes a timer, customizable settings, and 
              related productivity features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As a user of our service, you agree to:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Use the service for lawful purposes only</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Not attempt to disrupt or interfere with the service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Not use the service to distribute harmful content</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Respect the intellectual property rights of others</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The service, including its original content, features, and functionality, is owned by 
              Pomodoro Timer and is protected by international copyright, trademark, and other 
              intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              The service is provided "as is" and "as available" without any warranties of any kind, 
              either express or implied. We do not warrant that the service will be uninterrupted, 
              secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall Pomodoro Timer, its directors, employees, or agents be liable for any 
              indirect, incidental, special, consequential, or punitive damages arising from your use 
              of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Third-Party Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service may contain advertisements provided by third parties. We are not responsible 
              for the content, accuracy, or opinions expressed in such advertisements. Your dealings 
              with third-party advertisers are solely between you and the advertiser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Modifications to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any 
              changes by updating the "Last updated" date. Your continued use of the service after 
              such changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms shall be governed by and construed in accordance with applicable laws, 
              without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">10. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For any questions about these Terms and Conditions, please contact us at{' '}
              <a href="mailto:legal@pomodoro.app" className="text-primary hover:underline">
                legal@pomodoro.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default TermsAndConditions;
