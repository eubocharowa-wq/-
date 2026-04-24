import { View, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export function Divider() {
  return <View style={styles.line} />;
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
});
