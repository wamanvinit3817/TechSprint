import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'lost' | 'found' | 'resolved';
}

const variantStyles = {
  default: {
    gradient: 'from-muted/50 to-muted',
    iconBg: 'bg-muted',
    iconColor: 'text-foreground',
  },
  primary: {
    gradient: 'from-primary/20 to-primary/5',
    iconBg: 'bg-gradient-primary',
    iconColor: 'text-primary-foreground',
  },
  secondary: {
    gradient: 'from-secondary/20 to-secondary/5',
    iconBg: 'bg-gradient-secondary',
    iconColor: 'text-secondary-foreground',
  },
  accent: {
    gradient: 'from-accent/20 to-accent/5',
    iconBg: 'bg-gradient-accent',
    iconColor: 'text-accent-foreground',
  },
  lost: {
    gradient: 'from-lost/20 to-lost/5',
    iconBg: 'bg-gradient-to-br from-lost to-lost-glow',
    iconColor: 'text-primary-foreground',
  },
  found: {
    gradient: 'from-found/20 to-found/5',
    iconBg: 'bg-gradient-to-br from-found to-found-glow',
    iconColor: 'text-primary-foreground',
  },
  resolved: {
    gradient: 'from-resolved/20 to-resolved/5',
    iconBg: 'bg-gradient-to-br from-resolved to-resolved-glow',
    iconColor: 'text-primary-foreground',
  },
};

export function StatsCard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`glass-card p-6 bg-gradient-to-br ${styles.gradient} overflow-hidden relative group`}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-display font-bold text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
            {trend && (
              <span
                className={`text-sm font-semibold ${
                  trend.isPositive ? 'text-found' : 'text-lost'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div
          className={`p-4 rounded-2xl ${styles.iconBg} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          <Icon className={`w-6 h-6 ${styles.iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
}
