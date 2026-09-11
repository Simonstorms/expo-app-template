import type { PurchasesPackage } from 'react-native-purchases';

import { brand } from '@/constants/brand';
import { hasRevenueCat } from '@/constants/config';

import { hasFreeTrial } from '../api';
import type { PaywallPackages, PlanPackages } from '../api';

export type PlanKey = 'yearly' | 'monthly';

export type BillingPeriod = 'year' | 'month';

export type StandardPricing = {
  monthlyAvailable: boolean;
  mainPlan: PlanKey;
  mainPkg: PurchasesPackage | null;
  mainPeriod: BillingPeriod;
  mainPrice: string;
  mainTrial: boolean;
  priceReady: boolean;
  priceFailed: boolean;
  trialPkg: PurchasesPackage | null;
  trialReady: boolean;
  yearlyPrice: string;
  yearlyPerMonth: string;
  monthlyPrice: string;
  yearlySavings: number | null;
};

export type OfferPricing = {
  hasOffer: boolean;
  offerPkg: PurchasesPackage | null;
  offerReady: boolean;
  offerTrial: boolean;
  offerYearlyPrice: string;
  offerYearlyPerMonth: string;
  offerDiscount: number | null;
};

type MainSelection = {
  monthlyAvailable: boolean;
  mainPlan: PlanKey;
  mainPkg: PurchasesPackage | null;
};

type DisplayPrices = {
  yearlyPrice: string;
  yearlyPerMonth: string;
  monthlyPrice: string;
};

function discountPercent(standard?: number, offer?: number): number | null {
  if (!standard || !offer || standard <= 0 || offer >= standard) {
    return null;
  }
  return Math.round((1 - offer / standard) * 100);
}

function savingsPercent(
  annual: PurchasesPackage | null | undefined,
  monthly: PurchasesPackage | null | undefined,
): number | null {
  const annualPrice = annual?.product.price;
  const monthlyPrice = monthly?.product.price;
  if (!annualPrice || !monthlyPrice || monthlyPrice <= 0) {
    return null;
  }
  const annualPerMonth = annualPrice / 12;
  if (annualPerMonth >= monthlyPrice) {
    return null;
  }
  return Math.round((1 - annualPerMonth / monthlyPrice) * 100);
}

function selectMainPlan(standard: PlanPackages | undefined, plan: PlanKey): MainSelection {
  const monthlyAvailable = !hasRevenueCat || Boolean(standard?.monthly);
  const mainPlan: PlanKey = plan === 'monthly' && monthlyAvailable ? 'monthly' : 'yearly';
  const mainPkg = (mainPlan === 'yearly' ? standard?.annual : standard?.monthly) ?? null;
  return { monthlyAvailable, mainPlan, mainPkg };
}

function displayPrices(standard: PlanPackages | undefined): DisplayPrices {
  return {
    yearlyPrice: standard?.annual?.product.priceString ?? brand.pricing.yearly,
    yearlyPerMonth: standard?.annual?.product.pricePerMonthString ?? brand.pricing.yearlyPerMonth,
    monthlyPrice: standard?.monthly?.product.priceString ?? brand.pricing.monthly,
  };
}

export function deriveStandardPricing(
  packages: PaywallPackages | undefined,
  plan: PlanKey,
  pricesPending: boolean,
): StandardPricing {
  const standard = packages?.standard;
  const selection = selectMainPlan(standard, plan);
  const prices = displayPrices(standard);
  const priceReady = !hasRevenueCat || selection.mainPkg !== null;
  const trialPkg = standard?.annual ?? null;
  const yearly = selection.mainPlan === 'yearly';
  return {
    ...selection,
    ...prices,
    mainPeriod: yearly ? 'year' : 'month',
    mainPrice: yearly ? prices.yearlyPrice : prices.monthlyPrice,
    mainTrial: hasFreeTrial(selection.mainPkg),
    priceReady,
    priceFailed: !priceReady && !pricesPending,
    trialPkg,
    trialReady: !hasRevenueCat || trialPkg !== null,
    yearlySavings: savingsPercent(standard?.annual, standard?.monthly),
  };
}

export function deriveOfferPricing(packages: PaywallPackages | undefined): OfferPricing {
  const offerPkg = packages?.offer.annual ?? null;
  const offerAvailable = !hasRevenueCat || offerPkg !== null;
  return {
    hasOffer: offerAvailable,
    offerPkg,
    offerReady: offerAvailable,
    offerTrial: hasRevenueCat ? hasFreeTrial(offerPkg) : false,
    offerYearlyPrice: offerPkg?.product.priceString ?? brand.pricing.offerYearly,
    offerYearlyPerMonth: offerPkg?.product.pricePerMonthString ?? brand.pricing.offerPerMonth,
    offerDiscount: discountPercent(
      packages?.standard.annual?.product.price,
      offerPkg?.product.price,
    ),
  };
}
