import Purchases from 'react-native-purchases';
import type { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';

import { config, hasRevenueCat } from '@/constants/config';
import { isRecord } from '@/lib/guards';
import { isRevenueCatConfigured } from '@/lib/revenuecat';

const OFFER_OFFERING_IDS = ['offer', 'discount', 'one-time-offer'];

export type PlanPackages = {
  annual: PurchasesPackage | null;
  monthly: PurchasesPackage | null;
};

export type OfferPackages = {
  annual: PurchasesPackage | null;
};

export type PaywallPackages = {
  standard: PlanPackages;
  offer: OfferPackages;
};

export type PurchaseOutcome = 'purchased' | 'cancelled' | 'failed';

export type RestoreOutcome = 'restored' | 'none' | 'failed';

const emptyPlans: PlanPackages = { annual: null, monthly: null };

const emptyPackages: PaywallPackages = { standard: emptyPlans, offer: { annual: null } };

function annualPackage(offering: PurchasesOffering | null | undefined): PurchasesPackage | null {
  if (!offering) {
    return null;
  }
  if (offering.annual) {
    return offering.annual;
  }
  const matched = offering.availablePackages.find(
    (pkg) => pkg.packageType === Purchases.PACKAGE_TYPE.ANNUAL,
  );
  return matched ?? null;
}

function planPackages(offering: PurchasesOffering | null | undefined): PlanPackages {
  if (!offering) {
    return emptyPlans;
  }
  return {
    annual: annualPackage(offering),
    monthly: offering.monthly ?? null,
  };
}

function storeReady(): boolean {
  return hasRevenueCat && isRevenueCatConfigured();
}

export async function getPaywallPackages(): Promise<PaywallPackages> {
  if (!storeReady()) {
    return emptyPackages;
  }
  const offerings = await Purchases.getOfferings();
  const offerOffering = OFFER_OFFERING_IDS.map((id) => offerings.all[id]).find(
    (offering) => offering && offering.availablePackages.length > 0,
  );
  return {
    standard: planPackages(offerings.current),
    offer: { annual: annualPackage(offerOffering) },
  };
}

export function hasFreeTrial(pkg: PurchasesPackage | null | undefined): boolean {
  if (!hasRevenueCat) {
    return true;
  }
  const intro = pkg?.product.introPrice;
  return Boolean(intro && intro.price === 0);
}

export async function purchaseProPackage(pkg: PurchasesPackage): Promise<PurchaseOutcome> {
  if (!storeReady()) {
    return 'failed';
  }
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const entitled = customerInfo.entitlements.active[config.revenueCatEntitlement] !== undefined;
    return entitled ? 'purchased' : 'failed';
  } catch (error) {
    if (isRecord(error) && error.userCancelled === true) {
      return 'cancelled';
    }
    return 'failed';
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!storeReady()) {
    return false;
  }
  const info = await Purchases.restorePurchases();
  return info.entitlements.active[config.revenueCatEntitlement] !== undefined;
}

export async function runRestore(): Promise<RestoreOutcome> {
  try {
    return (await restorePurchases()) ? 'restored' : 'none';
  } catch {
    return 'failed';
  }
}
