"use client";

import { useState, type FormEvent } from "react";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Navbar from "@/app/components/Navbar";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });

const inputClass =
  "w-full rounded-lg border border-[#0F3D3A]/25 bg-white px-4 py-2.5 placeholder:text-[#0F3D3A]/40 focus:border-[#0F3D3A] focus:outline-none focus:ring-2 focus:ring-[#E8B84A]";

export default function InscriptionPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepte, setAccepte] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!accepte) {
      setError("Vous devez accepter les conditions d'utilisation.");
      return;
    }

    setLoading(true);
    try {
      // TODO : remplace par ton appel API ou ta fonction d'auth
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, password }),
      });

      if (!res.ok) {
        throw new Error("Impossible de créer le compte. Réessayez.");
      }

      window.location.href = "/signin";
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
            Créer un compte
          </h1>
          <p className="mt-2 text-sm text-[#0F3D3A]/70">
            Cela prend moins d&apos;une minute.
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
              <label htmlFor="nom" className="mb-1.5 block text-sm font-medium">
                Nom complet
              </label>
              <input
                id="nom"
                type="text"
                autoComplete="name"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Prénom Nom"
                className={inputClass}
              />
            </div>

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
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-24`}
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
              <p className="mt-1.5 text-xs text-[#0F3D3A]/60">
                8 caractères minimum.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="mb-1.5 block text-sm font-medium"
              >
                Confirmer le mot de passe
              </label>
              <input
                id="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
              />
            </div>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={accepte}
                onChange={(e) => setAccepte(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#0F3D3A]/40 accent-[#0F3D3A]"
              />
              <span>
                J&apos;accepte les{" "}
                <a href="/conditions" className="underline underline-offset-2">
                  conditions d&apos;utilisation
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#0F3D3A] px-4 py-3 font-medium text-white transition hover:bg-[#165552] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F3D3A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Création du compte…" : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#0F3D3A]/70">
            Déjà un compte ?{" "}
            <a
              href="/signin"
              className="font-medium text-[#0F3D3A] underline underline-offset-2"
            >
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}