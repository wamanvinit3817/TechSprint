import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:opacity-90 hover:shadow-glow-primary hover:-translate-y-0.5 active:translate-y-0",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg",
        outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
        secondary: "bg-gradient-secondary text-secondary-foreground hover:opacity-90 hover:shadow-glow-secondary hover:-translate-y-0.5",
        accent: "bg-gradient-accent text-accent-foreground hover:opacity-90 hover:shadow-glow-accent hover:-translate-y-0.5",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        student: "bg-gradient-student text-primary-foreground hover:opacity-90 hover:shadow-glow-primary hover:-translate-y-0.5 active:translate-y-0",
        society: "bg-gradient-society text-accent-foreground hover:opacity-90 hover:shadow-glow-accent hover:-translate-y-0.5 active:translate-y-0",
        college: "bg-gradient-college text-primary-foreground hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        glass: "bg-card/80 backdrop-blur-lg border border-border/50 hover:bg-card hover:shadow-md hover:-translate-y-0.5",
        hero: "bg-gradient-primary text-primary-foreground text-base px-8 py-4 hover:opacity-90 hover:shadow-glow-primary hover:-translate-y-1 active:translate-y-0",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
