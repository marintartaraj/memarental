/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem',
				xl: '2rem',
				'2xl': '2rem',
			},
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			// Fluid typography with clamp()
			fontSize: {
				'xs': ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', { lineHeight: '1.4' }],
				'sm': ['clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', { lineHeight: '1.5' }],
				'base': ['clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', { lineHeight: '1.6' }],
				'lg': ['clamp(1.125rem, 1rem + 0.625vw, 1.25rem)', { lineHeight: '1.5' }],
				'xl': ['clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', { lineHeight: '1.4' }],
				'2xl': ['clamp(1.5rem, 1.3rem + 1vw, 2rem)', { lineHeight: '1.3' }],
				'3xl': ['clamp(1.875rem, 1.6rem + 1.375vw, 2.5rem)', { lineHeight: '1.2' }],
				'4xl': ['clamp(2.25rem, 1.9rem + 1.75vw, 3rem)', { lineHeight: '1.1' }],
				'5xl': ['clamp(3rem, 2.5rem + 2.5vw, 4rem)', { lineHeight: '1' }],
				'6xl': ['clamp(3.75rem, 3rem + 3.75vw, 5rem)', { lineHeight: '0.9' }],
			},
			// Mobile-first spacing scale
			spacing: {
				'18': '4.5rem',
				'70': '17.5rem', // 280px for sidebar width
				'88': '22rem',
				'128': '32rem',
			},
			// Mobile-optimized min-height utilities
			minHeight: {
				'screen': '100vh',
				'screen-small': '100svh',
				'44': '11rem', // 44px minimum touch target
			},
			// Mobile-optimized aspect ratios
			aspectRatio: {
				'auto': 'auto',
				'square': '1 / 1',
				'video': '16 / 9',
				'photo': '4 / 3',
				'card': '3 / 2',
			},
			// Mobile-optimized shadows
			boxShadow: {
				'mobile': '0 2px 8px rgba(0, 0, 0, 0.1)',
				'mobile-lg': '0 4px 12px rgba(0, 0, 0, 0.15)',
				'mobile-xl': '0 8px 24px rgba(0, 0, 0, 0.2)',
			},
			// Mobile-optimized border radius
			borderRadius: {
				'xl': 'var(--radius)',
				'2xl': 'calc(var(--radius) + 2px)',
				'3xl': 'calc(var(--radius) + 4px)',
			},
					colors: {
			border: 'var(--border)',
			input: 'var(--input)',
			ring: 'var(--ring)',
			background: 'var(--background)',
			foreground: 'var(--foreground)',
			primary: {
				DEFAULT: 'var(--primary)',
				foreground: 'var(--primary-foreground)',
			},
			secondary: {
				DEFAULT: 'var(--secondary)',
				foreground: 'var(--secondary-foreground)',
			},
			destructive: {
				DEFAULT: 'var(--destructive)',
				foreground: 'var(--destructive-foreground)',
			},
			muted: {
				DEFAULT: 'var(--muted)',
				foreground: 'var(--muted-foreground)',
			},
			accent: {
				DEFAULT: 'var(--accent)',
				foreground: 'var(--accent-foreground)',
			},
			popover: {
				DEFAULT: 'var(--popover)',
				foreground: 'var(--popover-foreground)',
			},
			card: {
				DEFAULT: 'var(--card)',
				foreground: 'var(--card-foreground)',
			},
			// Brand Colors - Harmonious Warm Palette
			brand: {
				primary: {
					DEFAULT: 'var(--brand-primary)',
					hover: 'var(--brand-primary-hover)',
					light: 'var(--brand-primary-light)',
					dark: 'var(--brand-primary-dark)',
				},
				secondary: {
					DEFAULT: 'var(--brand-secondary)',
					hover: 'var(--brand-secondary-hover)',
					light: 'var(--brand-secondary-light)',
					dark: 'var(--brand-secondary-dark)',
				},
				accent: {
					DEFAULT: 'var(--brand-accent)',
					hover: 'var(--brand-accent-hover)',
					light: 'var(--brand-accent-light)',
				},
				neutral: {
					DEFAULT: 'var(--brand-neutral)',
					light: 'var(--brand-neutral-light)',
					dark: 'var(--brand-neutral-dark)',
				},
				success: {
					DEFAULT: 'var(--brand-success)',
					light: 'var(--brand-success-light)',
				},
				warning: {
					DEFAULT: 'var(--brand-warning)',
					light: 'var(--brand-warning-light)',
				},
				error: {
					DEFAULT: 'var(--brand-error)',
					light: 'var(--brand-error-light)',
				},
				info: {
					DEFAULT: 'var(--brand-info)',
					light: 'var(--brand-info-light)',
				},
			},
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
