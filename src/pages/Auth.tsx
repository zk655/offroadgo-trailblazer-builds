import { useState, useEffect } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { signIn, signUp, resetPassword, user } = useAuth();

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'recovery') {
      setIsPasswordReset(true);
      setIsLogin(false);
      setIsForgotPassword(false);
    }
  }, [searchParams]);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Check your email for a password reset link!');
        }
      } else if (isPasswordReset) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        const { error } = await supabase.auth.updateUser({
          password: password
        });
        
        if (error) {
          setError(error.message);
        } else {
          setMessage('Password updated successfully! You can now sign in.');
          setIsPasswordReset(false);
          setIsLogin(true);
        }
      } else if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const metadata = {
          username,
          full_name: fullName,
        };

        const { error } = await signUp(email, password, metadata);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Check your email for a verification link!');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Admin Login - OffRoadGo"
        description="Sign in to the OffRoadGo admin panel to manage content, users, and website features."
        keywords="admin login, content management, user authentication"
        url="/auth"
        type="website"
        noindex={true}
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isForgotPassword ? 'Reset Password' : (isPasswordReset ? 'Set New Password' : (isLogin ? 'Sign In' : 'Create Account'))}
          </CardTitle>
          <CardDescription className="text-center">
            {isForgotPassword 
              ? 'Enter your email to receive a password reset link'
              : (isPasswordReset
                ? 'Enter your new password'
                : (isLogin 
                  ? 'Enter your credentials to access the admin panel' 
                  : 'Fill in your details to create an admin account'
                )
              )
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isForgotPassword && !isPasswordReset && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            {!isForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {((!isLogin && !isForgotPassword) || isPasswordReset) && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : (isForgotPassword ? 'Send Reset Link' : (isPasswordReset ? 'Update Password' : (isLogin ? 'Sign In' : 'Create Account')))}
            </Button>
          </form>

          {/* Forgot password link for login mode */}
          {isLogin && !isForgotPassword && !isPasswordReset && (
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => {
                  setIsForgotPassword(true);
                  setError('');
                  setMessage('');
                }}
                className="text-sm"
              >
                Forgot your password?
              </Button>
            </div>
          )}

          {!isPasswordReset && (
            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => {
                  if (isForgotPassword) {
                    setIsForgotPassword(false);
                    setIsLogin(true);
                  } else {
                    setIsLogin(!isLogin);
                  }
                  setError('');
                  setMessage('');
                }}
                className="text-sm"
              >
                {isForgotPassword 
                  ? 'Back to Sign In'
                  : (isLogin 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'
                  )
                }
              </Button>
            </div>
          )}

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
              ← Back to Website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}