"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

// Retrouve le chemin du fichier dans le bucket à partir de son URL publique
function cheminDepuisUrl(url: string | null) {
  if (!url) return null;
  const marqueur = "/offres/";
  const i = url.indexOf(marqueur);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marqueur.length).split("?")[0]);
}

export default function MesOffresPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [offres, setOffres] = useState<Offre[]>([]);
  const [aujourdhui, setAujourdhui] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const [aSupprimer, setASupprimer] = useState<Offre | null>(null);
  const [suppression, setSuppression] = useState(false);

  useEffect(() => {
    async function charger() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.replace("/signin");
        return;
      }

      // Date du jour calculée dans le navigateur, pas pendant le rendu
      setAujourdhui(new Date().toISOString().slice(0, 10));

      const { data, error } = await supabase
        .from("jobs")
        .select(
          "id, titre, societe, date_limite, age_min, age_max, lieu_depot, contact, image_url, pieces_a_fournir"
        )
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setErreur("Impossible de charger vos offres. Réessayez.");
      } else {
        setOffres(data ?? []);
      }
      setChargement(false);
    }

    charger();
  }, [supabase, router]);

  // Ferme la fenêtre de confirmation avec la touche Échap
  useEffect(() => {
    if (!aSupprimer) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !suppression) setASupprimer(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aSupprimer, suppression]);

  async function supprimer() {
    if (!aSupprimer) return;
    setSuppression(true);
    setErreur(null);

    const { data, error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", aSupprimer.id)
      .select("id");

    if (error || !data || data.length === 0) {
      setErreur("La suppression a échoué. Réessayez.");
    } else {
      // Supprime aussi l'image associée du stockage
      const chemin = cheminDepuisUrl(aSupprimer.image_url);
      if (chemin) {
        await supabase.storage.from("offres").remove([chemin]);
      }
      setOffres((prev) => prev.filter((o) => o.id !== aSupprimer.id));
    }

    setASupprimer(null);
    setSuppression(false);
  }

  return (
    <main
      className={`${body.className} flex min-h-screen flex-col bg-black text-[#EEF2EF] antialiased`}
    >
      <Navbar />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1
            className={`${display.className} text-3xl font-extrabold tracking-tight sm:text-4xl`}
          >
            Mes offres
          </h1>
          <Link
            href="/addjobs"
            className="rounded-full bg-[#E8B84A] px-6 py-3 font-medium text-[#0F3D3A] transition hover:bg-[#f0c76a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            + Ajouter une offre
          </Link>
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
            Chargement de vos offres…
          </p>
        ) : offres.length === 0 && !erreur ? (
          <div className="mt-12 rounded-2xl border border-[#EEF2EF]/15 p-10 text-center">
            <p className="text-lg">Vous n&apos;avez publié aucune offre.</p>
            <p className="mt-2 text-sm text-[#EEF2EF]/70">
              Créez votre première annonce en quelques instants.
            </p>
            <Link
              href="/addjobs"
              className="mt-6 inline-block rounded-full bg-[#E8B84A] px-6 py-3 font-medium text-[#0F3D3A] transition hover:bg-[#f0c76a]"
            >
              Publier une offre
            </Link>
          </div>
        ) : (
          <div className="mt-10 overflow-x-auto rounded-2xl bg-[#EEF2EF] text-[#0F3D3A]">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <caption className="sr-only">
                Liste de vos offres publiées
              </caption>
              <thead className="border-b border-[#0F3D3A]/15 text-xs uppercase tracking-wider text-[#0F3D3A]/60">
                <tr>
                  <th scope="col" className="px-5 py-4 font-medium">
                    Offre
                  </th>
                  <th scope="col" className="px-5 py-4 font-medium">
                    Date limite
                  </th>
                  <th scope="col" className="px-5 py-4 font-medium">
                    Âges
                  </th>
                  <th scope="col" className="px-5 py-4 font-medium">
                    Lieu de dépôt
                  </th>
                  <th scope="col" className="px-5 py-4 font-medium">
                    Contact
                  </th>
                  <th scope="col" className="px-5 py-4 font-medium">
                    Pièces à fournir
                  </th>
                  <th scope="col" className="px-5 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0F3D3A]/10">
                {offres.map((o) => {
                  const expiree = aujourdhui !== "" && o.date_limite < aujourdhui;
                  return (
                    <tr key={o.id} className="align-top">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {o.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={o.image_url}
                              alt=""
                              className="h-12 w-12 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div
                              className="h-12 w-12 shrink-0 rounded-lg bg-[#E8B84A]"
                              aria-hidden="true"
                            />
                          )}
                          <div>
                            <p className="font-medium">{o.titre}</p>
                            {o.societe && (
                              <p className="text-[#165552]">{o.societe}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {formaterDate(o.date_limite)}
                        {expiree && (
                          <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                            Expirée
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {formaterAges(o.age_min, o.age_max)}
                      </td>
                      <td className="px-5 py-4">{o.lieu_depot || "—"}</td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {o.contact || "—"}
                      </td>
                      <td className="px-5 py-4">
                        {o.pieces_a_fournir?.length > 0 ? (
                          <ul className="flex flex-wrap gap-1.5">
                            {o.pieces_a_fournir.map((p) => (
                              <li
                                key={p}
                                className="rounded-full bg-[#0F3D3A]/10 px-2.5 py-0.5 text-xs font-medium"
                              >
                                {p}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-[#0F3D3A]/50">Aucune</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <Link
                          href={`/editjobs/${o.id}`}
                          className="rounded-lg border border-[#0F3D3A]/30 px-3 py-1.5 font-medium transition hover:bg-[#0F3D3A]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F3D3A]"
                        >
                          Modifier
                        </Link>
                        <button
                          type="button"
                          onClick={() => setASupprimer(o)}
                          className="ml-2 rounded-lg bg-red-700 px-3 py-1.5 font-medium text-white transition hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fenêtre de confirmation de suppression */}
      {aSupprimer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => !suppression && setASupprimer(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-confirmation"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-[#EEF2EF] p-8 text-[#0F3D3A] shadow-xl"
          >
            <h2
              id="titre-confirmation"
              className={`${display.className} text-2xl font-bold`}
            >
              Supprimer cette offre ?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#0F3D3A]/75">
              L&apos;offre « {aSupprimer.titre} » sera définitivement supprimée,
              avec son image. Cette action est irréversible.
            </p>
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setASupprimer(null)}
                disabled={suppression}
                className="rounded-lg border border-[#0F3D3A]/30 px-5 py-2.5 font-medium transition hover:bg-[#0F3D3A]/10 disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={supprimer}
                disabled={suppression}
                className="rounded-lg bg-red-700 px-5 py-2.5 font-medium text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {suppression ? "Suppression…" : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}