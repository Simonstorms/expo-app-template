import { StyleSheet, Text, View } from 'react-native';

import { colors, layout, text } from '@/constants/theme';

export function TitleBlock({
  title,
  subtitle,
  highlight,
}: {
  title: string;
  subtitle?: string;
  highlight?: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={text.title}>{renderTitle(title, highlight)}</Text>
      {subtitle ? <Text style={text.subtitle}>{subtitle}</Text> : null}
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
});
