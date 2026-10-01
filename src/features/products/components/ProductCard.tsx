import React, { memo, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Product } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { discounted, formatPrice } from '../../../utils/price';
import { useCartStore } from '../../cart/store';
import { spacing, fontSize, fontWeight, radius, border, ThemeColors } from '../../../theme/tokens';
import { useTheme } from '../../../theme/useTheme';

interface Props {
  product: Product;
  onPress: () => void;
}

function ProductCard({ product, onPress }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const add = useCartStore((s) => s.add);
  const quantity = useCartStore(
    (s) => s.items.find((i) => i.id === product.id)?.quantity ?? 0,
  );
  const discountedPrice = discounted(product.price, product.discountPercentage);

  function handleAdd() {
    add({
      id: product.id,
      title: product.title,
      price: discountedPrice,
      discountPercentage: product.discountPercentage,
      thumbnail: product.thumbnail,
    });
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={product.title}
    >
      <Image
        source={{ uri: product.thumbnail }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <View>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(discountedPrice)}</Text>
          {product.discountPercentage > 0 && (
            <>
              <Text style={styles.original}>{formatPrice(product.price)}</Text>
              <Text style={styles.discount}>
                -{Math.round(product.discountPercentage)}%
              </Text>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color={colors.star} />
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, quantity > 0 && styles.addBtnSelected]}
            onPress={handleAdd}
            accessibilityLabel={quantity > 0 ? `In cart: ${quantity}` : 'Add to cart'}
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {quantity > 0 ? (
              <>
                <Ionicons name="checkmark" size={13} color={colors.text} style={styles.btnIcon} />
                <Text style={[styles.addBtnText, styles.addBtnTextSelected]}>
                  Added ({quantity})
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="add" size={13} color={colors.textInverse} style={styles.btnIcon} />
                <Text style={styles.addBtnText}>Add</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ProductCard);

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: radius.md,
      borderWidth: border.thin,
      borderColor: colors.border,
      marginHorizontal: spacing.base,
      marginVertical: spacing.xs,
      padding: spacing.md,
    },
    image: {
      width: 96,
      height: 96,
      borderRadius: radius.sm,
      backgroundColor: colors.bgTertiary,
    },
    info: {
      flex: 1,
      marginLeft: spacing.md,
      justifyContent: 'space-between',
    },
    category: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: spacing.xs,
    },
    title: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.text,
      lineHeight: 20,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    price: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text,
    },
    original: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.regular,
      color: colors.textTertiary,
      textDecorationLine: 'line-through',
    },
    discount: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
      color: colors.success,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.xs,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    rating: {
      fontSize: fontSize.sm,
      color: colors.text,
      fontWeight: fontWeight.medium,
    },
    addBtn: {
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      backgroundColor: colors.text,
      borderRadius: radius.sm,
      minHeight: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnIcon: {
      marginRight: 2,
    },
    addBtnSelected: {
      backgroundColor: colors.bgTertiary,
      borderWidth: border.thin,
      borderColor: colors.border,
    },
    addBtnText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
      color: colors.textInverse,
    },
    addBtnTextSelected: {
      color: colors.text,
    },
  });
}
