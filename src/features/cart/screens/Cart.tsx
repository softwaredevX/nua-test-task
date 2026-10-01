import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../types/navigation';
import { useCartStore, cartSubtotal } from '../store';
import { CartItem } from '../types';
import { formatPrice } from '../../../utils/price';
import { EmptyState } from '../../../components/StateViews';
import {
  spacing,
  fontSize,
  fontWeight,
  radius,
  border,
  ThemeColors,
} from '../../../theme/tokens';
import { useTheme } from '../../../theme/useTheme';
import { setCurrentScreen } from '../../../services/analytics/analytics';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export default function Cart({ navigation }: Props) {
  const { items, hydrated, remove, increment, decrement, clear } = useCartStore();
  const subtotal = cartSubtotal(items);
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    setCurrentScreen('Cart');
  }, []);

  if (!hydrated) return null;

  function renderItem({ item }: { item: CartItem }) {
    return (
      <View style={styles.row}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumb}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => decrement(item.id)}
              accessibilityLabel="Decrease quantity"
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="remove" size={14} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => increment(item.id)}
              accessibilityLabel="Increase quantity"
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="add" size={14} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => remove(item.id)}
              accessibilityLabel="Remove item"
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function handleCheckout() {
    Alert.alert('Order Confirmed', 'Your order has been placed.', [
      { text: 'OK', onPress: () => clear() },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyState message="Your cart is empty." />}
        ListFooterComponent={
          items.length > 0 ? (
            <View style={styles.footer}>
              <View style={styles.subtotalRow}>
                <Text style={styles.subtotalLabel}>Subtotal</Text>
                <Text style={styles.subtotalValue}>{formatPrice(subtotal)}</Text>
              </View>
              <TouchableOpacity
                style={styles.buyBtn}
                onPress={handleCheckout}
                accessibilityRole="button"
                accessibilityLabel="Buy Now"
              >
                <Ionicons name="bag-check-outline" size={18} color={colors.textInverse} style={styles.buyBtnIcon} />
                <Text style={styles.buyBtnText}>Buy Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.policyLink}
                onPress={() => navigation.navigate('ReturnPolicy')}
                accessibilityRole="button"
              >
                <View style={styles.policyLinkRow}>
                  <Text style={styles.policyLinkText}>Return Policy</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.accent} />
                </View>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    row: {
      flexDirection: 'row',
      padding: spacing.base,
      borderBottomWidth: border.thin,
      borderBottomColor: colors.border,
    },
    thumb: {
      width: 72,
      height: 72,
      borderRadius: radius.sm,
      backgroundColor: colors.bgTertiary,
    },
    info: {
      flex: 1,
      marginLeft: spacing.md,
    },
    title: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text,
      lineHeight: 20,
    },
    price: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.text,
      marginTop: spacing.xs,
    },
    qtyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
      gap: spacing.sm,
    },
    qtyBtn: {
      width: 28,
      height: 28,
      borderWidth: border.thin,
      borderColor: colors.border,
      borderRadius: radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qtyBtnText: {
      fontSize: fontSize.md,
      color: colors.text,
      fontWeight: fontWeight.medium,
      lineHeight: 18,
    },
    qty: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text,
      minWidth: 20,
      textAlign: 'center',
    },
    removeBtn: {
      marginLeft: 'auto',
    },
    removeText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    footer: {
      padding: spacing.base,
      borderTopWidth: border.thin,
      borderTopColor: colors.border,
    },
    subtotalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    subtotalLabel: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text,
    },
    subtotalValue: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.text,
    },
    policyLink: {
      paddingVertical: spacing.sm,
      alignItems: 'center',
      minHeight: 44,
      justifyContent: 'center',
    },
    policyLinkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    policyLinkText: {
      fontSize: fontSize.sm,
      color: colors.accent,
      fontWeight: fontWeight.medium,
    },
    buyBtn: {
      flexDirection: 'row',
      backgroundColor: colors.text,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
      marginTop: spacing.sm,
      marginBottom: spacing.xs,
    },
    buyBtnIcon: {
      marginRight: spacing.xs,
    },
    buyBtnText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.textInverse,
    },
  });
}
