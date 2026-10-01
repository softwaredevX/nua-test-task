import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ProductList from '../features/products/screens/ProductList';
import ProductDetails from '../features/products/screens/ProductDetails';
import Cart from '../features/cart/screens/Cart';
import ReturnPolicy from '../features/webview/screens/ReturnPolicy';
import { fontWeight, fontSize } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { colors, isDark } = useTheme();

  const theme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.accent,
      background: colors.bg,
      card: colors.bg,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: fontWeight.semibold,
            fontSize: fontSize.md,
            color: colors.text,
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen
          name="ProductList"
          component={ProductList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{ title: 'Product Details' }}
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{ title: 'Cart' }}
        />
        <Stack.Screen
          name="ReturnPolicy"
          component={ReturnPolicy}
          options={{ title: 'Return Policy' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
