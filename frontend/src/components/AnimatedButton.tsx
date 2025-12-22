import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  glowColor?: 'primary' | 'secondary' | 'accent';
}

export function AnimatedButton({ children, glowColor = 'primary', ...props }: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      {/* Glow effect */}
      <motion.div
        className={`
          absolute inset-0 rounded-xl blur-xl opacity-0
          ${glowColor === 'primary' ? 'bg-primary' : ''}
          ${glowColor === 'secondary' ? 'bg-secondary' : ''}
          ${glowColor === 'accent' ? 'bg-accent' : ''}
        `}
        initial={false}
        whileHover={{ opacity: 0.3 }}
        transition={{ duration: 0.3 }}
      />
      <Button {...props} className={`relative ${props.className || ''}`}>
        {children}
      </Button>
    </motion.div>
  );
}
