# Shop. — Nua React Native Mobile App

<p align="center">
  <img src="https://img.shields.io/badge/Expo-SDK_57-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK 57" />
  <img src="https://img.shields.io/badge/React_Native-0.86-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native 0.86" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Strict" />
  <img src="https://img.shields.io/badge/Tests-7%2F7_Passed-brightgreen?style=for-the-badge&logo=jest&logoColor=white" alt="Jest 7/7 Passing" />
  <img src="https://img.shields.io/badge/State-Zustand_5-443e38?style=for-the-badge" alt="Zustand 5" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  A production-grade mobile commerce application built for the <strong>Nua React Native Take-Home Assignment</strong>.<br />
  Features infinite catalog pagination, race-condition-safe search, persistent cart state, exponential retry resilience, and an in-app offline WebView return policy.
</p>

<p align="center">
  <a href="#screenshots--demo">Screenshots</a> •
  <a href="#core-features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#engineering-decisions">Engineering Decisions</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#builds--artifacts">Builds & APK</a>
</p>

---

## Screenshots & Demo

| Product Catalog | Debounced Search | Product Details | Shopping Cart | Return Policy (WebView) |
| :---: | :---: | :---: | :---: | :---: |
| <img src="./assets/screenshots/product_list.png" width="180" alt="Product Catalog" /> | <img src="./assets/screenshots/search_results.png" width="180" alt="Debounced Search" /> | <img src="./assets/screenshots/product_details.png" width="180" alt="Product Details" /> | <img src="./assets/screenshots/cart.png" width="180" alt="Shopping Cart" /> | <img src="./assets/screenshots/return_policy.png" width="180" alt="Return Policy WebView" /> |

### 📹 Video Walkthrough
A complete end-to-end screen recording walkthrough is captured and available directly in the repository:
- **[assets/screenshots/app_demo.mp4](./assets/screenshots/app_demo.mp4)** *(Catalog scroll → Debounced search → Product details → Offline WebView → Cart management)*

---

## Core Features

- 🛍️ **Paginated Product Catalog**: Consumes the DummyJSON API with infinite scroll pagination (20 items/page), pull-to-refresh, skeleton feedback, and empty/error states.
- 🔍 **Debounced Search**: 300ms debounce with strict race-condition mitigation using monotonic request IDs and `AbortController`.
- 🏷️ **Product Details & Discount Calculations**: High-resolution image carousel, unit-tested discount price calculations, rating indicators, brand and inventory count.
- 🛒 **Persistent Shopping Cart**: Zustand 5 store backed by `@react-native-async-storage/async-storage` with quantity steppers (`- / +`), badge counter in the navigation header, item removal, and real-time subtotal calculation.
- 📄 **In-App Offline Return Policy (WebView)**: Embedded `react-native-webview` rendering a standalone HTML/CSS policy that loads with zero network latency and matches the application design system.
- 📊 **Telemetry & Analytics**: In-memory event dispatcher logging `product_viewed`, `add_to_cart`, `search_performed`, and `app_backgrounded` events with active screen context.
- 🔁 **Exponential Backoff**: Resilient retry logic with jitter guard, abort awareness, and automatic 4xx bypass.

---

## Architecture

The project adopts a domain-driven feature layout where screens, hooks, components, and services are grouped by domain:

```
src/
├── components/                  # Shared presentational views (SearchBar, StateViews: Loading, Empty, Error)
├── config/                      # Environment configuration with safe fallback defaults
│   └── env.ts
├── features/
│   ├── products/                # Product catalog & details domain
│   │   ├── components/          # ProductCard (memoized, accessible touch targets >= 44pt)
│   │   ├── hooks/               # useProducts (pagination, debounced search, monotonic ID)
│   │   ├── screens/             # ProductList, ProductDetails
│   │   ├── services/            # productsApi (HTTP client with retry adapter)
│   │   └── types.ts             # Contracts and DTOs
│   ├── cart/                    # Shopping cart domain
│   │   ├── screens/             # Cart screen with steppers and subtotal
│   │   ├── store.ts             # Zustand cart store with async storage persistence
│   │   └── types.ts             # Cart state contracts
│   └── webview/                 # In-app browser domain
│       ├── constants/           # Standalone offline Return Policy HTML string
│       └── screens/             # ReturnPolicy WebView screen
├── navigation/                  # React Navigation Native Stack router
│   └── AppNavigator.tsx
├── services/
│   ├── storage/                 # Safe AsyncStorage wrapper (catches disk errors)
│   └── analytics/               # Analytics event logger & AppState listener
├── theme/
│   └── tokens.ts                # Strict design system tokens (colors, 5 type scales, 5 spacing steps)
├── utils/
│   ├── price.ts                 # Discount calculation & currency formatting (unit tested)
│   └── retry.ts                 # Exponential backoff with AbortSignal cancellation (unit tested)
└── hooks/
    └── useDebounce.ts           # Debounce utility hook
```

---

## Engineering Decisions

### 1. State Management: Why Zustand?
Zustand 5 was selected over Redux and Context + useReducer for three reasons:
- **Zero Boilerplate**: Actions and state are colocated in a clean hook (`useCartStore`).
- **Granular Selectors**: Components subscribe only to the slice of state they consume (e.g. `useCartStore(s => s.items.length)`), preventing unnecessary re-renders across the tree.
- **Out-of-the-Box Persistence**: Native support for `persist` middleware backed by custom asynchronous storage adapters without needing external boilerplate like `redux-persist`.

### 2. Search Race Conditions: Problem & Solution
- **The Problem**: When typing quickly (e.g., `"p" → "pe" → "perfume"`), requests fire in rapid succession. Variable network latency may cause the response for `"p"` to resolve after `"perfume"`, overwriting the user's interface with stale results.
- **The Solution**:
  1. **Debounce (300ms)**: Suppresses intermediate keystroke queries.
  2. **AbortController**: Cancels previous active network requests immediately.
  3. **Monotonic Request ID (`fetchIdRef`)**: Each request assigns an incremental ID. When a response promise resolves, it checks `if (fetchId !== fetchIdRef.current) return;` to guarantee only the latest query updates state.
  4. **Automated Test**: Verified in `src/__tests__/searchRace.test.ts`.

### 3. In-App Offline Return Policy (No External Dependencies)
Rather than relying on third-party remote websites like Wikipedia (which require an active internet connection and can fail unexpectedly), the application renders a dedicated, self-contained offline document ([src/features/webview/constants/returnPolicyHtml.ts](./src/features/webview/constants/returnPolicyHtml.ts)) directly in the WebView via `source={{ html: RETURN_POLICY_HTML }}`:
- **Instant Load**: Zero network latency or spinners.
- **100% Offline Reliability**: Functions seamlessly even in airplane mode or with poor network conditions.
- **Visual Consistency**: Directly reflects the app's typography, dark ink text (`#37352f`), borders, and Notion-inspired design tokens.

### 4. Design System Tokens
All styling is strictly derived from single-source tokens in `src/theme/tokens.ts`:
- **Palette**: Dark ink (`#37352f`), subtle grays (`#787774`, `#9b9a97`), neutral backgrounds (`#ffffff`, `#f7f6f5`), and accent blue (`#2383e2`).
- **Typography Scale**: Strict 5-step scale (`11, 13, 15, 18, 22`).
- **Spacing**: Strict 5-step scale (`4, 8, 12, 16, 24`).
- **Touch Accessibility**: Every interactive element satisfies iOS/Android minimum touch targets (>= 44pt) via `minHeight` and `hitSlop`.

---

## Environment Variables

The project uses Expo's native environment variable system via `.env` (with documented template in `.env.example`):

| Variable | Default | Description |
| :--- | :--- | :--- |
| `EXPO_PUBLIC_API_BASE_URL` | `https://dummyjson.com` | Base URL for DummyJSON catalog and search endpoints |

To create your local configuration:
```bash
cp .env.example .env
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm or bun

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/test-task2.git
cd test-task2

# Install dependencies
npm install
```

### Development
```bash
# Start Metro bundler
npm start

# Run directly on iOS Simulator
npm run ios

# Run directly on Android Emulator
npm run android
```

---

## Testing & Quality Assurance

All suites pass 100% with strict TypeScript compliance:

```bash
# Run unit tests
npm test

# Run TypeScript typechecker
npm run typecheck

# Diagnose Expo configuration & dependencies
npx --yes expo-doctor

# Validate production bundle export
npx expo export --platform android
```

### Test Coverage Summary
- `src/__tests__/retry.test.ts`: Verifies exponential delay backoff, retry limits, 4xx non-retry bypass, and AbortSignal timer cleanup.
- `src/__tests__/price.test.ts`: Validates discount calculations, decimal precision, edge case percentages (0%, 100%), and currency formatting.
- `src/__tests__/searchRace.test.ts`: Tests monotonic fetch ID discard logic and prevents out-of-order network promise resolution from corrupting state.

---

## Builds & Artifacts

### 🤖 Android Standalone Release APK
A production release APK has been compiled:
- **Artifact Path**: [`android/app/build/outputs/apk/release/app-release.apk`](./android/app/build/outputs/apk/release/app-release.apk)
- **Install on Device or Emulator**:
  ```bash
  adb install -r android/app/build/outputs/apk/release/app-release.apk
  ```
- **Build from source**:
  ```bash
  cd android && ./gradlew assembleRelease
  ```

### 🍎 iOS Builds
- **Local Simulator**:
  ```bash
  npx expo run:ios
  ```
- **Production IPA (EAS Cloud)**:
  Physical `.ipa` distribution packages require active Apple Developer Team certificates:
  ```bash
  npx eas-cli build --platform ios --profile preview
  ```

---

## License

This project is open-source and available under the [MIT License](LICENSE).
