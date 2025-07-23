import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  title: string;
  description: string;
  showBackButton?: boolean;
  action?: React.ReactNode;
}

export default function AdminHeader({ title, description, showBackButton = true, action }: AdminHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-start mb-8">
      <div className="space-y-2">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="mb-2 -ml-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        )}
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}