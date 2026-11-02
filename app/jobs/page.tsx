"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Navbar from "@/app/components/Navbar";
import { createClient } from "@/lib/supabase/client";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });

type Offre = {
  id: string;
  titre: string;
  societe: string | null;
  date_limite: string;
  age_min: number | null;
  age_max: number | null;
  lieu_depot: string;
  contact: string;
  image_url: string | null;
  pieces_a_fournir: string[];
};

function formaterDate(iso: string) {
  const [annee, mois, jour] = iso.split("-");
  return `${jour}/${mois}/${annee}`;
}

function formaterAges(min: number | null, max: number | null) {
  if (min !== null && max !== null) return `${min} à ${max} ans`;
  if (min !== null) return `À partir de ${min} ans`;
  if (max !== null) return `Jusqu'à ${max} ans`;
  return "Tous âges";
}

// Transforme le contact en lien cliquable (e-mail ou téléphone) quand c'est possible
function lienContact(contact: string) {
  const valeur = contact.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur)) {
    return `mailto:${valeur}`;
  }
  const chiffres = valeur.replace(/[\s.()-]/g, "");
  if (/^\+?\d{6,15}$/.test(chiffres)) {
    return `tel:${chiffres}`;
  }
  return null;
}

function ListeOffres() {
  const params = useSearchParams();
  const [supabase] = useState(() => createClient());

  const [offres, setOffres] = useState<Offre[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [recherche, setRecherche] = useState(params.get("q") ?? "");

  useEffect(() => {
    async function charger() {
      // Date du jour calculée ici (dans le navigateur), pas pendant le rendu
      const aujourdhui = new Date().toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from("jobs")
        .select(
          "id, titre, societe, date_limite, age_min, age_max, lieu_depot, contact, image_url, pieces_a_fournir"
        )
        .gte("date_limite", aujourdhui)
        .order("created_at", { ascending: false });

      if (error) {
        setErreur("Impossible de charger les offres. Réessayez.");
      } else {
        setOffres(data ?? []);
      }
      setChargement(false);
    }

    charger();
  }, [supabase]);

  const offresFiltrees = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    if (!terme) return offres;
    return offres.filter(
      (o) =>
        o.titre.toLowerCase().includes(terme) ||
        (o.societe ?? "").toLowerCase().includes(terme)
    );
  }, [offres, recherche]);

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <h1
        className={`${display.className} text-3xl font-extrabold tracking-tight sm:text-4xl`}
      >
        Liste des offres
      </h1>
      <p className="mt-2 text-[#EEF2EF]/70">
        Toutes les offres encore ouvertes aux candidatures.
      </p>

      <div className="mt-8">
        <label htmlFor="recherche" className="sr-only">
          Rechercher une offre
        </label>
        <input
          id="recherche"
          type="search"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher par titre ou par société"
          className="w-full rounded-full border border-[#EEF2EF]/25 bg-transparent px-5 py-3 text-[#EEF2EF] placeholder:text-[#EEF2EF]/50 focus:border-[#E8B84A] focus:outline-none focus:ring-2 focus:ring-[#E8B84A]/40"
        />
      </div>

      {erreur && (
        <div
          role="alert"
          className="mt-8 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {erreur}
        </div>
      )}

      {chargement ? (
        <p role="status" className="mt-12 text-[#EEF2EF]/70">
          Chargement des offres…
        </p>
      ) : offresFiltrees.length === 0 && !erreur ? (
        <div className="mt-12 rounded-2xl border border-[#EEF2EF]/15 p-10 text-center">
          <p className="text-lg">
            {recherche.trim()
              ? "Aucune offre ne correspond à votre recherche."
              : "Aucune offre n'est disponible pour le moment."}
          </p>
          <Link
            href="/addjobs"
            className="mt-6 inline-block rounded-full bg-[#E8B84A] px-6 py-3 font-medium text-[#0F3D3A] transition hover:bg-[#f0c76a]"
          >
            Publier une offre
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-8 text-sm text-[#EEF2EF]/60" aria-live="polite">
            {offresFiltrees.length}{" "}
            {offresFiltrees.length > 1 ? "offres" : "offre"}
          </p>

          <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offresFiltrees.map((o) => {
              const lien = lienContact(o.contact ?? "");
              return (
                <li
                  key={o.id}
                  className="flex flex-col overflow-hidden rounded-2xl bg-[#EEF2EF] text-[#0F3D3A]"
                >
                  {o.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={o.image_url}
                      alt=""
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div
                      className="h-40 w-full bg-[#E8B84A]"
                      aria-hidden="true"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className={`${display.className} text-xl font-bold`}>
                      {o.titre}
                    </h2>

                    {o.societe && (
                      <p className="mt-1 text-sm font-medium text-[#165552]">
                        {o.societe}
                      </p>
                    )}

                    <p className="mt-3 text-sm text-[#0F3D3A]/75">
                      Date limite : {formaterDate(o.date_limite)}
                    </p>
                    <p className="mt-1 text-sm text-[#0F3D3A]/75">
                      {formaterAges(o.age_min, o.age_max)}
                    </p>

                    {o.pieces_a_fournir?.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-[#0F3D3A]/60">
                          Pièces à fournir
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {o.pieces_a_fournir.map((p) => (
                            <li
                              key={p}
                              className="rounded-full bg-[#0F3D3A]/10 px-3 py-1 text-xs font-medium"
                            >
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(o.lieu_depot || o.contact) && (
                      <div className="mt-auto border-t border-[#0F3D3A]/15 pt-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-[#0F3D3A]/60">
                          Déposer son dossier
                        </p>
                        <dl className="mt-2 space-y-1 text-sm">
                          {o.lieu_depot && (
                            <div className="flex gap-2">
                              <dt className="shrink-0 text-[#0F3D3A]/60">
                                Lieu :
                              </dt>
                              <dd className="font-medium">{o.lieu_depot}</dd>
                            </div>
                          )}
                          {o.contact && (
                            <div className="flex gap-2">
                              <dt className="shrink-0 text-[#0F3D3A]/60">
                                Contact :
                              </dt>
                              <dd className="font-medium">
                                {lien ? (
                                  <a
                                    href={lien}
                                    className="underline underline-offset-2 hover:text-[#165552] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0F3D3A]"
                                  >
                                    {o.contact}
                                  </a>
                                ) : (
                                  o.contact
                                )}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <main
      className={`${body.className} flex min-h-screen flex-col bg-black text-[#EEF2EF] antialiased`}
    >
      <Navbar />
      <Suspense
        fallback={
          <p role="status" className="px-6 py-10 text-[#EEF2EF]/70">
            Chargement…
          </p>
        }
      >
        <ListeOffres />
      </Suspense>
    </main>
  );
}