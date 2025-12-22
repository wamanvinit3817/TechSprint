import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  Search,
  Plus,
  Package,
  CheckCircle,
  Users,
  BarChart3,
  Settings,
  FileText,
  Key,
  X,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  icon: typeof Home;
  href: string;
  badge?: number;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { role, collegeId, societyId } = useAuth();
  const location = useLocation();

  const getNavItems = (): NavItem[] => {
    const baseUrl = `/college/${collegeId}`;

    if (role === 'college') {
      return [
        { label: 'Dashboard', icon: Home, href: `${baseUrl}/admin` },
        { label: 'All Items', icon: Package, href: `${baseUrl}/admin/items` },
        { label: 'Pending Approval', icon: FileText, href: `${baseUrl}/admin/pending`, badge: 5 },
        { label: 'Resolved', icon: CheckCircle, href: `${baseUrl}/admin/resolved` },
        { label: 'Analytics', icon: BarChart3, href: `${baseUrl}/admin/analytics` },
        { label: 'Invite Codes', icon: Key, href: `${baseUrl}/admin/invites` },
        { label: 'Settings', icon: Settings, href: `${baseUrl}/admin/settings` },
      ];
    }

    if (role === 'society') {
      return [
        { label: 'Society Room', icon: Home, href: `${baseUrl}/society/${societyId}` },
        { label: 'Browse Items', icon: Search, href: `${baseUrl}/society/${societyId}/browse` },
        { label: 'Report Item', icon: Plus, href: `${baseUrl}/society/${societyId}/report` },
        { label: 'My Items', icon: Package, href: `${baseUrl}/society/${societyId}/my-items` },
        { label: 'Members', icon: Users, href: `${baseUrl}/society/${societyId}/members` },
      ];
    }

    // Student
    return [
      { label: 'Dashboard', icon: Home, href: `${baseUrl}/student` },
      { label: 'Browse Items', icon: Search, href: `${baseUrl}/student/browse` },
      { label: 'Report Lost', icon: Plus, href: `${baseUrl}/student/report-lost` },
      { label: 'Report Found', icon: Plus, href: `${baseUrl}/student/report-found` },
      { label: 'My Items', icon: Package, href: `${baseUrl}/student/my-items` },
    ];
  };

  const navItems = getNavItems();

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -300, opacity: 0 },
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`
          fixed left-0 top-16 bottom-0 w-72 z-50
          lg:sticky lg:top-16 lg:z-30 lg:translate-x-0 lg:opacity-100
          glass-card rounded-none border-r border-border/50
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Close button (mobile) */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 lg:hidden">
          <span className="font-display font-bold text-foreground">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 group relative
                  ${
                    active
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow-primary'
                      : 'hover:bg-muted text-foreground'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${active ? '' : 'text-muted-foreground group-hover:text-primary'}`} />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground rounded-full">
                    {item.badge}
                  </span>
                )}
                {active && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/50">
          <div className="glass-card p-4 bg-gradient-to-br from-primary/10 to-accent/10">
            <h4 className="font-display font-bold text-sm mb-1">Need Help?</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Report issues or get support from the admin team.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Contact Support
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
