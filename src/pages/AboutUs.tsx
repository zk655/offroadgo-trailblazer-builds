import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Award, Heart } from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Mike Johnson",
      role: "Founder & CEO",
      bio: "20+ years in off-road industry",
      icon: <Users className="h-6 w-6" />
    },
    {
      name: "Sarah Davis",
      role: "Lead Designer",
      bio: "Expert in 4x4 modifications",
      icon: <Target className="h-6 w-6" />
    },
    {
      name: "Tom Wilson",
      role: "Technical Director",
      bio: "Master mechanic and trail guide",
      icon: <Award className="h-6 w-6" />
    }
  ];

  const values = [
    {
      title: "Quality First",
      description: "We only recommend products we've tested ourselves",
      icon: <Award className="h-8 w-8 text-primary" />
    },
    {
      title: "Community Driven",
      description: "Built by off-roaders, for off-roaders",
      icon: <Users className="h-8 w-8 text-primary" />
    },
    {
      title: "Adventure Ready",
      description: "Gear that performs when it matters most",
      icon: <Target className="h-8 w-8 text-primary" />
    },
    {
      title: "Passionate Service",
      description: "Your adventure is our mission",
      icon: <Heart className="h-8 w-8 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="About Us - Off-Road Experts"
        description="Learn about OffRoadGo - your trusted source for 4x4 vehicles, parts, and off-road adventures. Meet our team of off-road experts."
        keywords="about us, off-road experts, 4x4 specialists, team, company"
      />
      
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">
              Our Story
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              About <span className="text-primary">OffRoadGo</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're passionate off-road enthusiasts dedicated to helping you find the perfect 4x4 vehicles, 
              gear, and trails for your next adventure.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">
                  Our Mission
                </Badge>
                <h2 className="text-3xl font-bold mb-6 text-foreground">
                  Empowering Your Off-Road Adventures
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Since 2015, OffRoadGo has been the trusted source for off-road enthusiasts seeking 
                  quality vehicles, reliable gear, and unforgettable trail experiences.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We understand that off-roading isn't just a hobby - it's a lifestyle. That's why we're 
                  committed to providing expert advice, thoroughly tested products, and comprehensive 
                  resources to make every adventure safe and exciting.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <Card key={index} className="bg-background border border-border p-4">
                    <CardContent className="p-0">
                      <div className="mb-3">{value.icon}</div>
                      <h3 className="font-semibold mb-2 text-foreground">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">
                Meet The Team
              </Badge>
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Off-Road <span className="text-primary">Experts</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our team combines decades of off-road experience with technical expertise
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="bg-background border border-border text-center p-6">
                  <CardContent className="p-0">
                    <div className="flex justify-center mb-4">
                      <div className="bg-primary/10 p-4 rounded-full">
                        {member.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Vehicles Reviewed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                <div className="text-muted-foreground">Products Tested</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">200+</div>
                <div className="text-muted-foreground">Trails Mapped</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;