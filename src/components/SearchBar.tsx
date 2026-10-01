import React, { useCallback, useMemo } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, fontSize, fontWeight, radius, border, ThemeColors } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

interface Props {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search products…' }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const clear = useCallback(() => onChange(''), [onChange]);

  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={18}
        color={colors.textTertiary}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        returnKeyType="search"
        clearButtonMode="never"
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="Search products"
      />
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={clear}
          accessibilityLabel="Clear search"
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.bgSecondary,
      borderWidth: border.thin,
      borderColor: colors.border,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.sm,
      height: 44,
    },
    searchIcon: {
      marginRight: spacing.xs,
    },
    input: {
      flex: 1,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.regular,
      color: colors.text,
      paddingVertical: 0,
    },
    clearBtn: {
      paddingLeft: spacing.xs,
      height: 44,
      justifyContent: 'center',
    },
    clearText: {
      fontSize: fontSize.xs,
      color: colors.textTertiary,
    },
  });
}
