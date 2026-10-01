import React, { useMemo } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, fontSize, fontWeight, radius, border, ThemeColors } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function LoadingState() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.textSecondary} />
    </View>
  );
}

export function EmptyState({ message }: { message: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.center}>
      <Ionicons
        name="cube-outline"
        size={36}
        color={colors.textTertiary}
        style={styles.emptyIcon}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
  accessibilityRole?: string;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.center}>
      <Ionicons
        name="alert-circle-outline"
        size={36}
        color={colors.error}
        style={styles.errorIcon}
      />
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry} accessibilityRole="button">
        <Ionicons name="refresh-outline" size={16} color={colors.text} style={styles.retryIcon} />
        <Text style={styles.retryText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
      backgroundColor: colors.bg,
    },
    emptyIcon: {
      marginBottom: spacing.sm,
    },
    errorIcon: {
      marginBottom: spacing.sm,
    },
    message: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.regular,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    retryBtn: {
      flexDirection: 'row',
      marginTop: spacing.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.base,
      borderWidth: border.thin,
      borderColor: colors.border,
      borderRadius: radius.sm,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    retryIcon: {
      marginRight: spacing.xs,
    },
    retryText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.text,
    },
  });
}
