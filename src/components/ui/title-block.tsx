import { StyleSheet, Text, View } from 'react-native';

import { colors, font, layout, text } from '@/constants/theme';

export function TitleBlock({
  title,
  subtitle,
  highlight,
  align = 'left',
}: {
  title: string;
  subtitle?: string;
  highlight?: string;
  align?: 'left' | 'center';
}) {
  return (
    <View style={[styles.container, { alignItems: align === 'center' ? 'center' : 'flex-start' }]}>
      <Text style={[text.title, { textAlign: align }]}>{renderTitle(title, highlight)}</Text>
      {subtitle ? <Text style={[styles.subtitle, { textAlign: align }]}>{subtitle}</Text> : null}
    </View>
  );
}

function renderTitle(title: string, highlight?: string) {
  if (!highlight || !title.includes(highlight)) {
    return title;
  }
  const [before, ...rest] = title.split(highlight);
  const after = rest.join(highlight);
  return (
    <Text>
      {before}
      <Text style={{ color: colors.orange }}>{highlight}</Text>
      {after}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: layout.margin,
    paddingTop: 16,
    gap: 19,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: font.regular,
    fontWeight: '400',
    color: colors.ink,
    lineHeight: 23,
  },
});
