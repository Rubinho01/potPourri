import { NewsletterForm } from "./newsletter-form";

const storeLinks = [
  "Blusas",
  "Bodys",
  "Camisetas",
  "Camisa",
  "Calças",
  "Vestidos",
  "Vestidos",
  "Acessórios",
  "Jeans",
  "Calça Jogger",
  "Moletons com Capuz",
  "Joias",
  "Cartão Presente",
];

const moreInfoLinks = [
  "About",
  "Contact Us",
  "Help & FAQ",
  "Returns Policy",
  "Submit a Return Request",
  "Shipping Info",
  "Technical & Privacy",
  "Mobile App",
  "Site Reviews",
  "Promotions",
  "Editorial",
  "Designers",
  "Influencers",
];

export function SiteFooter() {
  return (
    <footer className="w-full bg-pp-olive text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:px-10 lg:py-14">
        <section>
          <h2 className="mb-4 text-sm font-bold tracking-wide uppercase">
            NOSSA HISTÓRIA
          </h2>
          <p className="text-[13px] leading-relaxed text-white/90">
            Pot-Pourri é onde a descoberta encontra o estilo. Cada visita
            promete algo novo — uma peça única, um designer emergente, uma
            curadoria que você não encontrará em nenhum outro lugar.
          </p>
          <p className="mt-4 text-[13px] leading-relaxed text-white/90">
            Um brechó de moda com olhar atento ao que já viveu e ao que ainda
            pode brilhar. Peças selecionadas para quem busca originalidade sem
            abrir mão da elegância.
          </p>
          <p className="mt-5 text-[13px] leading-relaxed whitespace-pre-line">
            {"Com curadoria cuidadosa,\nPOT POURRI"}
          </p>
        </section>

        <nav aria-label="Loja online">
          <h2 className="mb-4 text-sm font-bold tracking-wide uppercase">
            LOJA ONLINE
          </h2>
          <ul className="space-y-1.5 text-[13px] text-white/90">
            {storeLinks.map((label, index) => (
              <li key={`${label}-${index}`}>
                <a
                  href="#"
                  className="transition-colors hover:text-white"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="More info">
          <h2 className="mb-4 text-sm font-bold tracking-wide uppercase">
            MORE INFO
          </h2>
          <ul className="space-y-1.5 text-[13px] text-white/90">
            {moreInfoLinks.map((label) => (
              <li key={label}>
                <a
                  href="#"
                  className="transition-colors hover:text-white"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section>
          <h2 className="mb-4 text-sm font-bold tracking-wide uppercase">
            DESBLOQUEIE 15% DE DESCONTO NO SEU PRIMEIRO PEDIDO
          </h2>
          <p className="text-[13px] leading-relaxed text-white/90">
            Inscreva-se na nossa newsletter e ganhe 15% de desconto no seu
            pedido. Seja o primeiro a saber sobre novos lançamentos, além de
            ter acesso VIP a coleções exclusivas, reposições, promoções e muito
            mais.
          </p>
          <NewsletterForm />
          <p className="mt-3 text-[10px] leading-relaxed text-white/70">
            Ao se inscrever na newsletter, você concorda com a nossa política de
            privacidade.
          </p>
        </section>
      </div>
    </footer>
  );
}
