"use client";

import type { FormEvent } from "react";

function UserIcon() {
  return (
    <span
      className="mb-8 flex size-14 items-center justify-center rounded-full border border-neutral-800/80 text-neutral-800"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 18.5c1.4-3 3.8-4.5 6.5-4.5s5.1 1.5 6.5 4.5" />
      </svg>
    </span>
  );
}

const fieldClassName =
  "h-11 w-[86%] rounded-[10px] bg-white px-4 text-center text-[11px] tracking-[0.16em] text-neutral-700 placeholder:uppercase placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-pp-olive/20";

export function LoginForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative z-20 flex w-[90%] max-w-[410px] flex-col items-center rounded-[18px] bg-pp-sage/55 px-6 py-10 shadow-[0_8px_30px_rgba(70,80,70,0.08)] backdrop-blur-md pointer-events-auto sm:px-8"
    >
      <UserIcon />

      <label htmlFor="login-email" className="sr-only">
        Email
      </label>
      <input
        id="login-email"
        name="email"
        type="email"
        placeholder="EMAIL"
        autoComplete="email"
        className={fieldClassName}
      />

      <label htmlFor="login-password" className="sr-only">
        Senha
      </label>
      <input
        id="login-password"
        name="password"
        type="password"
        placeholder="SENHA"
        autoComplete="current-password"
        className={`${fieldClassName} mt-4`}
      />

      <button
        type="submit"
        className="relative z-20 mt-7 h-10 w-[130px] cursor-pointer rounded-[10px] bg-white text-[11px] font-medium tracking-[0.18em] text-neutral-800 uppercase transition-colors hover:bg-pp-paper"
      >
        LOGIN
      </button>
    </form>
  );
}
