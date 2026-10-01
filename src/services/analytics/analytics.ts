import { AppState, AppStateStatus } from 'react-native';

type EventName =
  | 'product_viewed'
  | 'add_to_cart'
  | 'search_performed'
  | 'app_backgrounded';

type EventProps = {
  product_viewed: { productId: number; productName: string };
  add_to_cart: {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
  };
  search_performed: { query: string; resultCount: number };
  app_backgrounded: { screen: string };
};

const log: Array<{ event: EventName; props: Record<string, unknown>; ts: number }> = [];

export function track<E extends EventName>(event: E, props: EventProps[E]): void {
  const entry = { event, props: props as Record<string, unknown>, ts: Date.now() };
  log.push(entry);
  if (__DEV__) {
    console.log('[analytics]', event, props);
  }
}

export function getLog() {
  return log;
}

let currentScreen = 'unknown';

export function setCurrentScreen(screen: string): void {
  currentScreen = screen;
}

AppState.addEventListener('change', (next: AppStateStatus) => {
  if (next === 'background' || next === 'inactive') {
    track('app_backgrounded', { screen: currentScreen });
  }
});
