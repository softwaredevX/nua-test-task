import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../types/navigation';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { SearchBar } from '../../../components/SearchBar';
import {
  LoadingState,
  EmptyState,
  ErrorState,
} from '../../../components/StateViews';
import { useDebounce } from '../../../hooks/useDebounce';
import { useCartStore } from '../../cart/store';
import { Product } from '../types';
import { spacing, fontSize, fontWeight, radius, border, ThemeColors } from '../../../theme/tokens';
import { useTheme } from '../../../theme/useTheme';
import { ThemeToggle } from '../../../theme/ThemeToggle';
import { setCurrentScreen } from '../../../services/analytics/analytics';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

export default function ProductList({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query.trim(), 300);
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { products, loading, loadingMore, refreshing, error, loadMore, refresh, total } =
    useProducts(debounced);

  const cartCount = useCartStore((s) =>
    s.items.reduce((n, i) => n + i.quantity, 0),
  );

  useEffect(() => {
    setCurrentScreen('ProductList');
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: Product) => String(item.id), []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />
      <View style={styles.header}>
        <Text style={styles.logo}>Shop.</Text>
        <View style={styles.headerActions}>
          <ThemeToggle />
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => navigation.navigate('Cart')}
            accessibilityLabel={`Cart, ${cartCount} items`}
            accessibilityRole="button"
          >
            <Ionicons name="bag-outline" size={22} color={colors.text} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchRow}>
        <SearchBar value={query} onChange={setQuery} />
      </View>
      {debounced.length > 0 && (
        <Text style={styles.resultCount}>
          {total} result{total !== 1 ? 's' : ''} for "{debounced}"
        </Text>
      )}

      {loading && products.length === 0 ? (
        <LoadingState />
      ) : error && products.length === 0 ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={products.length > 0 ? loadMore : null}
          onEndReachedThreshold={0.3}
          onRefresh={refresh}
          refreshing={refreshing}
          removeClippedSubviews={true}
          windowSize={10}
          ListEmptyComponent={
            <EmptyState
              message={debounced.length > 0 ? 'No products found.' : 'No products available.'}
            />
          }
          ListFooterComponent={
            loadingMore ? (
              <Text style={styles.loadingMore}>Loading…</Text>
            ) : null
          }
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgSecondary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.base,
      paddingTop: spacing.xs,
      paddingBottom: spacing.sm,
      backgroundColor: colors.bg,
      borderBottomWidth: border.thin,
      borderBottomColor: colors.border,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    logo: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text,
      letterSpacing: -0.5,
    },
    cartBtn: {
      minHeight: 44,
      minWidth: 44,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xs,
    },
    cartBadge: {
      position: 'absolute',
      top: 4,
      right: 0,
      backgroundColor: colors.accent,
      borderRadius: radius.md,
      minWidth: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 3,
    },
    cartBadgeText: {
      color: colors.badgeText,
      fontSize: 10,
      fontWeight: fontWeight.bold,
    },
    searchRow: {
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.sm,
      backgroundColor: colors.bg,
      borderBottomWidth: border.thin,
      borderBottomColor: colors.border,
    },
    resultCount: {
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.xs,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    list: {
      flex: 1,
      paddingTop: spacing.xs,
    },
    loadingMore: {
      textAlign: 'center',
      paddingVertical: spacing.base,
      fontSize: fontSize.sm,
      color: colors.textTertiary,
    },
  });
}
