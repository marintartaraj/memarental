import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95',
	{
		variants: {
			variant: {
				default: 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:from-brand-primary-hover hover:to-brand-secondary-hover shadow-lg hover:shadow-xl',
				destructive:
          'bg-brand-error text-white hover:bg-brand-error-hover shadow-lg hover:shadow-xl',
				outline:
          'border-2 border-brand-primary text-brand-primary bg-white hover:bg-brand-primary-light hover:text-brand-primary-dark shadow-md hover:shadow-lg',
				secondary:
          'bg-brand-neutral text-brand-neutral-dark hover:bg-brand-neutral-light shadow-md hover:shadow-lg',
				ghost: 'hover:bg-brand-neutral-light hover:text-brand-neutral-dark',
				link: 'text-brand-primary underline-offset-4 hover:underline hover:text-brand-primary-hover',
				success: 'bg-gradient-to-r from-brand-success to-brand-success-hover text-white hover:from-brand-success-hover hover:to-brand-success shadow-lg hover:shadow-xl',
				info: 'bg-gradient-to-r from-brand-info to-brand-info-hover text-white hover:from-brand-info-hover hover:to-brand-info shadow-lg hover:shadow-xl',
				purple: 'bg-gradient-to-r from-brand-purple to-brand-purple-hover text-white hover:from-brand-purple-hover hover:to-brand-purple shadow-lg hover:shadow-xl',
				pink: 'bg-gradient-to-r from-brand-pink to-brand-pink-hover text-white hover:from-brand-pink-hover hover:to-brand-pink shadow-lg hover:shadow-xl',
				teal: 'bg-gradient-to-r from-brand-teal to-brand-teal-hover text-white hover:from-brand-teal-hover hover:to-brand-teal shadow-lg hover:shadow-xl',
			},
			size: {
				default: 'h-10 px-6 py-2',
				sm: 'h-8 px-4 text-xs',
				lg: 'h-12 px-8 text-base',
				xl: 'h-14 px-10 text-lg',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		/>
	);
});
Button.displayName = 'Button';

export { Button, buttonVariants };