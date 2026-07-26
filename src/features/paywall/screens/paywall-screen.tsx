import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

import { GlassIconButton } from '@/components/ui/glass-icon-button';
import { Icon } from '@/components/ui/icon';
import { PhoneMockup } from '@/components/ui/phone-mockup';
import { PrimaryCTA } from '@/components/ui/primary-cta';
import { TrialTimeline, type TimelineStep } from '@/components/ui/trial-timeline';
import { brand } from '@/constants/brand';
import { hasRevenueCat, hasSupabase } from '@/constants/config';
import { content } from '@/constants/content';
import { colors, font, layout, shadow, withAlpha } from '@/constants/theme';
import { deleteAccount } from '@/features/auth/api';
import { useSession } from '@/features/auth/hooks/use-session';
import { OnboardingScaffold } from '@/features/onboarding/components/onboarding-scaffold';
import { useFlow } from '@/features/onboarding/hooks/use-flow';
import { captureEvent, flushAnalytics, setPersonProperties } from '@/lib/analytics';
import { cancelTrialReminder, scheduleTrialReminder } from '@/lib/notifications';
import { getPaywallPackages, hasFreeTrial, purchaseProPackage, restorePurchases } from '../api';
import { useEntitlement } from '../hooks/use-entitlement';

type PlanKey = 'yearly' | 'monthly';
type DeclineReason = 'price' | 'unsure' | 'browsing';
type SheetState = 'none' | 'reason' | 'reassure';
type Placement = 'main' | 'offer' | 'reassure';
type RestoreOutcome = 'restored' | 'none' | 'failed';

const CLOSE_DELAY_MS = 3500;
const PREVIEW_WIDTH = 172;
const TRIAL_REMINDER_DAYS_BEFORE_END = 2;

const declineOptions: { reason: DeclineReason; emoji: string; label: string }[] = [
  { reason: 'price', emoji: '💸', label: content.paywall.decline.price },
  { reason: 'unsure', emoji: '🤔', label: content.paywall.decline.unsure },
  { reason: 'browsing', emoji: '👀', label: content.paywall.decline.browsing },
];

const timelineSteps: TimelineStep[] = content.paywall.timeline.map((step) => ({
  title: step.title,
  caption: step.body,
  symbol: step.icon,
}));

function discountPercent(standard?: number, offer?: number): number | null {
  if (!standard || !offer || standard <= 0 || offer >= standard) return null;
  return Math.round((1 - offer / standard) * 100);
}

function savingsPercent(
  annual: PurchasesPackage | null | undefined,
  monthly: PurchasesPackage | null | undefined,
): number | null {
  const annualPrice = annual?.product.price;
  const monthlyPrice = monthly?.product.price;
  if (!annualPrice || !monthlyPrice || monthlyPrice <= 0) return null;
  const annualPerMonth = annualPrice / 12;
  if (annualPerMonth >= monthlyPrice) return null;
  return Math.round((1 - annualPerMonth / monthlyPrice) * 100);
}

async function runRestore(): Promise<RestoreOutcome> {
  try {
    return (await restorePurchases()) ? 'restored' : 'none';
  } catch {
    return 'failed';
  }
}

function openUrl(url: string): void {
  void Linking.openURL(url).catch(() => undefined);
}

function TrialCard() {
  return (
    <View style={styles.timelineCard}>
      <TrialTimeline steps={timelineSteps} />
    </View>
  );
}

function AppPreview() {
  const mock = content.paywall.mock;
  const stats = [
    { value: mock.unitsValue, label: mock.unitsLabel },
    { value: mock.savedValue, label: mock.savedLabel },
    { value: mock.healthValue, label: mock.healthLabel },
  ];

  return (
    <PhoneMockup width={PREVIEW_WIDTH}>
      <View style={styles.preview}>
        <Text style={styles.previewWordmark} numberOfLines={1}>
          {mock.wordmark}
        </Text>
        <View style={styles.previewHero}>
          <Text style={styles.previewHeroValue}>{mock.daysValue}</Text>
          <Text style={styles.previewHeroLabel} numberOfLines={1}>
            {mock.daysLabel}
          </Text>
        </View>
        <View style={styles.previewStatRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.previewStat}>
              <Text style={styles.previewStatValue} numberOfLines={1} adjustsFontSizeToFit>
                {stat.value}
              </Text>
              <Text style={styles.previewStatLabel} numberOfLines={1}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.previewSection}>{mock.recent}</Text>
        <View style={styles.previewRow}>
          <View style={styles.previewRowHeader}>
            <Text style={styles.previewRowTitle} numberOfLines={1}>
              {mock.checkinTitle}
            </Text>
            <Text style={styles.previewRowTime}>{mock.checkinTime}</Text>
          </View>
          <Text style={styles.previewRowDetail} numberOfLines={1}>
            {mock.checkinStat}
          </Text>
        </View>
      </View>
    </PhoneMockup>
  );
}

function PlanOption({
  title,
  price,
  sub,
  subStruck = false,
  badge,
  selected,
  onPress,
}: {
  title: string;
  price: string;
  sub?: string | null;
  subStruck?: boolean;
  badge?: string | null;
  selected: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={sub ? `${title}, ${price}, ${sub}` : `${title}, ${price}`}
      accessibilityState={{ selected }}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.planOption, selected ? styles.planOptionSelected : null]}
    >
      <View style={styles.planOptionRow}>
        <Text style={styles.planOptionTitle}>{title}</Text>
        {badge ? (
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.planOptionRow}>
        <Text style={styles.planOptionPrice}>{price}</Text>
        {sub ? (
          <Text style={[styles.planOptionSub, subStruck ? styles.planOptionSubStruck : null]}>
            {sub}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function PaywallScreen({ fromHome = false }: { fromHome?: boolean }) {
  const router = useRouter();
  const flow = useFlow('paywall');
  const { finish } = flow;
  const { isPro } = useEntitlement();
  const { user } = useSession();
  const [view, setView] = useState<'main' | 'offer'>('main');
  const [sheet, setSheet] = useState<SheetState>('none');
  const [plan, setPlan] = useState<PlanKey>('yearly');
  const [busy, setBusy] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const done = useRef(false);

  const {
    data: packages,
    isPending: pricesPending,
    isFetching: pricesFetching,
    refetch: refetchPackages,
  } = useQuery({
    queryKey: ['revenuecat', 'paywall-packages'],
    queryFn: getPaywallPackages,
  });

  const standard = packages?.standard;
  const offer = packages?.offer;
  const hasOffer = !hasRevenueCat || Boolean(offer?.annual);

  const monthlyAvailable = !hasRevenueCat || Boolean(standard?.monthly);
  const mainPlan: PlanKey = plan === 'monthly' && monthlyAvailable ? 'monthly' : 'yearly';
  const mainPkg = (mainPlan === 'yearly' ? standard?.annual : standard?.monthly) ?? null;
  const mainPeriod = mainPlan === 'yearly' ? 'year' : 'month';
  const priceReady = !hasRevenueCat || Boolean(mainPkg);
  const priceFailed = !priceReady && !pricesPending;
  const mainTrial = hasFreeTrial(mainPkg);

  const trialPkg = standard?.annual ?? null;
  const trialReady = !hasRevenueCat || Boolean(trialPkg);

  const offerPkg = offer?.annual ?? null;
  const offerReady = !hasRevenueCat || Boolean(offerPkg);
  const offerTrial = hasRevenueCat ? hasFreeTrial(offerPkg) : false;

  const yearlyPrice = standard?.annual?.product.priceString ?? brand.pricing.yearly;
  const yearlyPerMonth =
    standard?.annual?.product.pricePerMonthString ?? brand.pricing.yearlyPerMonth;
  const monthlyPrice = standard?.monthly?.product.priceString ?? brand.pricing.monthly;
  const offerYearlyPrice = offerPkg?.product.priceString ?? brand.pricing.offerYearly;
  const offerYearlyPerMonth = offerPkg?.product.pricePerMonthString ?? brand.pricing.offerPerMonth;

  const yearlySavings = savingsPercent(standard?.annual, standard?.monthly);
  const offerDiscount = discountPercent(standard?.annual?.product.price, offerPkg?.product.price);

  const mainPrice = mainPlan === 'yearly' ? yearlyPrice : monthlyPrice;
  const context = fromHome ? 'home' : 'onboarding';
  const canDeleteAccount = hasSupabase && Boolean(user);

  const complete = () => {
    if (done.current) return;
    done.current = true;
    if (fromHome) {
      router.back();
      return;
    }
    void finish();
  };

  const selectPlan = (next: PlanKey, placement: 'main' | 'offer') => {
    if (next === plan) return;
    setPlan(next);
    captureEvent('paywall_plan_selected', { plan: next, placement, context });
  };

  const openOffer = () => {
    setView('offer');
    captureEvent('paywall_offer_viewed', { context });
  };

  const closeSheet = () => setSheet('none');

  const onMainClose = () => {
    captureEvent('paywall_dismissed', { view: 'main', context });
    if (hasOffer) {
      setSheet('reason');
      return;
    }
    if (fromHome) complete();
  };

  const chooseReason = (reason: DeclineReason) => {
    captureEvent('paywall_decline_reason_selected', { reason, context });
    if (reason === 'price') {
      setSheet('none');
      openOffer();
      return;
    }
    if (reason === 'unsure') {
      setSheet('reassure');
      return;
    }
    setSheet('none');
    if (fromHome) complete();
  };

  const onOfferClose = () => {
    captureEvent('paywall_dismissed', { view: 'offer', context });
    if (fromHome) {
      complete();
      return;
    }
    setView('main');
  };

  const buy = async (pkg: PurchasesPackage | null, placement: Placement) => {
    if (busy || restoring) return;
    if (!hasRevenueCat || isPro) {
      complete();
      return;
    }
    if (!pkg) {
      Alert.alert(content.paywall.purchaseErrorTitle, content.paywall.purchaseErrorBody);
      return;
    }
    const productDetails = {
      product_id: pkg.product.identifier,
      price: pkg.product.price,
      currency: pkg.product.currencyCode,
    };
    captureEvent('purchase_started', { placement, plan: mainPlan, ...productDetails });
    setBusy(true);
    const outcome = await purchaseProPackage(pkg);
    setBusy(false);
    captureEvent('paywall_purchase_result', {
      placement,
      plan: mainPlan,
      outcome,
      ...productDetails,
    });
    if (outcome === 'purchased') {
      setPersonProperties({ is_pro: true, subscription_product: pkg.product.identifier });
      flushAnalytics();
      if (hasFreeTrial(pkg)) {
        void scheduleTrialReminder(TRIAL_REMINDER_DAYS_BEFORE_END).catch(() => false);
      } else {
        void cancelTrialReminder();
      }
      complete();
      return;
    }
    flushAnalytics();
    if (outcome === 'cancelled') {
      if (placement === 'main' && hasOffer) openOffer();
      return;
    }
    Alert.alert(content.paywall.purchaseErrorTitle, content.paywall.purchaseErrorBody);
  };

  const startReassureTrial = () => {
    setSheet('none');
    setPlan('yearly');
    void buy(trialPkg, 'reassure');
  };

  const onRestore = () => {
    if (restoring || busy) return;
    setRestoring(true);
    void runRestore().then((outcome) => {
      setRestoring(false);
      captureEvent('purchase_restore_result', { restored: outcome === 'restored' });
      if (outcome === 'restored') {
        complete();
        return;
      }
      if (outcome === 'none') {
        Alert.alert(content.paywall.restoreNoneTitle, content.paywall.restoreNoneBody);
        return;
      }
      Alert.alert(content.paywall.restoreErrorTitle, content.paywall.restoreErrorBody);
    });
  };

  const confirmDeleteAccount = () => {
    Alert.alert(content.settings.deleteConfirmTitle, content.settings.deleteConfirmBody, [
      { text: content.settings.deleteConfirmCancel, style: 'cancel' },
      {
        text: content.settings.deleteConfirmAction,
        style: 'destructive',
        onPress: () => {
          captureEvent('account_deleted');
          flushAnalytics();
          deleteAccount()
            .then(() => router.replace('/'))
            .catch(() => {
              Alert.alert(content.settings.deleteErrorTitle, content.settings.deleteErrorBody);
            });
        },
      },
    ]);
  };

  const legalRow = (
    <View style={styles.legalRow}>
      <Pressable accessibilityRole="link" hitSlop={8} onPress={() => openUrl(brand.legal.termsUrl)}>
        <Text style={styles.legalLink}>{content.paywall.termsLabel}</Text>
      </Pressable>
      <Text style={styles.legalDivider}>·</Text>
      <Pressable
        accessibilityRole="link"
        hitSlop={8}
        onPress={() => openUrl(brand.legal.privacyUrl)}
      >
        <Text style={styles.legalLink}>{content.paywall.privacyLabel}</Text>
      </Pressable>
      {canDeleteAccount ? (
        <>
          <Text style={styles.legalDivider}>·</Text>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={confirmDeleteAccount}>
            <Text style={styles.legalLink}>{content.paywall.deleteAccount}</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );

  const mainFooter = (
    <View style={styles.footer}>
      {priceReady ? (
        <View style={styles.planList}>
          <PlanOption
            title={content.paywall.planYearly}
            price={`${yearlyPrice}${content.paywall.perYear}`}
            sub={`${yearlyPerMonth}${content.paywall.perMonthShort}`}
            badge={yearlySavings ? content.paywall.savingsBadge(yearlySavings) : null}
            selected={mainPlan === 'yearly'}
            onPress={() => selectPlan('yearly', 'main')}
          />
          {monthlyAvailable ? (
            <PlanOption
              title={content.paywall.planMonthly}
              price={`${monthlyPrice}${content.paywall.perMonth}`}
              selected={mainPlan === 'monthly'}
              onPress={() => selectPlan('monthly', 'main')}
            />
          ) : null}
        </View>
      ) : priceFailed ? (
        <View style={styles.priceErrorWrap}>
          <Text style={styles.priceCaption}>{content.paywall.priceError}</Text>
          <Pressable
            accessibilityRole="button"
            disabled={pricesFetching}
            hitSlop={8}
            onPress={() => {
              void refetchPackages();
            }}
          >
            <Text style={[styles.priceRetry, pricesFetching ? styles.priceRetryBusy : null]}>
              {content.paywall.priceRetry}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.priceCaption}>{content.paywall.priceLoading}</Text>
      )}
      {mainTrial && priceReady ? (
        <View style={styles.checkRow}>
          <Icon name="checkmark" size={15} weight="bold" color={colors.ink} />
          <Text style={styles.checkText}>{content.paywall.noPayment}</Text>
        </View>
      ) : null}
      <PrimaryCTA
        title={mainTrial && priceReady ? content.paywall.ctaTrial : content.paywall.cta}
        enabled={!busy && priceReady}
        onPress={() => {
          void buy(mainPkg, 'main');
        }}
      />
      {priceReady ? (
        <Text style={styles.disclosure}>
          {mainTrial
            ? content.paywall.trialTerms(mainPrice, mainPeriod)
            : content.paywall.billedTerms(mainPrice, mainPeriod)}
        </Text>
      ) : null}
      {legalRow}
    </View>
  );

  const offerFooter = (
    <View style={styles.footer}>
      <View style={styles.planList}>
        <PlanOption
          title={content.paywall.planYearly}
          price={`${offerYearlyPrice}${content.paywall.perYear}`}
          sub={
            offerDiscount
              ? content.paywall.offer.wasPrice(yearlyPrice)
              : `${offerYearlyPerMonth}${content.paywall.perMonthShort}`
          }
          subStruck={Boolean(offerDiscount)}
          badge={offerDiscount ? content.paywall.offer.discountBadge(offerDiscount) : null}
          selected
        />
      </View>
      <PrimaryCTA
        title={offerTrial ? content.paywall.offer.ctaTrial : content.paywall.offer.cta}
        enabled={!busy && offerReady}
        onPress={() => {
          void buy(offerPkg, 'offer');
        }}
      />
      <View style={styles.checkRow}>
        <Icon name="checkmark" size={15} weight="bold" color={colors.ink} />
        <Text style={styles.checkText}>{content.paywall.offer.noCommitment}</Text>
      </View>
      {offerReady ? (
        <Text style={styles.disclosure}>
          {offerTrial
            ? content.paywall.trialTerms(offerYearlyPrice, 'year')
            : content.paywall.billedTerms(offerYearlyPrice, 'year')}
        </Text>
      ) : null}
      {legalRow}
    </View>
  );

  return (
    <OnboardingScaffold flow={flow} footer={view === 'main' ? mainFooter : offerFooter}>
      {view === 'main' ? (
        <Animated.View key="main" entering={FadeIn.duration(220)} style={styles.flex}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.topRow}>
              {hasOffer || fromHome ? (
                <Animated.View entering={FadeIn.delay(fromHome ? 0 : CLOSE_DELAY_MS).duration(420)}>
                  <GlassIconButton
                    icon="xmark"
                    size={30}
                    iconSize={13}
                    iconColor={withAlpha(colors.ink, 0.55)}
                    accessibilityLabel={content.paywall.decline.later}
                    onPress={onMainClose}
                  />
                </Animated.View>
              ) : (
                <View style={styles.closeSpacer} />
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={content.paywall.restore}
                hitSlop={10}
                disabled={restoring}
                onPress={onRestore}
                style={{ opacity: restoring ? 0.5 : 1 }}
              >
                <Text style={styles.restore}>{content.paywall.restore}</Text>
              </Pressable>
            </View>
            <Text style={styles.title}>{content.paywall.headline}</Text>
            {mainTrial && priceReady ? <TrialCard /> : null}
            <View style={styles.previewWrap}>
              <AppPreview />
            </View>
          </ScrollView>
        </Animated.View>
      ) : (
        <Animated.View key="offer" entering={FadeIn.duration(220)} style={styles.flex}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.topRow}>
              <GlassIconButton
                icon="xmark"
                size={30}
                iconSize={13}
                iconColor={withAlpha(colors.ink, 0.55)}
                accessibilityLabel={content.paywall.decline.later}
                onPress={onOfferClose}
              />
              <View style={styles.closeSpacer} />
            </View>
            <Text style={styles.offerTitle}>{content.paywall.offer.title}</Text>
            <View style={styles.previewWrap}>
              <AppPreview />
            </View>
            <Text style={styles.offerNote}>{content.paywall.offer.note}</Text>
            <Text style={styles.offerSignature}>{content.paywall.offer.signature}</Text>
          </ScrollView>
        </Animated.View>
      )}
      <Modal
        transparent
        visible={sheet !== 'none'}
        animationType="fade"
        onRequestClose={closeSheet}
      >
        <View style={styles.sheetRoot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={content.paywall.decline.later}
            style={styles.sheetScrim}
            onPress={closeSheet}
          />
          <Animated.View entering={SlideInDown.duration(300)} style={styles.sheetCard}>
            <View style={styles.sheetHandle} />
            {sheet === 'reason' ? (
              <>
                <Text style={styles.sheetTitle}>{content.paywall.decline.title}</Text>
                <Text style={styles.sheetSubtitle}>{content.paywall.decline.subtitle}</Text>
                <View style={styles.sheetOptions}>
                  {declineOptions.map((option) => (
                    <Pressable
                      key={option.reason}
                      accessibilityRole="button"
                      accessibilityLabel={option.label}
                      style={styles.sheetOption}
                      onPress={() => chooseReason(option.reason)}
                    >
                      <Text style={styles.sheetOptionEmoji}>{option.emoji}</Text>
                      <Text style={styles.sheetOptionLabel}>{option.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            ) : (
              <>
                <Text style={styles.sheetTitle}>{content.paywall.decline.reassureTitle}</Text>
                <TrialCard />
                <PrimaryCTA
                  title={content.paywall.ctaTrial}
                  enabled={!busy && trialReady}
                  onPress={startReassureTrial}
                />
                {trialReady ? (
                  <Text style={styles.disclosure}>
                    {content.paywall.trialTerms(yearlyPrice, 'year')}
                  </Text>
                ) : null}
                <Pressable accessibilityRole="button" hitSlop={8} onPress={closeSheet}>
                  <Text style={styles.sheetLater}>{content.paywall.decline.later}</Text>
                </Pressable>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: layout.margin,
    paddingTop: 8,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 34,
  },
  closeSpacer: {
    width: 30,
    height: 30,
  },
  restore: {
    fontSize: 15,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: withAlpha(colors.ink, 0.55),
  },
  title: {
    fontSize: 28,
    fontFamily: font.bold,
    fontWeight: '700',
    letterSpacing: -0.7,
    lineHeight: 36,
    color: colors.ink,
    textAlign: 'center',
    marginTop: 16,
  },
  timelineCard: {
    marginTop: 18,
    borderRadius: layout.cardRadius,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.cardStroke,
    backgroundColor: colors.white,
    paddingTop: 16,
    paddingBottom: 2,
    paddingHorizontal: 16,
    ...shadow.soft,
  },
  previewWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  preview: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 26,
  },
  previewWordmark: {
    fontSize: 13,
    fontFamily: font.bold,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: colors.ink,
  },
  previewHero: {
    marginTop: 12,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: colors.cardFill,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 2,
  },
  previewHeroValue: {
    fontSize: 26,
    fontFamily: font.bold,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: colors.ink,
  },
  previewHeroLabel: {
    fontSize: 10,
    fontFamily: font.medium,
    color: colors.secondaryText,
  },
  previewStatRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  previewStat: {
    flex: 1,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: colors.cardFill,
    paddingVertical: 9,
    paddingHorizontal: 6,
    gap: 2,
  },
  previewStatValue: {
    fontSize: 12,
    fontFamily: font.bold,
    fontWeight: '700',
    color: colors.ink,
  },
  previewStatLabel: {
    fontSize: 8,
    fontFamily: font.regular,
    color: colors.secondaryText,
  },
  previewSection: {
    marginTop: 14,
    fontSize: 11,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: colors.ink,
  },
  previewRow: {
    marginTop: 7,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: colors.cardFill,
    paddingVertical: 9,
    paddingHorizontal: 10,
    gap: 3,
  },
  previewRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewRowTitle: {
    flex: 1,
    fontSize: 9.5,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: colors.ink,
  },
  previewRowTime: {
    fontSize: 8,
    fontFamily: font.regular,
    color: colors.secondaryText,
  },
  previewRowDetail: {
    fontSize: 8.5,
    fontFamily: font.regular,
    color: colors.secondaryText,
  },
  footer: {
    paddingHorizontal: layout.ctaMargin,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  planList: {
    gap: 10,
  },
  planOption: {
    borderRadius: layout.rowRadius,
    borderCurve: 'continuous',
    borderWidth: 2,
    borderColor: withAlpha(colors.ink, 0.1),
    backgroundColor: colors.white,
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 5,
  },
  planOptionSelected: {
    borderColor: colors.ink,
    ...shadow.soft,
  },
  planOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planOptionTitle: {
    fontSize: 16,
    fontFamily: font.bold,
    fontWeight: '700',
    color: colors.ink,
  },
  planOptionPrice: {
    fontSize: 15,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: colors.ink,
  },
  planOptionSub: {
    fontSize: 13.5,
    fontFamily: font.medium,
    color: colors.secondaryText,
  },
  planOptionSubStruck: {
    textDecorationLine: 'line-through',
  },
  planBadge: {
    borderRadius: 999,
    backgroundColor: colors.ink,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  planBadgeText: {
    fontSize: 11,
    fontFamily: font.bold,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: colors.white,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkText: {
    fontSize: 15.5,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: colors.ink,
  },
  priceCaption: {
    fontSize: 14,
    fontFamily: font.medium,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  priceErrorWrap: {
    alignItems: 'center',
    gap: 6,
  },
  priceRetry: {
    fontSize: 14.5,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: colors.accent,
    textAlign: 'center',
    paddingVertical: 2,
  },
  priceRetryBusy: {
    opacity: 0.5,
  },
  disclosure: {
    fontSize: 11,
    fontFamily: font.regular,
    color: colors.tertiaryText,
    textAlign: 'center',
    lineHeight: 15,
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  legalLink: {
    fontSize: 11.5,
    fontFamily: font.medium,
    color: colors.tertiaryText,
    textDecorationLine: 'underline',
  },
  legalDivider: {
    fontSize: 11.5,
    color: colors.tertiaryText,
  },
  offerTitle: {
    fontSize: 30,
    fontFamily: font.bold,
    fontWeight: '700',
    letterSpacing: -0.7,
    lineHeight: 37,
    color: colors.ink,
    textAlign: 'center',
    marginTop: 16,
  },
  offerNote: {
    fontSize: 13.5,
    fontFamily: font.regular,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 19,
  },
  offerSignature: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: colors.ink,
    textAlign: 'center',
  },
  sheetRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withAlpha(colors.ink, 0.35),
  },
  sheetCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderCurve: 'continuous',
    paddingTop: 10,
    paddingHorizontal: layout.margin,
    paddingBottom: 40,
    gap: 12,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: withAlpha(colors.ink, 0.14),
  },
  sheetTitle: {
    fontSize: 24,
    fontFamily: font.bold,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 30,
    color: colors.ink,
    textAlign: 'center',
    marginTop: 8,
  },
  sheetSubtitle: {
    fontSize: 14,
    fontFamily: font.regular,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  sheetOptions: {
    gap: 10,
    marginTop: 6,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: layout.rowRadius,
    borderCurve: 'continuous',
    borderWidth: 2,
    borderColor: withAlpha(colors.ink, 0.1),
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  sheetOptionEmoji: {
    fontSize: 20,
  },
  sheetOptionLabel: {
    fontSize: 15.5,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: colors.ink,
  },
  sheetLater: {
    fontSize: 14.5,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: withAlpha(colors.ink, 0.5),
    textAlign: 'center',
    paddingVertical: 4,
  },
});
