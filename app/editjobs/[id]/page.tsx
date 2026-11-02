"use client";

import { Suspense, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Navbar from "@/app/components/Navbar";
import { createClient } from "@/lib/supabase/client";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });

const inputClass =
  "w-full rounded-lg border border-[#0F3D3A]/25 bg-white px-4 py-2.5 placeholder:text-[#0F3D3A]/40 focus:border-[#0F3D3A] focus:outline-none focus:ring-2 focus:ring-[#E8B84A]";

const TYPES_IMAGE = ["image/jpeg", "image/png", "image/webp"];
const TAILLE_MAX = 5 * 1024 * 1024; // 5 Mo

const PIECES_DISPONIBLES = [
  "CV",
  "Photo d'identité",
  "Lettre de motivation",
  "Copie de la pièce d'identité",
  "Diplômes",
  "Extrait de casier judiciaire",
];

function cheminDepuisUrl(url: string | null) {
  if (!url) return null;
  const marqueur = "/offres/";
  const i = url.indexOf(marqueur);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marqueur.length).split("?")[0]);
}

function ModifierOffre() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [supabase] = useState(() => createClient());

  const [userId, setUserId] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);
  const [introuvable, setIntrouvable] = useState(false);

  const [titre, setTitre] = useState("");
  const [societe, setSociete] = useState("");
  const [dateLimite, setDateLimite] = useState("");
  const [dateOriginale, setDateOriginale] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [pieces, setPieces] = useState<string[]>([]);

  const [imageActuelle, setImageActuelle] = useState<string | null>(null);
  const [retirerImage, setRetirerImage] = useState(false);
  const [nouvelleImage, setNouvelleImage] = useState<File | null>(null);
  const [apercu, setApercu] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charge l'offre et vérifie que l'utilisateur en est l'auteur
  useEffect(() => {
    async function charger() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.replace("/signin");
        return;
      }
      setUserId(auth.user.id);

      const { data, error } = await supabase
        .from("jobs")
        .select(
          "id, user_id, titre, societe, date_limite, age_min, age_max, image_url, pieces_a_fournir"
        )
        .eq("id", id)
        .maybeSingle();

      if (error || !data || data.user_id !== auth.user.id) {
        setIntrouvable(true);
        setChargement(false);
        return;
      }

      setTitre(data.titre);
      setSociete(data.societe ?? "");
      setDateLimite(data.date_limite);
      setDateOriginale(data.date_limite);
      setAgeMin(data.age_min === null ? "" : String(data.age_min));
      setAgeMax(data.age_max === null ? "" : String(data.age_max));
      setPieces(data.pieces_a_fournir ?? []);
      setImageActuelle(data.image_url);
      setChargement(false);
    }

    charger();
  }, [supabase, router, id]);

  // Libère l'aperçu quand il change
  useEffect(() => {
    return () => {
      if (apercu) URL.revokeObjectURL(apercu);
    };
  }, [apercu]);

  // Pièces proposées : la liste standard + celles déjà présentes sur l'offre
  const piecesProposees = [
    ...PIECES_DISPONIBLES,
    ...pieces.filter((p) => !PIECES_DISPONIBLES.includes(p)),
  ];

  function basculerPiece(piece: string) {
    setPieces((actuelles) =>
      actuelles.includes(piece)
        ? actuelles.filter((p) => p !== piece)
        : [...actuelles, piece]
    );
  }

  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0] ?? null;
    setError(null);

    if (!fichier) {
      setNouvelleImage(null);
      setApercu(null);
      return;
    }
    if (!TYPES_IMAGE.includes(fichier.type)) {
      setError("L'image doit être au format JPG, PNG ou WebP.");
      e.target.value = "";
      return;
    }
    if (fichier.size > TAILLE_MAX) {
      setError("L'image ne doit pas dépasser 5 Mo.");
      e.target.value = "";
      return;
    }

    setNouvelleImage(fichier);
    setRetirerImage(false);
    setApercu(URL.createObjectURL(fichier));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!userId) return;

    if (titre.trim().length < 3) {
      setError("Le titre doit contenir au moins 3 caractères.");
      return;
    }
    if (societe.trim().length < 2) {
      setError("Veuillez indiquer le nom de la société.");
      return;
    }
    if (!dateLimite) {
      setError("Veuillez choisir une date limite.");
      return;
    }

    // On n'impose pas de date future si la date n'a pas été changée
    const aujourdhui = new Date().toISOString().slice(0, 10);
    if (dateLimite !== dateOriginale && dateLimite < aujourdhui) {
      setError("La nouvelle date limite ne peut pas être dans le passé.");
      return;
    }

    const min = ageMin === "" ? null : Number(ageMin);
    const max = ageMax === "" ? null : Number(ageMax);

    if ((min !== null && min < 0) || (max !== null && max < 0)) {
      setError("Les âges ne peuvent pas être négatifs.");
      return;
    }
    if (min !== null && max !== null && min > max) {
      setError("L'âge minimum ne peut pas dépasser l'âge maximum.");
      return;
    }

    setLoading(true);
    let nouveauChemin: string | null = null;

    try {
      let imageUrl: string | null = retirerImage ? null : imageActuelle;

      // 1. Envoi de la nouvelle image, si l'utilisateur en a choisi une
      if (nouvelleImage) {
        const nomSur = nouvelleImage.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        nouveauChemin = `${userId}/${Date.now()}-${nomSur}`;

        const { error: uploadError } = await supabase.storage
          .from("offres")
          .upload(nouveauChemin, nouvelleImage, {
            contentType: nouvelleImage.type,
          });

        if (uploadError) {
          nouveauChemin = null;
          throw new Error("L'envoi de l'image a échoué. Réessayez.");
        }

        imageUrl = supabase.storage
          .from("offres")
          .getPublicUrl(nouveauChemin).data.publicUrl;
      }

      // 2. Mise à jour de l'offre
      const { data, error: updateError } = await supabase
        .from("jobs")
        .update({
          titre: titre.trim(),
          societe: societe.trim(),
          date_limite: dateLimite,
          age_min: min,
          age_max: max,
          image_url: imageUrl,
          pieces_a_fournir: pieces,
        })
        .eq("id", id)
        .select("id");

      // Si aucune ligne n'est renvoyée, la mise à jour n'a pas eu lieu
      if (updateError || !data || data.length === 0) {
        throw new Error("Impossible d'enregistrer les modifications.");
      }

      // 3. Nettoyage : supprime l'ancienne image si elle a été remplacée ou retirée
      if (imageActuelle && imageUrl !== imageActuelle) {
        const ancien = cheminDepuisUrl(imageActuelle);
        if (ancien) {
          await supabase.storage.from("offres").remove([ancien]);
        }
      }

      router.push("/myjobs");
      router.refresh();
    } catch (err) {
      // Si la nouvelle image est partie mais pas la mise à jour, on la retire
      if (nouveauChemin) {
        await supabase.storage.from("offres").remove([nouveauChemin]);
      }
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  const imageAffichee = apercu ?? (retirerImage ? null : imageActuelle);

  return (
    <main
      className={`${body.className} flex min-h-screen flex-col bg-black text-[#EEF2EF] antialiased`}
    >
      <Navbar />

      <div className="flex flex-1 items-start justify-center px-4 py-12">
        <div className="w-full max-w-xl rounded-2xl bg-[#EEF2EF] p-8 text-[#0F3D3A] shadow-xl sm:p-10">
          {chargement ? (
            <p role="status" className="text-center text-sm text-[#0F3D3A]/70">
              Chargement de l&apos;offre…
            </p>
          ) : introuvable ? (
            <div className="text-center">
              <h1
                className={`${display.className} text-3xl font-extrabold tracking-tight`}
              >
                Offre introuvable
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-[#0F3D3A]/70">
                Cette offre n&apos;existe pas ou ne vous appartient pas.
              </p>
              <Link
                href="/myjobs"
                className="mt-8 inline-block rounded-lg bg-[#0F3D3A] px-6 py-3 font-medium text-white transition hover:bg-[#165552]"
              >
                Retour à mes offres
              </Link>
            </div>
          ) : (
            <>
              <h1
                className={`${display.className} text-3xl font-extrabold tracking-tight`}
              >
                Modifier l&apos;offre
              </h1>
              <p className="mt-2 text-sm text-[#0F3D3A]/70">
                Mettez à jour les informations de votre annonce.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
                noValidate
              >
                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
                  >
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="titre"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Titre de l&apos;offre
                  </label>
                  <input
                    id="titre"
                    type="text"
                    required
                    maxLength={120}
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="societe"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Société
                  </label>
                  <input
                    id="societe"
                    type="text"
                    required
                    maxLength={120}
                    autoComplete="organization"
                    value={societe}
                    onChange={(e) => setSociete(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="date_limite"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Date limite de candidature
                  </label>
                  <input
                    id="date_limite"
                    type="date"
                    required
                    value={dateLimite}
                    onChange={(e) => setDateLimite(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="age_min"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      Âge minimum{" "}
                      <span className="font-normal text-[#0F3D3A]/60">
                        (facultatif)
                      </span>
                    </label>
                    <input
                      id="age_min"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={120}
                      value={ageMin}
                      onChange={(e) => setAgeMin(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="age_max"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      Âge maximum{" "}
                      <span className="font-normal text-[#0F3D3A]/60">
                        (facultatif)
                      </span>
                    </label>
                    <input
                      id="age_max"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={120}
                      value={ageMax}
                      onChange={(e) => setAgeMax(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <fieldset>
                  <legend className="mb-2 text-sm font-medium">
                    Pièces à fournir
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {piecesProposees.map((piece) => (
                      <label
                        key={piece}
                        className="flex items-center gap-2 rounded-lg border border-[#0F3D3A]/20 bg-white px-3 py-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={pieces.includes(piece)}
                          onChange={() => basculerPiece(piece)}
                          className="h-4 w-4 rounded border-[#0F3D3A]/40 accent-[#0F3D3A]"
                        />
                        {piece}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label
                    htmlFor="image"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Image{" "}
                    <span className="font-normal text-[#0F3D3A]/60">
                      (JPG, PNG ou WebP, 5 Mo max)
                    </span>
                  </label>

                  {imageAffichee && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageAffichee}
                      alt="Image de l'offre"
                      className="mb-3 h-48 w-full rounded-lg object-cover"
                    />
                  )}

                  <input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImage}
                    className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[#0F3D3A] file:px-4 file:py-2.5 file:font-medium file:text-white hover:file:bg-[#165552]"
                  />

                  {imageActuelle && !nouvelleImage && (
                    <label className="mt-3 flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={retirerImage}
                        onChange={(e) => setRetirerImage(e.target.checked)}
                        className="h-4 w-4 rounded border-[#0F3D3A]/40 accent-[#0F3D3A]"
                      />
                      Retirer l&apos;image actuelle
                    </label>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Link
                    href="/myjobs"
                    className="rounded-lg border border-[#0F3D3A]/30 px-5 py-3 text-center font-medium transition hover:bg-[#0F3D3A]/10"
                  >
                    Annuler
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-[#0F3D3A] px-6 py-3 font-medium text-white transition hover:bg-[#165552] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F3D3A] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Enregistrement…" : "Enregistrer"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ModifierOffrePage() {
  return (
    <Suspense
      fallback={
        <main
          className={`${body.className} flex min-h-screen items-center justify-center bg-black text-[#EEF2EF] antialiased`}
        >
          <p role="status" className="text-sm text-[#EEF2EF]/70">
            Chargement…
          </p>
        </main>
      }
    >
      <ModifierOffre />
    </Suspense>
  );
}