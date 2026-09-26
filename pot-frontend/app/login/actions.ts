"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";

export interface LoginState {
  error?: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// Duram o mesmo tempo que os tokens no backend (ver pot-backend/.env
// JWT_EXPIRES_IN / JWT_REFRESH_EXPIRES_IN). Se mudar lá, mude aqui também.
const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutos
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Preencha email e senha." };
  }

  let tokens: LoginResponse;
  try {
    tokens = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "Erro inesperado ao tentar entrar. Tente novamente." };
  }

  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  cookieStore.set("pot_access_token", tokens.accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  cookieStore.set("pot_refresh_token", tokens.refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });

  redirect("/");
}
