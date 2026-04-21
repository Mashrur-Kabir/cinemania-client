"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { TGenreFormValues } from "@/zod/genre.validation";

export interface IGenre {
  id: string;
  name: string;
}

export const createGenreAction = async (
  payload: TGenreFormValues,
): Promise<ApiResponse<IGenre>> => {
  return httpClient.post<IGenre>("/genre", payload);
};

export const updateGenreAction = async (
  id: string,
  payload: TGenreFormValues,
): Promise<ApiResponse<IGenre>> => {
  return httpClient.patch<IGenre>(`/genre/${id}`, payload);
};

export const deleteGenreAction = async (id: string) => {
  return httpClient.delete(`/genre/${id}`);
};

export const getAllGenres = async (): Promise<ApiResponse<IGenre[]>> => {
  return httpClient.get<IGenre[]>("/genre");
};
