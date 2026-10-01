export const RETURN_POLICY_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Return Policy · Shop.</title>
  <meta name="description" content="Return and Refund Policy for Shop. mobile store application." />
  <style>
    :root {
      /* App Design Tokens from src/theme/tokens.ts */
      --bg: #ffffff;
      --bg-secondary: #f7f6f5;
      --bg-tertiary: #ebebea;
      --border: #e9e9e7;
      --border-focus: #b3b3b3;
      --text: #37352f;
      --text-secondary: #787774;
      --text-tertiary: #9b9a97;
      --text-inverse: #ffffff;
      --accent: #2383e2;
      --accent-light: #e7f0fc;
      --accent-dark: #1a6ab8;
      --radius-sm: 4px;
      --radius-md: 8px;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #191919;
        --bg-secondary: #121212;
        --bg-tertiary: #282828;
        --border: #2e2e2e;
        --border-focus: #555555;
        --text: #ebebeb;
        --text-secondary: #9b9a97;
        --text-tertiary: #706f6b;
        --text-inverse: #191919;
        --accent: #3b82f6;
        --accent-light: #1e293b;
        --accent-dark: #60a5fa;
      }
    }

    body.dark {
      --bg: #191919;
      --bg-secondary: #121212;
      --bg-tertiary: #282828;
      --border: #2e2e2e;
      --border-focus: #555555;
      --text: #ebebeb;
      --text-secondary: #9b9a97;
      --text-tertiary: #706f6b;
      --text-inverse: #191919;
      --accent: #3b82f6;
      --accent-light: #1e293b;
      --accent-dark: #60a5fa;
    }

    body.light {
      --bg: #ffffff;
      --bg-secondary: #f7f6f5;
      --bg-tertiary: #ebebea;
      --border: #e9e9e7;
      --border-focus: #b3b3b3;
      --text: #37352f;
      --text-secondary: #787774;
      --text-tertiary: #9b9a97;
      --text-inverse: #ffffff;
      --accent: #2383e2;
      --accent-light: #e7f0fc;
      --accent-dark: #1a6ab8;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-family);
      font-size: 15px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      padding: 0 16px 48px;
    }

    .wrapper {
      max-width: 680px;
      margin: 0 auto;
    }

    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 24px;
    }

    .brand-logo {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: var(--text);
    }

    .status-pill {
      font-size: 11px;
      font-weight: 500;
      padding: 2px 8px;
      background-color: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
    }

    .doc-header {
      margin-bottom: 24px;
    }

    h1 {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: var(--text);
      margin-bottom: 8px;
    }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 13px;
      color: var(--text-secondary);
      flex-wrap: wrap;
    }

    .callout {
      background-color: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 12px 16px;
      margin: 20px 0;
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .callout strong {
      color: var(--text);
    }

    .toc {
      background-color: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 16px;
      margin-bottom: 32px;
    }

    .toc-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-tertiary);
      margin-bottom: 8px;
    }

    .toc ol {
      padding-left: 20px;
      margin: 0;
    }

    .toc li {
      margin-bottom: 4px;
    }

    .toc a {
      color: var(--text);
      text-decoration: none;
      font-size: 13px;
      font-weight: 400;
      transition: color 0.15s ease;
    }

    .toc a:hover {
      color: var(--accent);
      text-decoration: underline;
    }

    section {
      margin-bottom: 28px;
    }

    h2 {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.2px;
      color: var(--text);
      margin-bottom: 8px;
    }

    p {
      color: var(--text);
      margin-bottom: 12px;
      font-size: 15px;
    }

    ul, ol {
      padding-left: 20px;
      margin-bottom: 12px;
    }

    li {
      margin-bottom: 6px;
      font-size: 15px;
      color: var(--text);
    }

    li strong {
      font-weight: 600;
    }

    .steps-list {
      list-style-type: decimal;
    }

    .info-card {
      background-color: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 14px 16px;
      margin: 12px 0;
    }

    .info-card p {
      font-size: 13px;
      color: var(--text-secondary);
      margin: 0;
    }

    .info-card strong {
      color: var(--text);
    }

    a.app-link {
      color: var(--accent);
      text-decoration: none;
      font-weight: 500;
    }

    a.app-link:hover {
      text-decoration: underline;
    }

    footer {
      border-top: 1px solid var(--border);
      padding-top: 20px;
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: var(--text-secondary);
      flex-wrap: wrap;
      gap: 8px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <header class="app-header">
      <span class="brand-logo">Shop.</span>
      <span class="status-pill">v1.0 · Policy</span>
    </header>

    <div class="doc-header">
      <h1>Return & Refund Policy</h1>
      <div class="meta-row">
        <span>Last updated: October 1, 2026</span>
        <span>·</span>
        <span>Standard 30-Day Window</span>
      </div>
    </div>

    <div class="callout">
      <strong>Simple Returns:</strong> We want you to be completely satisfied with your purchase. If you are not satisfied, you may return eligible items within 30 days of delivery for a full refund or exchange.
    </div>

    <nav class="toc" aria-label="Table of Contents">
      <div class="toc-title">Contents</div>
      <ol>
        <li><a href="#window">1. 30-Day Return Window</a></li>
        <li><a href="#eligibility">2. Eligibility & Item Condition</a></li>
        <li><a href="#process">3. How to Initiate a Return</a></li>
        <li><a href="#refunds">4. Refund Processing & Timing</a></li>
        <li><a href="#non-returnable">5. Non-Returnable Items</a></li>
        <li><a href="#support">6. Help & Customer Support</a></li>
      </ol>
    </nav>

    <main>
      <section id="window">
        <h2>1. 30-Day Return Window</h2>
        <p>
          You have <strong>30 calendar days</strong> from the date your order was marked as delivered to request a return. Requests submitted after the 30-day window cannot be accepted for refunds.
        </p>
      </section>

      <section id="eligibility">
        <h2>2. Eligibility & Item Condition</h2>
        <p>
          To qualify for a full refund, all returned items must satisfy the following criteria:
        </p>
        <ul>
          <li><strong>Unused & Unworn:</strong> Items must be in the exact same condition that you received them.</li>
          <li><strong>Original Packaging:</strong> Products must be inside original brand boxes, sleeves, or protective wrapping with all included inserts.</li>
          <li><strong>Tags Attached:</strong> Factory tags, seals, and barcodes must remain intact and untampered.</li>
          <li><strong>Proof of Purchase:</strong> You must provide the order confirmation email or digital receipt.</li>
        </ul>
      </section>

      <section id="process">
        <h2>3. How to Initiate a Return</h2>
        <p>
          Returning an item is quick and hassle-free:
        </p>
        <ol class="steps-list">
          <li><strong>Locate Your Order:</strong> Find your order receipt or digital order ID.</li>
          <li><strong>Contact Support:</strong> Email <a class="app-link" href="mailto:support@example.com">support@example.com</a> with your order number and the item(s) you wish to return.</li>
          <li><strong>Print Return Label:</strong> A prepaid return shipping label and packing slip will be provided via email.</li>
          <li><strong>Drop Off Package:</strong> Affix the label to the outer box and drop the parcel at any authorized courier location.</li>
        </ol>
      </section>

      <section id="refunds">
        <h2>4. Refund Processing & Timing</h2>
        <p>
          Once your return arrives at our fulfillment facility, our inspection team will review the item within <strong>2 business days</strong>.
        </p>
        <div class="info-card">
          <p>
            <strong>Payment Method:</strong> Approved refunds are credited directly back to the original method of payment. Banks typically post funds within <strong>5–7 business days</strong>.
          </p>
        </div>
      </section>

      <section id="non-returnable">
        <h2>5. Non-Returnable Items</h2>
        <p>
          For health, safety, and hygiene standards, certain items are non-refundable once opened:
        </p>
        <ul>
          <li>Opened personal care and beauty items (mascaras, lipsticks, fragrances).</li>
          <li>Perishable groceries or food products.</li>
          <li>Digital gift cards and downloadable software vouchers.</li>
        </ul>
      </section>

      <section id="support">
        <h2>6. Help & Customer Support</h2>
        <p>
          Have questions about an existing return or need assistance with a replacement?
        </p>
        <div class="info-card">
          <p>
            <strong>Customer Care:</strong> <a class="app-link" href="mailto:support@example.com">support@example.com</a><br />
            <strong>Hours:</strong> Monday – Friday, 9:00 AM – 6:00 PM EST<br />
            <strong>App:</strong> Shop. Mobile Client
          </p>
        </div>
      </section>
    </main>

    <footer>
      <span>&copy; 2026 Shop. · All rights reserved</span>
      <span>Offline standalone policy</span>
    </footer>
  </div>
</body>
</html>`;

export function getReturnPolicyHtml(isDark: boolean): string {
  const themeClass = isDark ? 'dark' : 'light';
  return RETURN_POLICY_HTML.replace('<body>', `<body class="${themeClass}">`);
}
