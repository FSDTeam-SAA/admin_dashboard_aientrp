import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: DefaultSession["user"] & {
      _id: string;
      role: "user" | "admin";
      isEmailVerified?: boolean;
    };
  }

  interface User {
    id: string;
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    accessToken: string;
    refreshToken: string;
    isEmailVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    user: {
      id: string;
      _id: string;
      name: string;
      email: string;
      role: "user" | "admin";
      isEmailVerified?: boolean;
    };
    error?: "RefreshAccessTokenError";
  }
}
