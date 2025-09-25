import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react({
		jsxRuntime: 'automatic',
		jsxImportSource: 'react'
	})],
	server: {
		cors: true,
		headers: {
			'Cross-Origin-Embedder-Policy': 'credentialless',
			// Remove no-cache headers for better performance
		},
		allowedHosts: true,
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	optimizeDeps: {
		include: [
			'react',
			'react-dom',
			'react-router-dom',
			'zustand',
			'@supabase/supabase-js',
			'lucide-react',
			'framer-motion'
		],
		force: false // Only force when needed
	},
	build: {
		target: 'esnext',
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true, // Remove console.log in production
				drop_debugger: true,
			},
		},
		rollupOptions: {
			external: [
				'@babel/parser',
				'@babel/traverse',
				'@babel/generator',
				'@babel/types'
			],
			output: {
				manualChunks: {
					// Vendor chunks
					'vendor-react': ['react', 'react-dom'],
					'vendor-router': ['react-router-dom'],
					'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-toast'],
					'vendor-icons': ['lucide-react'],
					'vendor-animation': ['framer-motion'],
					'vendor-db': ['@supabase/supabase-js'],
					'vendor-utils': ['zustand', 'clsx', 'tailwind-merge'],
				},
				chunkFileNames: 'assets/[name]-[hash].js',
				entryFileNames: 'assets/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash].[ext]'
			}
		},
		chunkSizeWarningLimit: 1000,
		sourcemap: false // Disable sourcemaps for faster builds
	}
});
