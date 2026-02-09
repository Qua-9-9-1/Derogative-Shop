export const config = {
  api: {
    baseUrl: process.env.API_URL || 'http://localhost:3000',
    timeout: 30000,
  },
};

export default config;
