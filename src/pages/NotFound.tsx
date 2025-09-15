import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  return (
    <>
      <SEOHead 
        title="Page Not Found - OffRoadGo"
        description="The page you're looking for doesn't exist. Return to OffRoadGo homepage or browse our 4x4 vehicles and off-road content."
        keywords="404 error, page not found, OffRoadGo"
        url="/404"
        type="website"
        noindex={true}
      />
      <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/vehicles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse Vehicles
            </Link>
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};

export default NotFound;
