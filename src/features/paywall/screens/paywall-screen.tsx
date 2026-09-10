import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';
import Animated, { FadeIn } from 'react-native-reanimated';

import { GlassIconButton } from '@/components/ui/glass-icon-button';
import { hasRevenueCat, hasSupabase } from '@/constants/config';
import { content } from '@/constants/content';
import { colors, font, layout, withAlpha } from '@/constants/theme';
import { deleteAccount } from '@/features/auth/api';
import { useSession } from '@/features/auth/hooks/use-session';
import { OnboardingScaffold } from '@/features/onboarding/components/onboarding-scaffold';
import { useFlow } from '@/features/onboarding/hooks/use-flow';
import { captureEvent, flushAnalytics, setPersonProperties } from '@/lib/analytics';
import { cancelTrialReminder, scheduleTrialReminder } from '@/lib/notifications';
import { attempt, runInBackground } from '@/lib/tasks';

import { getPaywallPackages, hasFreeTrial, purchaseProPackage, runRestore } from '../api';
import { AppPreview } from '../components/app-preview';
import { DeclineSheet } from '../components/decline-sheet';
import type { DeclineReason, SheetState } from '../components/decline-sheet';
import { MainFooter, OfferFooter } from '../components/paywall-footer';
import { deriveOfferPricing, deriveStandardPricing } from '../components/paywall-pricing';
import type { PlanKey } from '../components/paywall-pricing';
import { TrialCard } from '../components/trial-card';
import { useEntitlement } from '../hooks/use-entitlement';

type Placement = 'main' | 'offer' | 'reassure';
type PaywallView = 'main' | 'offer';

const CLOSE_DELAY_MS = 3500;
const TRIAL_REMINDER_DAYS_BEFORE_END = 2;

export type PaywallEntry = 'onboarding' | 'gate' | 'upsell';

function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <GlassIconButton
      icon="xmark"
      size={30}
      iconSize={13}
      iconColor={withAlpha(colors.ink, 0.55)}
      accessibilityLabel={content.paywall.decline.later}
      onPress={onPress}
    />
  );
}

function MainView({
  showClose,
  closeImmediately,
  restoring,
  showTrialCard,
  onClose,
  onRestore,
}: {
  showClose: boolean;
  closeImmediately: boolean;
  restoring: boolean;
  showTrialCard: boolean;
  onClose: () => void;
  onRestore: () => void;
}) {
  return (
    <Animated.View entering={FadeIn.duration(220)} style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          {showClose ? (
            <Animated.View
              entering={FadeIn.delay(closeImmediately ? 0 : CLOSE_DELAY_MS).duration(420)}
            >
              <CloseButton onPress={onClose} />
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
            style={restoring ? styles.restoreBusy : null}
          >
            <Text style={styles.restore}>{content.paywall.restore}</Text>
          </Pressable>
        </View>
        <Text style={styles.title}>{content.paywall.headline}</Text>
        {showTrialCard ? <TrialCard /> : null}
        <View style={styles.previewWrap}>
          <AppPreview />
        </View>
      </ScrollView>
    </Animated.View>
  );
}

function OfferView({ onClose }: { onClose: () => void }) {
  return (
    <Animated.View entering={FadeIn.duration(220)} style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <CloseButton onPress={onClose} />
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
  );
}

export default function PaywallScreen({ entry = 'onboarding' }: { entry?: PaywallEntry }) {
  const router = useRouter();
  const flow = useFlow('paywall');
  const { finish } = flow;
  const { isPro } = useEntitlement();
  const { user } = useSession();
  const [view, setView] = useState<PaywallView>('main');
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

  const standard = deriveStandardPricing(packages, plan, pricesPending);
  const offer = deriveOfferPricing(packages);
  const context = entry;
  const dismissible = entry === 'upsell';
  const showClose = dismissible || (entry === 'onboarding' && offer.hasOffer);
  const canDeleteAccount = hasSupabase && Boolean(user);

  const complete = () => {
    if (done.current) {
      return;
    }
    done.current = true;
    if (entry === 'upsell') {
      router.back();
      return;
    }
    if (entry === 'gate') {
      router.replace('/home');
      return;
    }
    void finish();
  };

  const dismiss = () => {
    if (!dismissible) {
      return;
    }
    router.back();
  };

  const selectPlan = (next: PlanKey) => {
    if (next === plan) {
      return;
    }
    setPlan(next);
    captureEvent('paywall_plan_selected', { plan: next, placement: 'main', context });
  };

  const openOffer = () => {
    setView('offer');
    captureEvent('paywall_offer_viewed', { context });
  };

  const closeSheet = () => setSheet('none');

  const onMainClose = () => {
    captureEvent('paywall_dismissed', { view: 'main', context });
    if (offer.hasOffer) {
      setSheet('reason');
      return;
    }
    dismiss();
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
    dismiss();
  };

  const onOfferClose = () => {
    captureEvent('paywall_dismissed', { view: 'offer', context });
    if (dismissible) {
      dismiss();
      return;
    }
    setView('main');
  };

  const buy = async (pkg: PurchasesPackage | null, placement: Placement) => {
    if (busy || restoring) {
      return;
    }
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
    captureEvent('purchase_started', { placement, plan: standard.mainPlan, ...productDetails });
    setBusy(true);
    const outcome = await purchaseProPackage(pkg);
    setBusy(false);
    captureEvent('paywall_purchase_result', {
      placement,
      plan: standard.mainPlan,
      outcome,
      ...productDetails,
    });
    if (outcome === 'purchased') {
      setPersonProperties({ is_pro: true, subscription_product: pkg.product.identifier });
      flushAnalytics();
      if (hasFreeTrial(pkg)) {
        void runInBackground(scheduleTrialReminder(TRIAL_REMINDER_DAYS_BEFORE_END));
      } else {
        void cancelTrialReminder();
      }
      complete();
      return;
    }
    flushAnalytics();
    if (outcome === 'cancelled') {
      if (placement === 'main' && offer.hasOffer) {
        openOffer();
      }
      return;
    }
    Alert.alert(content.paywall.purchaseErrorTitle, content.paywall.purchaseErrorBody);
  };

  const startReassureTrial = () => {
    setSheet('none');
    setPlan('yearly');
    void buy(standard.trialPkg, 'reassure');
  };

  const restore = async () => {
    if (restoring || busy) {
      return;
    }
    setRestoring(true);
    const outcome = await runRestore();
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
  };

  const deleteAccountAndRestart = async () => {
    captureEvent('account_deleted');
    flushAnalytics();
    if (await attempt(deleteAccount())) {
      router.replace('/');
      return;
    }
    Alert.alert(content.settings.deleteErrorTitle, content.settings.deleteErrorBody);
  };

  const confirmDeleteAccount = () => {
    Alert.alert(content.settings.deleteConfirmTitle, content.settings.deleteConfirmBody, [
      { text: content.settings.deleteConfirmCancel, style: 'cancel' },
      {
        text: content.settings.deleteConfirmAction,
        style: 'destructive',
        onPress: () => {
          void deleteAccountAndRestart();
        },
      },
    ]);
  };

  const footer =
    view === 'main' ? (
      <MainFooter
        standard={standard}
        busy={busy}
        pricesFetching={pricesFetching}
        canDeleteAccount={canDeleteAccount}
        onRetry={() => {
          void refetchPackages();
        }}
        onSelectPlan={selectPlan}
        onBuy={() => {
          void buy(standard.mainPkg, 'main');
        }}
        onDeleteAccount={confirmDeleteAccount}
      />
    ) : (
      <OfferFooter
        standard={standard}
        offer={offer}
        busy={busy}
        canDeleteAccount={canDeleteAccount}
        onBuy={() => {
          void buy(offer.offerPkg, 'offer');
        }}
        onDeleteAccount={confirmDeleteAccount}
      />
    );

  return (
    <OnboardingScaffold flow={flow} footer={footer}>
      {view === 'main' ? (
        <MainView
          key="main"
          showClose={showClose}
          closeImmediately={dismissible}
          restoring={restoring}
          showTrialCard={standard.mainTrial && standard.priceReady}
          onClose={onMainClose}
          onRestore={() => {
            void restore();
          }}
        />
      ) : (
        <OfferView key="offer" onClose={onOfferClose} />
      )}
      <DeclineSheet
        sheet={sheet}
        busy={busy}
        trialReady={standard.trialReady}
        yearlyPrice={standard.yearlyPrice}
        onClose={closeSheet}
        onChooseReason={chooseReason}
        onStartTrial={startReassureTrial}
      />
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
  restoreBusy: {
    opacity: 0.5,
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
  previewWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
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
});
