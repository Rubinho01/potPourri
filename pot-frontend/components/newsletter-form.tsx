"use client";

import type { FormEvent } from "react";

export function NewsletterForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      className="mt-5 flex w-full max-w-sm flex-col gap-2 sm:flex-row sm:items-stretch"
      onSubmit={handleSubmit}
      noValidate
    >
      <label htmlFor="newsletter-email" className="sr-only">
        E-mail para newsletter
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        placeholder="E-mail"
        autoComplete="email"
        className="h-10 min-w-0 flex-1 rounded-md bg-white px-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/40"
      />
      <button
        type="submit"
        className="h-10 shrink-0 rounded-md bg-white px-4 text-xs font-semibold tracking-wide text-neutral-800 uppercase transition-colors hover:bg-pp-mist"
      >
        INSCREVER-SE
      </button>
    </form>
  );
}
