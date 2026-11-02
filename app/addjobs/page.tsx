"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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

const PIECES_PAR_DEFAUT = ["CV", "Photo d'identité"];
const LIEU_DEPOT_PAR_DEFAUT = "sieges";
const CONTACT_PAR_DEFAUT = "773 4545";

export default function PublierPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [userId, setUserId] = useState<string | null>(null);
  const [verification, setVerification] = useState(true);

  const [titre, setTitre] = useState("");
  const [societe, setSociete] = useState("");
  const [dateLimite, setDateLimite] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [lieuDepot, setLieuDepot] = useState(LIEU_DEPOT_PAR_DEFAUT);
  const [contact, setContact] = useState(CONTACT_PAR_DEFAUT);
  const [pieces, setPieces] = useState<string[]>(PIECES_PAR_DEFAUT);
  const [image, setImage] = useState<File | null>(null);
  const [apercu, setApercu] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Vérifie que l'utilisateur est connecté
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/signin");
        return;
      }
      setUserId(data.user.id);
      setVerification(false);
    });
  }, [supabase, router]);

  // Libère l'aperçu de l'image quand il change
  useEffect(() => {
    return () => {
      if (apercu) URL.revokeObjectURL(apercu);
    };
  }, [apercu]);

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
      setImage(null);
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

    setImage(fichier);
    setApercu(URL.createObjectURL(fichier));
  }

  function reinitialiser() {
    setTitre("");
    setSociete("");
    setDateLimite("");
    setAgeMin("");
    setAgeMax("");
    setLieuDepot(LIEU_DEPOT_PAR_DEFAUT);
    setContact(CONTACT_PAR_DEFAUT);
    setPieces(PIECES_PAR_DEFAUT);
    setImage(null);
    setApercu(null);
    setSuccess(false);
    setError(null);
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
    if (lieuDepot.trim().length < 2) {
      setError("Veuillez indiquer le lieu de dépôt des dossiers.");
      return;
    }
    if (contact.trim().length < 3) {
      setError("Veuillez indiquer une information de contact.");
      return;
    }

    // Date du jour calculée ici (au clic), pas pendant le rendu
    const aujourdhui = new Date().toISOString().slice(0, 10);
    if (dateLimite < aujourdhui) {
      setError("La date limite ne peut pas être dans le passé.");
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
    let cheminImage: string | null = null;

    try {
      let imageUrl: string | null = null;

      // 1. Envoi de l'image dans le dossier de l'utilisateur
      if (image) {
        const nomSur = image.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        cheminImage = `${userId}/${Date.now()}-${nomSur}`;

        const { error: uploadError } = await supabase.storage
          .from("offres")
          .upload(cheminImage, image, { contentType: image.type });

        if (uploadError) {
          cheminImage = null;
          throw new Error("L'envoi de l'image a échoué. Réessayez.");
        }

        imageUrl = supabase.storage.from("offres").getPublicUrl(cheminImage)
          .data.publicUrl;
      }

      // 2. Enregistrement de l'offre
      const { error: insertError } = await supabase.from("jobs").insert({
        titre: titre.trim(),
        societe: societe.trim(),
        date_limite: dateLimite,
        age_min: min,
        age_max: max,
        lieu_depot: lieuDepot.trim(),
        contact: contact.trim(),
        image_url: imageUrl,
        pieces_a_fournir: pieces,
      });

      if (insertError) {
        throw new Error("Impossible d'enregistrer l'offre. Réessayez.");
      }

      setSuccess(true);
    } catch (err) {
      // Si l'image est partie mais pas l'offre, on supprime l'image orpheline
      if (cheminImage) {
        await supabase.storage.from("offres").remove([cheminImage]);
      }
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

      <div className="flex flex-1 items-start justify-center px-4 py-12">
        <div className="w-full max-w-xl rounded-2xl bg-[#EEF2EF] p-8 text-[#0F3D3A] shadow-xl sm:p-10">
          {verification ? (
            <p role="status" className="text-center text-sm text-[#0F3D3A]/70">
              Vérification de votre session…
            </p>
          ) : success ? (
            <div role="status" className="text-center">
              <h1
                className={`${display.className} text-3xl font-extrabold tracking-tight`}
              >
                Offre publiée
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-[#0F3D3A]/70">
                Votre offre « {titre} » est maintenant en ligne.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={reinitialiser}
                  className="rounded-lg border border-[#0F3D3A]/30 px-5 py-3 font-medium transition hover:bg-[#0F3D3A]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F3D3A]"
                >
                  Publier une autre offre
                </button>
                <a
                  href="/myjobs"
                  className="rounded-lg bg-[#0F3D3A] px-5 py-3 font-medium text-white transition hover:bg-[#165552] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F3D3A]"
                >
                  Voir mes offres
                </a>
              </div>
            </div>
          ) : (
            <>
              <h1
                className={`${display.className} text-3xl font-extrabold tracking-tight`}
              >
                Publier une offre
              </h1>
              <p className="mt-2 text-sm text-[#0F3D3A]/70">
                Renseignez les informations de votre annonce.
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
                    placeholder="Ex. : Stagiaire en communication"
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
                    placeholder="Ex. : Actic Group"
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
                      placeholder="18"
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
                      placeholder="35"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lieu_depot"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Lieu de dépôt des dossiers
                  </label>
                  <input
                    id="lieu_depot"
                    type="text"
                    required
                    maxLength={200}
                    value={lieuDepot}
                    onChange={(e) => setLieuDepot(e.target.value)}
                    placeholder="Ex. : sieges"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Informations de contact
                  </label>
                  <input
                    id="contact"
                    type="text"
                    required
                    maxLength={200}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Téléphone ou e-mail"
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-xs text-[#0F3D3A]/60">
                    Un numéro de téléphone ou une adresse e-mail pour joindre
                    le recruteur.
                  </p>
                </div>

                <fieldset>
                  <legend className="mb-2 text-sm font-medium">
                    Pièces à fournir{" "}
                    <span className="font-normal text-[#0F3D3A]/60">
                      (cochez celles que le candidat doit envoyer)
                    </span>
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {PIECES_DISPONIBLES.map((piece) => (
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
                      (facultatif, JPG, PNG ou WebP, 5 Mo max)
                    </span>
                  </label>
                  <input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImage}
                    className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[#0F3D3A] file:px-4 file:py-2.5 file:font-medium file:text-white hover:file:bg-[#165552]"
                  />
                  {apercu && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={apercu}
                      alt="Aperçu de l'image sélectionnée"
                      className="mt-4 h-48 w-full rounded-lg object-cover"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#0F3D3A] px-4 py-3 font-medium text-white transition hover:bg-[#165552] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F3D3A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Publication en cours…" : "Publier l'offre"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}