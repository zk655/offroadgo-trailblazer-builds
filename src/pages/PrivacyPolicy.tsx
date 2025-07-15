import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account or making purchases",
        "Usage data including pages visited, search queries, and interaction patterns", 
        "Device information such as browser type, IP address, and operating system",
        "Cookies and similar tracking technologies for site functionality and analytics"
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "To provide and improve our services and user experience",
        "To process transactions and send order confirmations",
        "To communicate with you about products, services, and promotions",
        "To analyze site usage and optimize our platform performance",
        "To comply with legal obligations and protect against fraud"
      ]
    },
    {
      title: "Information Sharing",
      content: [
        "We do not sell your personal information to third parties",
        "We may share data with trusted service providers who assist our operations",
        "Information may be disclosed if required by law or to protect our rights",
        "Anonymous, aggregated data may be shared for research and analytics purposes"
      ]
    },
    {
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your data",
        "All sensitive information is encrypted during transmission and storage",
        "Regular security audits and updates to maintain data protection",
        "Limited access to personal information on a need-to-know basis"
      ]
    },
    {
      title: "Your Rights",
      content: [
        "Right to access, update, or delete your personal information",
        "Right to opt-out of marketing communications at any time",
        "Right to request data portability for information you've provided",
        "Right to lodge complaints with relevant data protection authorities"
      ]
    },
    {
      title: "Cookies Policy",
      content: [
        "Essential cookies for site functionality and security",
        "Analytics cookies to understand how you use our site",
        "Marketing cookies for personalized advertising (with your consent)",
        "You can manage cookie preferences through your browser settings"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Privacy Policy - Your Data Protection Rights"
        description="Learn how OffRoadGo protects your privacy and handles your personal information. Comprehensive privacy policy and data protection information."
        keywords="privacy policy, data protection, personal information, cookies, GDPR"
      />
      
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">
              Data Protection
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Privacy <span className="text-primary">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-12">
              <Card className="bg-background border border-border">
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    This Privacy Policy describes how OffRoadGo ("we," "our," or "us") collects, uses, and protects 
                    your information when you visit our website and use our services. By accessing our site, you 
                    agree to the collection and use of information in accordance with this policy.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card key={index} className="bg-background border border-border">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      {index + 1}. {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Section */}
            <Card className="mt-12 bg-primary/5 border border-primary/20">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Questions About This Policy?
                </h3>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Email: privacy@offroadgo.com</p>
                  <p>Phone: 1-800-OFFROAD</p>
                  <p>Address: 123 Adventure Lane, Off-Road City, OR 97000</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;