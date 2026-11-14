import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'vendor',
                test: /node_modules/,
              },
              {
                name: 'rules-pph-penghasilan',
                test: /\/src\/rules\/(pph21|pph22|pph23|pph25|pph26|pph15)\//,
              },
              {
                name: 'rules-pph-usaha',
                test: /\/src\/rules\/(pph4_2|pph_umkm|pph_badan|sources)/,
              },
              {
                name: 'rules-ppn-daerah',
                test: /\/src\/rules\/(ppn|ppnbm|pbb|bphtb|pbjt|bea_meterai)\//,
              },
            ],
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
