"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IReview } from "@/types/review.types";
import { revalidatePath } from "next/cache";

export const getMyReviews = async () => httpClient.get<IReview[]>("/review"); // Assuming this returns user-specific reviews
