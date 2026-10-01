import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { spacing, fontSize, fontWeight, radius, border, ThemeColors } from '../../../theme/tokens';
import { useTheme } from '../../../theme/useTheme';
import { setCurrentScreen } from '../../../services/analytics/analytics';
import { getReturnPolicyHtml } from '../constants/returnPolicyHtml';

type Props = NativeStackScreenProps<RootStackParamList, 'ReturnPolicy'>;

export default function ReturnPolicy({ navigation }: Props) {
  const webviewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    setCurrentScreen('ReturnPolicy');
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [canGoBack]);

  function retry() {
    setHasError(false);
    setLoading(true);
    webviewRef.current?.reload();
  }

  if (hasError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Couldn't load the page. Check your connection.</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={retry}
          accessibilityRole="button"
        >
          <Ionicons name="refresh-outline" size={16} color={colors.text} style={styles.retryIcon} />
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingBar}>
          <ActivityIndicator size="small" color={colors.textSecondary} />
        </View>
      )}
      <WebView
        ref={webviewRef}
        source={{ html: getReturnPolicyHtml(isDark) }}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={{ backgroundColor: colors.bg }}
        onNavigationStateChange={(nav) => setCanGoBack(nav.canGoBack)}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setHasError(true);
        }}
        onHttpError={(syntheticEvent) => {
          if (syntheticEvent.nativeEvent.statusCode >= 400) {
            setLoading(false);
            setHasError(true);
          }
        }}
      />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    loadingBar: {
      padding: spacing.sm,
      borderBottomWidth: border.thin,
      borderBottomColor: colors.border,
      alignItems: 'center',
      backgroundColor: colors.bg,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
      backgroundColor: colors.bg,
    },
    errorText: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    retryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.base,
      borderWidth: border.thin,
      borderColor: colors.border,
      borderRadius: radius.sm,
      minHeight: 44,
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
