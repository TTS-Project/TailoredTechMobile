import type { CapacitorConfig } from '@capacitor/cli';

// Distinct from Terra Farming's io.terrafarming.app — do not reuse App IDs
// across products, each needs its own registration in Apple Developer /
// Google Play Console.
const config: CapacitorConfig = {
  appId: 'org.tailoredtechsolutions.app',
  appName: 'Tailored Tech Solutions',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
