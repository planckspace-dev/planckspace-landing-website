/**
 * Pricing catalog — mirrors the backend's single source of truth
 * (planckspace-backend/src/lib/plans.ts). If a limit changes there,
 * change it here in the same commit.
 */

export interface Plan {
  id: "starter" | "pro" | "business" | "enterprise";
  name: string;
  tagline: string;
  /** Monthly price in USD. null = custom (contact sales). */
  priceUsdMonthly: number | null;
  maxUsers: number | null;
  trackedSpendUsdMonthly: number | null;
  trialDays: number;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For keeping an eye on costs from day one",
    priceUsdMonthly: 0,
    maxUsers: 3,
    trackedSpendUsdMonthly: 200,
    trialDays: 0,
    features: [
      "$200 of tracked AI spend / month",
      "3 users",
      "All supported AI coding tools",
      "CLI + VS Code extension",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For small startups starting to grow",
    priceUsdMonthly: 30,
    maxUsers: 5,
    trackedSpendUsdMonthly: 500,
    trialDays: 14,
    features: [
      "$500 of tracked AI spend / month",
      "5 users",
      "Cost insights & recommendations",
      "Invoice reconciliation",
      "Email support",
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "For growing companies beginning to scale",
    priceUsdMonthly: 200,
    maxUsers: 10,
    trackedSpendUsdMonthly: 2000,
    trialDays: 14,
    highlighted: true,
    features: [
      "$2,000 of tracked AI spend / month",
      "10 users",
      "Cost insights & recommendations",
      "Budgets & anomaly alerts",
      "Team-level attribution",
      "Email support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For organizations with more complex needs",
    priceUsdMonthly: null,
    maxUsers: null,
    trackedSpendUsdMonthly: null,
    trialDays: 0,
    features: [
      "Unlimited tracked AI spend",
      "Unlimited users",
      "Budgets & anomaly alerts",
      "Audit log & compliance controls",
      "Chargeback-ready exports",
      "Dedicated support",
    ],
  },
];

export const CONSOLE_URL = "https://console.planckspace.dev";
export const INSTALL_CMD = "curl -fsSL https://planckspace.dev/install | sh";
/** Public inbox shown on the site and used as the mailto fallback. */
export const CONTACT_EMAIL = "admin.planckspace@gmail.com";
