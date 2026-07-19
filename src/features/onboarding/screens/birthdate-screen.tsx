import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, View } from 'react-native';

import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { useOnboarding } from '../store';
import { colors, layout, text } from '@/constants/theme';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type WheelItem = { label: string; value: number };

const monthItems: WheelItem[] = monthNames.map((name, index) => ({ label: name, value: index + 1 }));

const dayItems: WheelItem[] = Array.from({ length: 31 }, (_, index) => ({
  label: String(index + 1),
  value: index + 1,
}));

const yearItems: WheelItem[] = Array.from({ length: 2012 - 1940 + 1 }, (_, index) => ({
  label: String(1940 + index),
  value: 1940 + index,
}));

export default function BirthdateScreen() {
  const birthMonth = useOnboarding((state) => state.birthMonth);
  const birthDay = useOnboarding((state) => state.birthDay);
  const birthYear = useOnboarding((state) => state.birthYear);
  const set = useOnboarding((state) => state.set);

  return (
    <OnboardingScaffold step="birthdate" ctaTitle="Continue">
      <View style={styles.container}>
        <TitleBlock title="When were you born?" />
        <Text style={styles.subtitle}>{'This will be used to calibrate your\ncustom plan.'}</Text>
        <View style={styles.spacer} />
        <View style={styles.wheels}>
          <WheelColumn
            label="Month"
            items={monthItems}
            selectedValue={birthMonth}
            onValueChange={(value) => set('birthMonth', value)}
          />
          <WheelColumn
            label="Day"
            items={dayItems}
            selectedValue={birthDay}
            onValueChange={(value) => set('birthDay', value)}
          />
          <WheelColumn
            label="Year"
            items={yearItems}
            selectedValue={birthYear}
            onValueChange={(value) => set('birthYear', value)}
          />
        </View>
        <View style={styles.spacer} />
      </View>
    </OnboardingScaffold>
  );
}

function WheelColumn({
  label,
  items,
  selectedValue,
  onValueChange,
}: {
  label: string;
  items: WheelItem[];
  selectedValue: number;
  onValueChange: (value: number) => void;
}) {
  return (
    <View style={styles.column}>
      <View style={styles.highlight} pointerEvents="none" />
      <Picker
        accessibilityLabel={label}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        itemStyle={styles.item}
        style={styles.picker}>
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 40,
  },
  subtitle: {
    ...text.subtitle,
    color: colors.secondaryText,
    paddingHorizontal: layout.margin,
    paddingTop: 19,
  },
  spacer: {
    flex: 1,
  },
  wheels: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 26.3,
  },
  column: {
    width: 91.7,
    height: 216,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 92,
    height: 32,
    borderRadius: 7,
    backgroundColor: '#F5F5F5',
  },
  picker: {
    width: 91.7,
    height: 216,
  },
  item: {
    fontSize: 17.5,
    color: '#383838',
  },
});
