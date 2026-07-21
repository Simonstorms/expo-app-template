import RevenueCatUI from 'react-native-purchases-ui';

export async function presentCustomerCenter(): Promise<void> {
  await RevenueCatUI.presentCustomerCenter();
}
