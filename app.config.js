module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    devApiKey: process.env.EXPO_PUBLIC_ENV === 'production' ? '' : (process.env.DEV_API_KEY ?? ''),
  },
});
