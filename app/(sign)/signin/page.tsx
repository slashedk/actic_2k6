"use client";

import { useState, type FormEvent } from "react";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Navbar from "@/app/components/Navbar";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // TODO : remplace par ton appel API ou ta fonction d'auth
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      if (!res.ok) {
        throw new Error("E-mail ou mot de passe incorrect.");
      }

      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className={`${body.className} flex min-h-screen flex-col bg-black text-[#EEF2EF] antialiased`}
    >
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-[#EEF2EF] p-8 text-[#0F3D3A] shadow-xl sm:p-10">
          <h1
            className={`${display.className} text-3xl font-extrabold tracking-tight`}
          >
            Content de vous revoir
          </h1>
          <p className="mt-2 text-sm text-[#0F3D3A]/70">
            Connectez-vous pour accéder à votre compte.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full rounded-lg border border-[#0F3D3A]/25 bg-white px-4 py-2.5 placeholder:text-[#0F3D3A]/40 focus:border-[#0F3D3A] focus:outline-none focus:ring-2 focus:ring-[#E8B84A]"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </label>
                <a
                  href="/mot-de-passe-oublie"
                  className="text-sm underline underline-offset-2 hover:text-[#165552]"
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#0F3D3A]/25 bg-white py-2.5 pl-4 pr-20 focus:border-[#0F3D3A] focus:outline-none focus:ring-2 focus:ring-[#E8B84A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-2 my-auto h-8 rounded-md px-3 text-sm font-medium text-[#0F3D3A]/70 hover:bg-[#0F3D3A]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0F3D3A]"
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-[#0F3D3A]/40 accent-[#0F3D3A]"
              />
              Rester connecté
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#0F3D3A] px-4 py-3 font-medium text-white transition hover:bg-[#165552] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F3D3A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Connexion en cours…" : "Se connecter"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#0F3D3A]/70">
            Pas encore de compte ?{" "}
            <a
              href="/signup"
              className="font-medium text-[#0F3D3A] underline underline-offset-2"
            >
              Créer un compte
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}