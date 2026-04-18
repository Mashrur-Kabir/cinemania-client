export type SubscriptionPlan = "BASIC" | "PRO" | "PREMIUM";

export interface ISubscriptionSummary {
  hasActiveSubscription: boolean;
  plan: SubscriptionPlan | null;
  expiryDate: string | null;
  daysRemaining: number;
}

export interface IBillingHistory {
  id: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
  subscription?: {
    type: SubscriptionPlan;
    endDate: string;
  };
}
