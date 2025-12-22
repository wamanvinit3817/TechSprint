import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { NotificationCenter } from '@/components/NotificationCenter';
import {
  Search,
  Menu,
  LogOut,
  User,
  ChevronDown,
  Home,
  Settings,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  onMenuClick?: () => void;
}

const roleLabels = {
  student: 'Student',
  society: 'Society Member',
  college: 'College Admin',
};

const roleColors = {
  student: 'badge-student',
  society: 'badge-society',
  college: 'badge-college',
};

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, isAuthenticated, logout, role, collegeId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!collegeId) return '/';
    if (role === 'college') return `/college/${collegeId}/admin`;
    if (role === 'society') return `/college/${collegeId}/society/${user?.societyId}`;
    return `/college/${collegeId}/student`;
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="glass-card border-b border-border/50 rounded-none">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={onMenuClick}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}

            <Link to={isAuthenticated ? getDashboardLink() : '/'} className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary transition-transform group-hover:scale-105">
                <span className="text-xl">🔍</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display text-lg font-bold text-foreground leading-none">
                  Campus L&F
                </h1>
                <p className="text-xs text-muted-foreground">Lost & Found</p>
              </div>
            </Link>
          </div>

          {/* Center - Search (Desktop) */}
          {isAuthenticated && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/50 bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <NotificationCenter />
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-primary-foreground" />
                        )}
                      </div>
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-medium leading-none">{user?.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-md mt-1 ${role ? roleColors[role] : ''}`}>
                          {role ? roleLabels[role] : 'User'}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass-card">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-medium">{user?.name}</span>
                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()} className="flex items-center gap-2 cursor-pointer">
                        <Home className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <Settings className="w-4 h-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              location.pathname !== '/' && (
                <Button variant="default" asChild>
                  <Link to="/">Sign In</Link>
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
