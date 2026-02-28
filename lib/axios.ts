"use client";

import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const rawBaseUrl =
  process.env.NEXTPUBLICBASEURL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:5000/api/v1";

const baseUrl = rawBaseUrl.replace(/\/$/, "");

export const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await signOut({ callbackUrl: "/login" });
    }

    return Promise.reject(error);
  },
);
