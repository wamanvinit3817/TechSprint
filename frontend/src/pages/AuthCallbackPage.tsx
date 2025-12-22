import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const token = searchParams.get('token');
  const error = searchParams.get('error');

  // Parse user data from URL params
  const userData = {
    id: searchParams.get('userId') || '',
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    role: (searchParams.get('role') as 'student' | 'society' | 'college') || 'student',
    collegeId: searchParams.get('collegeId') || '',
    societyId: searchParams.get('societyId') || undefined,
    avatar: searchParams.get('avatar') || undefined,
  };

  useEffect(() => {
    if (token && userData.id) {
      login(token, userData);
      
      // Redirect based on role
      setTimeout(() => {
        if (userData.role === 'college') {
          navigate(`/college/${userData.collegeId}/admin`);
        } else if (userData.role === 'society' && userData.societyId) {
          navigate(`/college/${userData.collegeId}/society/${userData.societyId}`);
        } else {
          navigate(`/college/${userData.collegeId}/student`);
        }
      }, 1500);
    }
  }, [token, userData, login, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero bg-mesh flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-lost/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-lost" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Authentication Failed
          </h1>
          <p className="text-muted-foreground mb-6">
            {error === 'invalid_email' 
              ? 'Please use a valid college email address.'
              : 'Something went wrong during authentication. Please try again.'}
          </p>
          <Button variant="default" onClick={() => navigate('/')}>
            Back to Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero bg-mesh flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 max-w-md w-full text-center"
      >
        {token ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-16 h-16 rounded-full bg-found/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-found" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Welcome, {userData.name}!
            </h1>
            <p className="text-muted-foreground mb-4">
              Authentication successful. Redirecting to your dashboard...
            </p>
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          </>
        ) : (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Authenticating...
            </h1>
            <p className="text-muted-foreground">
              Please wait while we verify your credentials.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
