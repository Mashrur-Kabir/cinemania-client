"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
  ISubscriptionSummary,
  IBillingHistory,
  SubscriptionPlan,
} from "@/types/payment.types";

export const getSubscriptionSummary = async () =>
  httpClient.get<ISubscriptionSummary>("/payment/summary");

export const getBillingHistory = async () =>
  httpClient.get<IBillingHistory[]>("/payment/my-history");

/**
 * 💳 INITIATE PAYMENT
 * Returns the Stripe Checkout URL from the backend.
 */
export const initiatePayment = async (type: SubscriptionPlan) => {
  return httpClient.post<{ paymentUrl: string }>("/payment/initiate", { type });
};
