import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, Building2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';

const loginOptions = [
  {
    role: 'student',
    title: 'College Student',
    description: 'Access with your valid college email',
    icon: GraduationCap,
    gradient: 'from-student to-student-glow',
    buttonVariant: 'student' as const,
  },
  {
    role: 'society',
    title: 'Society Member',
    description: 'Enter with your society invite code',
    icon: Users,
    gradient: 'from-society to-society-glow',
    buttonVariant: 'society' as const,
  },
  {
    role: 'college',
    title: 'College Admin',
    description: 'Manage your institution\'s lost & found',
    icon: Building2,
    gradient: 'from-college to-college-glow',
    buttonVariant: 'college' as const,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = (role: string) => {
    // Redirect to backend Google OAuth
    window.location.href = api.getGoogleAuthUrl(role);
  };

  return (
    <div className="min-h-screen bg-gradient-hero bg-mesh relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl"
        />
        
        {/* Floating elements */}
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-[15%] w-16 h-16 rounded-2xl bg-gradient-student opacity-20 blur-sm"
        />
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-40 right-[20%] w-12 h-12 rounded-full bg-gradient-society opacity-20 blur-sm"
        />
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-32 left-[25%] w-20 h-20 rounded-3xl bg-gradient-college opacity-15 blur-sm"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
                <span className="text-3xl">🔍</span>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-5 h-5 text-secondary" />
              </motion.div>
            </motion.div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-16 flex-grow flex flex-col justify-center"
        >
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Campus
            <span className="block text-gradient-primary">Lost & Found</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            A modern platform to report, track, and recover lost items across your campus. 
            Connect with your college community and help reunite items with their owners.
          </p>

          {/* Login Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {loginOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={option.role}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-card card-3d p-6 flex flex-col items-center text-center group"
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
                  >
                    <Icon className="w-10 h-10 text-primary-foreground" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-grow">
                    {option.description}
                  </p>

                  {/* Button */}
                  <Button
                    variant={option.buttonVariant}
                    size="lg"
                    className="w-full group/btn"
                    onClick={() => handleLogin(option.role)}
                  >
                    <span>Login with Google</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-muted-foreground py-6"
        >
          <p>
            Secure authentication powered by Google OAuth. Your data is protected.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
