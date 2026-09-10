import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PrimaryCTA } from '@/components/ui/primary-cta';
import { brand } from '@/constants/brand';
import { content } from '@/constants/content';
import { colors, font, layout } from '@/constants/theme';
import { runInBackground } from '@/lib/tasks';

import type { OfferPricing, PlanKey, StandardPricing } from './paywall-pricing';
import { PlanOption } from './plan-option';

function openUrl(url: string): void {
  void runInBackground(Linking.openURL(url));
}

function LegalRow({
  canDeleteAccount,
  onDeleteAccount,
}: {
  canDeleteAccount: boolean;
  onDeleteAccount: () => void;
}) {
  return (
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
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onDeleteAccount}>
            <Text style={styles.legalLink}>{content.paywall.deleteAccount}</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}

function PriceSection({
  standard,
  pricesFetching,
  onRetry,
  onSelectPlan,
}: {
  standard: StandardPricing;
  pricesFetching: boolean;
  onRetry: () => void;
  onSelectPlan: (plan: PlanKey) => void;
}) {
  if (standard.priceReady) {
    return (
      <View style={styles.planList}>
        <PlanOption
          title={content.paywall.planYearly}
          price={`${standard.yearlyPrice}${content.paywall.perYear}`}
          sub={`${standard.yearlyPerMonth}${content.paywall.perMonthShort}`}
          badge={
            standard.yearlySavings ? content.paywall.savingsBadge(standard.yearlySavings) : null
          }
          selected={standard.mainPlan === 'yearly'}
          onPress={() => onSelectPlan('yearly')}
        />
        {standard.monthlyAvailable ? (
          <PlanOption
            title={content.paywall.planMonthly}
            price={`${standard.monthlyPrice}${content.paywall.perMonth}`}
            selected={standard.mainPlan === 'monthly'}
            onPress={() => onSelectPlan('monthly')}
          />
        ) : null}
      </View>
    );
  }
  if (standard.priceFailed) {
    return (
      <View style={styles.priceErrorWrap}>
        <Text style={styles.priceCaption}>{content.paywall.priceError}</Text>
        <Pressable
          accessibilityRole="button"
          disabled={pricesFetching}
          hitSlop={8}
          onPress={onRetry}
        >
          <Text style={[styles.priceRetry, pricesFetching ? styles.priceRetryBusy : null]}>
            {content.paywall.priceRetry}
          </Text>
        </Pressable>
      </View>
    );
  }
  return <Text style={styles.priceCaption}>{content.paywall.priceLoading}</Text>;
}

export function MainFooter({
  standard,
  busy,
  pricesFetching,
  canDeleteAccount,
  onRetry,
  onSelectPlan,
  onBuy,
  onDeleteAccount,
}: {
  standard: StandardPricing;
  busy: boolean;
  pricesFetching: boolean;
  canDeleteAccount: boolean;
  onRetry: () => void;
  onSelectPlan: (plan: PlanKey) => void;
  onBuy: () => void;
  onDeleteAccount: () => void;
}) {
  const showTrial = standard.mainTrial && standard.priceReady;
  return (
    <View style={styles.footer}>
      <PriceSection
        standard={standard}
        pricesFetching={pricesFetching}
        onRetry={onRetry}
        onSelectPlan={onSelectPlan}
      />
      {showTrial ? (
        <View style={styles.checkRow}>
          <Icon name="checkmark" size={15} weight="bold" color={colors.ink} />
          <Text style={styles.checkText}>{content.paywall.noPayment}</Text>
        </View>
      ) : null}
      <PrimaryCTA
        title={showTrial ? content.paywall.ctaTrial : content.paywall.cta}
        enabled={!busy && standard.priceReady}
        onPress={onBuy}
      />
      {standard.priceReady ? (
        <Text style={styles.disclosure}>
          {standard.mainTrial
            ? content.paywall.trialTerms(standard.mainPrice, standard.mainPeriod)
            : content.paywall.billedTerms(standard.mainPrice, standard.mainPeriod)}
        </Text>
      ) : null}
      <LegalRow canDeleteAccount={canDeleteAccount} onDeleteAccount={onDeleteAccount} />
    </View>
  );
}

export function OfferFooter({
  standard,
  offer,
  busy,
  canDeleteAccount,
  onBuy,
  onDeleteAccount,
}: {
  standard: StandardPricing;
  offer: OfferPricing;
  busy: boolean;
  canDeleteAccount: boolean;
  onBuy: () => void;
  onDeleteAccount: () => void;
}) {
  return (
    <View style={styles.footer}>
      <View style={styles.planList}>
        <PlanOption
          title={content.paywall.planYearly}
          price={`${offer.offerYearlyPrice}${content.paywall.perYear}`}
          sub={
            offer.offerDiscount
              ? content.paywall.offer.wasPrice(standard.yearlyPrice)
              : `${offer.offerYearlyPerMonth}${content.paywall.perMonthShort}`
          }
          subStruck={Boolean(offer.offerDiscount)}
          badge={
            offer.offerDiscount ? content.paywall.offer.discountBadge(offer.offerDiscount) : null
          }
          selected
        />
      </View>
      <PrimaryCTA
        title={offer.offerTrial ? content.paywall.offer.ctaTrial : content.paywall.offer.cta}
        enabled={!busy && offer.offerReady}
        onPress={onBuy}
      />
      <View style={styles.checkRow}>
        <Icon name="checkmark" size={15} weight="bold" color={colors.ink} />
        <Text style={styles.checkText}>{content.paywall.offer.noCommitment}</Text>
      </View>
      {offer.offerReady ? (
        <Text style={styles.disclosure}>
          {offer.offerTrial
            ? content.paywall.trialTerms(offer.offerYearlyPrice, 'year')
            : content.paywall.billedTerms(offer.offerYearlyPrice, 'year')}
        </Text>
      ) : null}
      <LegalRow canDeleteAccount={canDeleteAccount} onDeleteAccount={onDeleteAccount} />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: layout.ctaMargin,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  planList: {
    gap: 10,
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
});
