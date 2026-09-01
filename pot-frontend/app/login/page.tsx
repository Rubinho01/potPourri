import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { LoginHeroBackground } from "@/components/login-hero-background";
import { SiteFooter } from "@/components/site-footer";
import { SiteTopBar } from "@/components/site-top-bar";

export const metadata: Metadata = {
  title: "Login | Pot-Pourri",
  description: "Acesse sua conta no brechó Pot-Pourri.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col overflow-x-hidden font-sans">
      <SiteTopBar />
      <main className="relative isolate flex min-h-[68vh] flex-1 items-center justify-center px-4 py-16 sm:min-h-[72vh] sm:py-20">
        <LoginHeroBackground />
        <LoginForm />
      </main>
      <SiteFooter />
    </div>
  );
}
