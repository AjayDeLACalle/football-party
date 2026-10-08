import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Footy Party',
  slug: 'football-party',
  experiments: {
    ...config.experiments,
    baseUrl: process.env.APP_BASE_PATH ?? '',
  },
});
