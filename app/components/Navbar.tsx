"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bricolage_Grotesque } from "next/font/google";
import { createClient } from "@/lib/supabase/client";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const liens = [
  { label: "Accueil", href: "/", connecteSeulement: false },
  { label: "Liste des offres", href: "/jobs", connecteSeulement: false },
  { label: "Mes offres", href: "/myjobs", connecteSeulement: true },
  { label: "À propos", href: "/about", connecteSeulement: false },
];

const boutonClass =
  "rounded-full bg-[#E8B84A] px-4 py-1.5 font-medium text-[#0F3D3A] hover:bg-[#f0c76a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function Navbar() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  // null = vérification en cours, true = connecté, false = déconnecté
  const [connecte, setConnecte] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setConnecte(!!data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setConnecte(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleDeconnexion() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const liensVisibles = liens.filter((l) => !l.connecteSeulement || connecte);

  return (
    <header className="flex w-full flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-10">
      <Link href="/" className={`${display.className} text-xl font-extrabold`}>
        Actic Jobs
      </Link>
      <nav
        aria-label="Navigation principale"
        className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
      >
        {liensVisibles.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="hover:underline focus-visible:underline"
          >
            {l.label}
          </Link>
        ))}

        {connecte === null ? (
          <span aria-hidden="true" className={`${boutonClass} invisible`}>
            Déconnexion
          </span>
        ) : connecte ? (
          <button
            type="button"
            onClick={handleDeconnexion}
            className={boutonClass}
          >
            Déconnexion
          </button>
        ) : (
          <Link href="/signin" className={boutonClass}>
            Connexion
          </Link>
        )}
      </nav>
    </header>
  );
}