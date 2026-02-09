export const config = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
    foodfactsUrl: 'https://world.openfoodfacts.org/api/v0',
    timeout: 30000,
  },
};

export default config;
