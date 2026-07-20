import type {
  CustomPurchaseControllerContext,
  OnPurchaseParams,
  PurchaseResult,
  RestoreResult,
} from 'expo-superwall';
import Purchases, { PURCHASES_ERROR_CODE } from 'react-native-purchases';

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return typeof error === 'string' ? error : 'Purchase failed.';
}

function isUserCancelled(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'userCancelled' in error &&
    (error as { userCancelled?: boolean | null }).userCancelled === true
  );
}

function isPending(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR
  );
}

async function purchase(params: OnPurchaseParams): Promise<void> {
  const [product] = await Purchases.getProducts([params.productId]);
  if (!product) {
    throw new Error(`Product "${params.productId}" was not found in RevenueCat.`);
  }
  if (params.platform === 'android') {
    const wantedId = params.offerId
      ? `${params.basePlanId}:${params.offerId}`
      : params.basePlanId;
    const option = product.subscriptionOptions?.find((candidate) => candidate.id === wantedId);
    if (option) {
      await Purchases.purchaseSubscriptionOption(option);
      return;
    }
  }
  await Purchases.purchaseStoreProduct(product);
}

async function onPurchase(params: OnPurchaseParams): Promise<PurchaseResult> {
  try {
    await purchase(params);
    return { type: 'purchased' };
  } catch (error) {
    if (isUserCancelled(error)) return { type: 'cancelled' };
    if (isPending(error)) return { type: 'pending' };
    return { type: 'failed', error: errorMessage(error) };
  }
}

async function onPurchaseRestore(): Promise<RestoreResult> {
  try {
    await Purchases.restorePurchases();
    return { type: 'restored' };
  } catch (error) {
    return { type: 'failed', error: errorMessage(error) };
  }
}

export const revenueCatPurchaseController: CustomPurchaseControllerContext = {
  onPurchase,
  onPurchaseRestore,
};
