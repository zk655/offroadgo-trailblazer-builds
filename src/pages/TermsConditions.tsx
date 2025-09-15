import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsConditions = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing and using OffRoadGo, you accept and agree to be bound by these Terms and Conditions",
        "If you do not agree to these terms, please do not use our website or services",
        "We reserve the right to modify these terms at any time with notice to users",
        "Continued use after changes constitutes acceptance of new terms"
      ]
    },
    {
      title: "Use of Our Services",
      content: [
        "You must be at least 18 years old to use our services",
        "You are responsible for maintaining the confidentiality of your account information",
        "You agree to use our services only for lawful purposes",
        "You will not attempt to interfere with the proper functioning of our website"
      ]
    },
    {
      title: "Product Information and Pricing",
      content: [
        "We strive to provide accurate product descriptions and pricing information",
        "Prices and availability are subject to change without notice",
        "Product images are for illustration purposes and may vary from actual products",
        "We reserve the right to limit quantities and refuse orders at our discretion"
      ]
    },
    {
      title: "Orders and Payment",
      content: [
        "All orders are subject to acceptance and availability",
        "Payment must be received in full before products are shipped",
        "We accept major credit cards and other specified payment methods",
        "You are responsible for providing accurate billing and shipping information"
      ]
    },
    {
      title: "Shipping and Returns",
      content: [
        "Shipping times and costs vary based on location and product type",
        "Risk of loss transfers to you upon delivery to the shipping address",
        "Returns are accepted within 30 days of purchase in original condition",
        "Return shipping costs are the responsibility of the customer unless item is defective"
      ]
    },
    {
      title: "Intellectual Property",
      content: [
        "All content on this website is protected by copyright and trademark laws",
        "You may not reproduce, distribute, or create derivative works without permission",
        "Product names and logos are trademarks of their respective owners",
        "User-generated content grants us limited rights to use and display such content"
      ]
    },
    {
      title: "Disclaimer of Warranties",
      content: [
        "Our services are provided 'as is' without warranties of any kind",
        "We do not guarantee that our website will be error-free or uninterrupted",
        "Product performance depends on proper installation and use",
        "Third-party content and links are provided for convenience only"
      ]
    },
    {
      title: "Limitation of Liability",
      content: [
        "Our liability is limited to the maximum extent permitted by law",
        "We are not liable for indirect, incidental, or consequential damages",
        "Total liability shall not exceed the amount paid for the specific product or service",
        "Some jurisdictions do not allow limitation of liability, so limits may not apply"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Terms & Conditions - OffRoadGo"
        description="Read OffRoadGo's terms and conditions, including user responsibilities, service usage guidelines, and legal agreements."
        keywords="terms conditions, legal terms, user agreement, service terms, OffRoadGo policies"
        url="/terms-conditions"
        type="website"
        noindex={true}
      />
      
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">
              Legal Agreement
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Terms & <span className="text-primary">Conditions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our website and services.
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
                    These Terms and Conditions ("Terms") govern your use of the OffRoadGo website and services. 
                    By accessing or using our website, you agree to be bound by these Terms. If you disagree 
                    with any part of these terms, then you may not access our services.
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

            {/* Additional Legal Information */}
            <div className="mt-12 space-y-6">
              <Card className="bg-background border border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Governing Law
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    These Terms shall be governed by and construed in accordance with the laws of the State of Oregon, 
                    without regard to its conflict of law provisions. Any disputes arising from these Terms or your 
                    use of our services shall be resolved in the courts of Oregon.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border border-primary/20">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    Need Help Understanding These Terms?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    If you have questions about these Terms and Conditions, please contact our legal team:
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Email: legal@offroadgo.com</p>
                    <p>Phone: 1-800-OFFROAD</p>
                    <p>Address: 123 Adventure Lane, Off-Road City, OR 97000</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsConditions;