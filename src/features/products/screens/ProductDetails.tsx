import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../types/navigation';
import { Product } from '../types';
import { fetchProduct } from '../services/productsApi';
import { LoadingState, ErrorState } from '../../../components/StateViews';
import { discounted, formatPrice } from '../../../utils/price';
import { useCartStore } from '../../cart/store';
import {
  spacing,
  fontSize,
  fontWeight,
  radius,
  border,
  ThemeColors,
} from '../../../theme/tokens';
import { useTheme } from '../../../theme/useTheme';
import {
  track,
  setCurrentScreen,
} from '../../../services/analytics/analytics';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const { width } = Dimensions.get('window');

export default function ProductDetails({ route, navigation }: Props) {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [imageIndex, setImageIndex] = useState(0);
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const add = useCartStore((s) => s.add);
  const quantity = useCartStore(
    (s) => s.items.find((i) => i.id === productId)?.quantity ?? 0,
  );

  useEffect(() => {
    setCurrentScreen('ProductDetails');
  }, []);

  const loadProduct = useCallback(() => {
    const ac = new AbortController();
    setLoading(true);
    setError(null);

    fetchProduct(productId, ac.signal)
      .then((p) => {
        setProduct(p);
        setLoading(false);
        track('product_viewed', { productId: p.id, productName: p.title });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError("Couldn't load product. Try again.");
        setLoading(false);
      });

    return () => ac.abort();
  }, [productId]);

  useEffect(() => {
    return loadProduct();
  }, [loadProduct]);

  if (loading) return <LoadingState />;
  if (error || !product)
    return <ErrorState message={error ?? 'Unknown error.'} onRetry={loadProduct} />;

  const { id, title, price, discountPercentage, thumbnail, description, brand, category, rating, stock } = product;
  const finalPrice = discounted(price, discountPercentage);

  function handleAdd() {
    add({
      id,
      title,
      price: finalPrice,
      discountPercentage,
      thumbnail,
    });
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {images.length === 1 ? (
          <Image source={{ uri: images[0] }} style={styles.singleImage} resizeMode="cover" />
        ) : (
          <View>
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, i) => `${item}-${i}`}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                setImageIndex(idx);
              }}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.carouselImage} resizeMode="cover" />
              )}
            />
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {imageIndex + 1} / {images.length}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.body}>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(finalPrice)}</Text>
            {product.discountPercentage > 0 && (
              <>
                <Text style={styles.original}>{formatPrice(product.price)}</Text>
                <Text style={styles.discount}>
                  -{Math.round(product.discountPercentage)}%
                </Text>
              </>
            )}
          </View>

          <View style={styles.meta}>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={colors.star} />
              <Text style={styles.metaItem}>{product.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaItem}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</Text>
            {product.brand && (
              <>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaItem}>{product.brand}</Text>
              </>
            )}
          </View>

          <Text style={styles.category}>{product.category}</Text>

          <View style={styles.divider} />

          <Text style={styles.description}>{product.description}</Text>

          <TouchableOpacity
            style={styles.returnLink}
            onPress={() => navigation.navigate('ReturnPolicy')}
            accessibilityRole="button"
          >
            <View style={styles.returnLinkRow}>
              <Text style={styles.returnLinkText}>View Return Policy</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.accent} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.addBtn,
            product.stock === 0 && styles.addBtnDisabled,
            quantity > 0 && styles.addBtnSelected,
          ]}
          onPress={handleAdd}
          disabled={product.stock === 0}
          accessibilityLabel="Add to cart"
          accessibilityRole="button"
        >
          {product.stock === 0 ? (
            <Text style={styles.addBtnText}>Out of Stock</Text>
          ) : quantity > 0 ? (
            <>
              <Ionicons name="checkmark" size={18} color={colors.text} style={styles.btnIcon} />
              <Text style={[styles.addBtnText, styles.addBtnTextSelected]}>
                Added to Cart ({quantity})
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="bag-add-outline" size={18} color={colors.textInverse} style={styles.btnIcon} />
              <Text style={styles.addBtnText}>Add to Cart</Text>
            </>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    scroll: {
      flex: 1,
    },
    singleImage: {
      width: '100%',
      height: 300,
      backgroundColor: colors.bgTertiary,
    },
    carouselImage: {
      width,
      height: 300,
      backgroundColor: colors.bgTertiary,
    },
    body: {
      padding: spacing.base,
    },
    title: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.semibold,
      color: colors.text,
      lineHeight: 28,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    price: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text,
    },
    original: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.regular,
      color: colors.textTertiary,
      textDecorationLine: 'line-through',
    },
    discount: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.success,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
      flexWrap: 'wrap',
      gap: spacing.xs,
    },
    metaItem: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    metaDot: {
      fontSize: fontSize.sm,
      color: colors.textTertiary,
    },
    category: {
      marginTop: spacing.xs,
      fontSize: fontSize.xs,
      color: colors.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    divider: {
      height: border.thin,
      backgroundColor: colors.border,
      marginVertical: spacing.base,
    },
    description: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.regular,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    returnLink: {
      marginTop: spacing.base,
      paddingVertical: spacing.sm,
    },
    returnLinkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    returnLinkText: {
      fontSize: fontSize.sm,
      color: colors.accent,
      fontWeight: fontWeight.medium,
    },
    footer: {
      padding: spacing.base,
      borderTopWidth: border.thin,
      borderTopColor: colors.border,
      backgroundColor: colors.bg,
    },
    addBtn: {
      flexDirection: 'row',
      backgroundColor: colors.text,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
      minHeight: 44,
      justifyContent: 'center',
    },
    btnIcon: {
      marginRight: spacing.xs,
    },
    addBtnDisabled: {
      backgroundColor: colors.bgTertiary,
    },
    addBtnSelected: {
      backgroundColor: colors.bgTertiary,
      borderWidth: border.thin,
      borderColor: colors.border,
    },
    addBtnText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.textInverse,
    },
    addBtnTextSelected: {
      color: colors.text,
    },
    imageCounter: {
      position: 'absolute',
      bottom: spacing.sm,
      right: spacing.base,
      backgroundColor: colors.text,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.sm,
    },
    imageCounterText: {
      fontSize: fontSize.xs,
      color: colors.textInverse,
      fontWeight: fontWeight.medium,
    },
  });
}
