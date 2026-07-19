import { Picker } from '@react-native-picker/picker';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';

import { GlassSurface } from '@/components/ui/glass';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { useOnboarding } from '../store';
import { colors, text } from '@/constants/theme';

const wheelValues = Array.from({ length: 40 }, (_, index) => index + 1);

const toggleSpring = { mass: 1, stiffness: 386, damping: 32 };

export default function HabitsScreen() {
  const snusType = useOnboarding((state) => state.snusType);
  const yearsOfUse = useOnboarding((state) => state.yearsOfUse);
  const pouchesPerDay = useOnboarding((state) => state.pouchesPerDay);
  const set = useOnboarding((state) => state.set);

  return (
    <OnboardingScaffold step="habits" ctaTitle="Continue">
      <View style={styles.container}>
        <TitleBlock
          title="Your snus habits"
          subtitle="This will be used to calibrate your custom plan."
        />
        <View style={styles.topSpacer} />
        <TypeToggle
          isLoose={snusType === 'loose'}
          onToggle={() => set('snusType', snusType === 'loose' ? 'pouches' : 'loose')}
        />
        <View style={styles.headers}>
          <Text style={[text.row, styles.headerYears]}>Years of use</Text>
          <Text style={[text.row, styles.headerPerDay]}>Per day</Text>
        </View>
        <View style={styles.wheels}>
          <Picker<number>
            selectedValue={yearsOfUse}
            onValueChange={(value) => set('yearsOfUse', value)}
            itemStyle={styles.pickerItem}
            style={styles.pickerYears}>
            {wheelValues.map((value) => (
              <Picker.Item
                key={value}
                label={value === 1 ? '1 year' : `${value} years`}
                value={value}
              />
            ))}
          </Picker>
          <Picker<number>
            selectedValue={pouchesPerDay}
            onValueChange={(value) => set('pouchesPerDay', value)}
            itemStyle={styles.pickerItem}
            style={styles.pickerPerDay}>
            {wheelValues.map((value) => (
              <Picker.Item key={value} label={`${value}`} value={value} />
            ))}
          </Picker>
        </View>
        <View style={styles.bottomSpacer} />
      </View>
    </OnboardingScaffold>
  );
}

function TypeToggle({ isLoose, onToggle }: { isLoose: boolean; onToggle: () => void }) {
  const progress = useDerivedValue(() => withSpring(isLoose ? 1 : 0, toggleSpring));

  const pouchesStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [colors.ink, '#D6D6D6']),
  }));
  const looseStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ['#D6D6D6', colors.ink]),
  }));
  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -10 + progress.value * 20 }],
  }));
  const borderStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));

  return (
    <Pressable style={styles.toggle} onPress={onToggle}>
      <Animated.Text style={[styles.toggleLabel, styles.pouchesLabel, pouchesStyle]}>
        Pouches
      </Animated.Text>
      <GlassSurface
        radius={15.5}
        tintColor={isLoose ? colors.ink : '#E9E9E9'}
        isInteractive
        style={styles.capsule}>
        <Animated.View style={[styles.knob, knobStyle]} />
        <Animated.View style={[styles.capsuleBorder, borderStyle]} />
      </GlassSurface>
      <Animated.Text style={[styles.toggleLabel, styles.looseLabel, looseStyle]}>
        Loose
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSpacer: {
    flex: 1,
    minHeight: 24,
    maxHeight: 105,
  },
  bottomSpacer: {
    flex: 1,
    minHeight: 24,
  },
  toggle: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 22,
    fontWeight: '600',
  },
  pouchesLabel: {
    marginRight: 28,
  },
  looseLabel: {
    marginLeft: 26,
  },
  capsule: {
    width: 51,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  knob: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: colors.white,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 3.5,
    shadowOffset: { width: 0, height: 1 },
  },
  capsuleBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 15.5,
    borderWidth: 0.5,
    borderColor: '#D5D5D5',
  },
  headers: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 27,
    paddingTop: 25,
  },
  headerYears: {
    width: 149,
    textAlign: 'center',
  },
  headerPerDay: {
    width: 150,
    textAlign: 'center',
  },
  wheels: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 27,
    paddingTop: 14,
  },
  pickerYears: {
    width: 149,
    height: 195,
  },
  pickerPerDay: {
    width: 150,
    height: 195,
  },
  pickerItem: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2E2E2E',
  },
});
