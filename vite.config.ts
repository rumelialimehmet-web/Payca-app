import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProduction = mode === 'production';

    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },

      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },

      // Build optimizations
      build: {
        // Target modern browsers
        target: 'es2020',

        // Minification
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: isProduction, // Remove console.log in production
            drop_debugger: isProduction,
            pure_funcs: isProduction ? ['console.log', 'console.info'] : []
          },
          format: {
            comments: false // Remove comments
          }
        },

        // Chunk size warnings
        chunkSizeWarningLimit: 600, // KB

        // Rollup options for code splitting
        rollupOptions: {
          output: {
            // Manual chunks for better caching
            manualChunks: (id) => {
              // Vendor chunk (node_modules)
              if (id.includes('node_modules')) {
                // Separate large libraries
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'vendor-react';
                }
                if (id.includes('@supabase')) {
                  return 'vendor-supabase';
                }
                if (id.includes('@google/generative-ai')) {
                  return 'vendor-gemini';
                }
                if (id.includes('xlsx')) {
                  return 'vendor-xlsx';
                }
                // Other dependencies
                return 'vendor';
              }

              // Feature-based chunks
              if (id.includes('/src/components/')) {
                return 'components';
              }
              if (id.includes('/src/lib/')) {
                return 'lib';
              }
            },

            // Consistent chunk naming
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]'
          }
        },

        // Source maps only in development
        sourcemap: !isProduction,

        // Report compressed size
        reportCompressedSize: true,

        // CSS code splitting
        cssCodeSplit: true
      },

      // Performance optimizations
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          '@supabase/supabase-js',
          'qrcode.react'
        ],
        exclude: [
          '@google/generative-ai' // Lazy loaded
        ]
      },

      // Server options
      server: {
        port: 3000,
        strictPort: true,
        host: true
      },

      // Preview options
      preview: {
        port: 3000,
        strictPort: true,
        host: true
      }
    };
});
