import { config, hasSuperwall } from '@/constants/config';

export const superwallApiKeys = {
  ios: config.superwallIosKey,
  android: config.superwallAndroidKey,
};

export const paywallPlacement = config.superwallPlacement;

export { hasSuperwall };
