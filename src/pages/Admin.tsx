import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  FileText, 
  Car, 
  Wrench, 
  Mountain, 
  Shield, 
  Calendar,
  Users,
  LogOut
} from 'lucide-react';

export default function Admin() {
  const { user, signOut, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!userRole || (userRole !== 'admin' && userRole !== 'editor')) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={signOut} className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const adminSections = [
    {
      title: 'Blog Management',
      description: 'Create and edit blog posts',
      icon: FileText,
      path: '/admin/blogs',
    },
    {
      title: 'Vehicle Management',
      description: 'Add and update vehicle listings',
      icon: Car,
      path: '/admin/vehicles',
    },
    {
      title: 'Parts & Products',
      description: 'Manage modification parts catalog',
      icon: Wrench,
      path: '/admin/products',
    },
    {
      title: 'Trails',
      description: 'Add and edit trail information',
      icon: Mountain,
      path: '/admin/trails',
    },
    {
      title: 'Insurance',
      description: 'Manage insurance providers and quotes',
      icon: Shield,
      path: '/admin/insurance',
    },
    {
      title: 'Events & Clubs',
      description: 'Manage rally events and clubs',
      icon: Calendar,
      path: '/admin/events',
    },
  ];

  if (userRole === 'admin') {
    adminSections.push({
      title: 'User Management',
      description: 'Manage user accounts and roles',
      icon: Users,
      path: '/admin/users',
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Welcome back!</span>
              <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
                {userRole?.toUpperCase()}
              </Badge>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={signOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => (
            <Card 
              key={section.path} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => window.location.href = section.path}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{section.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start">
                View Website
              </Button>
              <Button variant="outline" className="justify-start">
                Site Analytics
              </Button>
              <Button variant="outline" className="justify-start">
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}