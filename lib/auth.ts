import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:5000/api/v1";

const baseUrl = rawBaseUrl.replace(/\/$/, "");

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: "user" | "admin";
      isEmailVerified?: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
};

type RefreshTokenResponse = {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

function getAccessTokenExpiry(accessToken: string) {
  const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString("utf8"));
  return payload.exp * 1000;
}

async function refreshAccessToken(token: {
  refreshToken: string;
}) {
  try {
    const response = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const refreshed = (await response.json()) as RefreshTokenResponse;

    if (!response.ok || !refreshed?.data?.accessToken) {
      throw new Error("Failed to refresh token");
    }

    return {
      accessToken: refreshed.data.accessToken,
      refreshToken: refreshed.data.refreshToken,
      accessTokenExpires: getAccessTokenExpiry(refreshed.data.accessToken),
    };
  } catch {
    return { error: "RefreshAccessTokenError" as const };
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const response = await fetch(`${baseUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const result = (await response.json()) as LoginResponse;

        if (!response.ok || !result?.data?.accessToken) {
          return null;
        }

        return {
          id: result.data.user._id,
          _id: result.data.user._id,
          name: result.data.user.name,
          email: result.data.user.email,
          role: result.data.user.role,
          isEmailVerified: result.data.user.isEmailVerified,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        };
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = getAccessTokenExpiry(user.accessToken);
        return token;
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      const refreshed = await refreshAccessToken({
        refreshToken: token.refreshToken,
      });

      if ("error" in refreshed) {
        token.error = refreshed.error;
        return token;
      }

      token.accessToken = refreshed.accessToken;
      token.refreshToken = refreshed.refreshToken;
      token.accessTokenExpires = refreshed.accessTokenExpires;

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user = {
        ...session.user,
        _id: token.user._id,
        role: token.user.role,
        name: token.user.name,
        email: token.user.email,
        isEmailVerified: token.user.isEmailVerified,
      };

      return session;
    },
  },
};
