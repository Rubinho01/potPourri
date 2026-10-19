import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pot-Pourri | Moda circular",
  description: "Pot-Pourri — descubra peças únicas, looks e vendedores da moda circular.",
};
export default function RootLayout({ children }: {children:ReactNode}) {
  return <html lang="pt-BR"><body className="flex min-h-screen flex-col antialiased">{children}</body></html>;
}
