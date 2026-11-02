import Link from "next/link";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Navbar from "./components/Navbar";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });

const inputClass =
  "w-full rounded-full border border-[#EEF2EF]/25 bg-transparent px-5 py-3 text-[#EEF2EF] placeholder:text-[#EEF2EF]/50 focus:border-[#E8B84A] focus:outline-none focus:ring-2 focus:ring-[#E8B84A]/40";

const etapes = [
  {
    numero: "01",
    titre: "Créez votre compte",
    texte: "Inscrivez-vous gratuitement en moins d'une minute.",
  },
  {
    numero: "02",
    titre: "Cherchez ou publiez",
    texte:
      "Parcourez les offres disponibles, ou déposez la vôtre avec un titre, un lieu et une description.",
  },
  {
    numero: "03",
    titre: "Entrez en contact",
    texte: "Retrouvez et gérez vos offres depuis la page « Mes offres ».",
  },
];

export default function Page() {
  return (
    <main
      className={`${body.className} min-h-screen bg-black text-[#EEF2EF] antialiased`}
    >
      {/* Navigation */}
      <Navbar />

      {/* Hero + recherche */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-12 text-center sm:pt-20">
        <h1
          className={`${display.className} text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl`}
        >
          Trouvez l&apos;offre qui vous correspond.
          <span className="text-[#E8B84A]"> Ou publiez la vôtre.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#EEF2EF]/70">
          Actic Jobs met en relation celles et ceux qui cherchent un emploi
          avec celles et ceux qui recrutent.
        </p>

        <form
          action="/jobs"
          method="get"
          role="search"
          className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="q" className="sr-only">
            Métier ou mot-clé
          </label>
          <input
            id="q"
            name="q"
            type="search"
            placeholder="Métier ou mot-clé"
            className={inputClass}
          />
          <label htmlFor="lieu" className="sr-only">
            Lieu
          </label>
          <input
            id="lieu"
            name="lieu"
            type="text"
            placeholder="Lieu"
            className={inputClass}
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-[#E8B84A] px-8 py-3 font-medium text-[#0F3D3A] transition hover:bg-[#f0c76a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Rechercher
          </button>
        </form>
      </section>

      {/* Deux parcours */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl bg-[#EEF2EF] p-8 text-[#0F3D3A]">
            <p className="text-sm font-medium uppercase tracking-wider text-[#0F3D3A]/60">
              Je cherche un emploi
            </p>
            <h2
              className={`${display.className} mt-3 text-3xl font-bold`}
            >
              Parcourez toutes les offres
            </h2>
            <p className="mt-3 flex-1 leading-relaxed text-[#0F3D3A]/75">
              Consultez les annonces publiées, filtrez par métier ou par lieu
              et trouvez celle qui vous convient.
            </p>
            <Link
              href="/jobs"
              className="mt-8 inline-block self-start rounded-full bg-[#0F3D3A] px-6 py-3 font-medium text-white transition hover:bg-[#165552] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F3D3A]"
            >
              Voir les offres
            </Link>
          </div>

          <div className="flex flex-col rounded-2xl bg-[#E8B84A] p-8 text-[#0F3D3A]">
            <p className="text-sm font-medium uppercase tracking-wider text-[#0F3D3A]/70">
              Je recrute
            </p>
            <h2
              className={`${display.className} mt-3 text-3xl font-bold`}
            >
              Publiez votre offre
            </h2>
            <p className="mt-3 flex-1 leading-relaxed text-[#0F3D3A]/80">
              Décrivez le poste, indiquez le lieu et le type de contrat : votre
              annonce est visible tout de suite.
            </p>
            <Link
              href="/publier"
              className="mt-8 inline-block self-start rounded-full bg-[#0F3D3A] px-6 py-3 font-medium text-white transition hover:bg-[#165552] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F3D3A]"
            >
              Publier une offre
            </Link>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="border-t border-[#EEF2EF]/15">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2
            className={`${display.className} text-3xl font-bold sm:text-4xl`}
          >
            Comment ça marche
          </h2>

          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {etapes.map((e) => (
              <li key={e.numero}>
                <span
                  className={`${display.className} text-5xl font-extrabold text-[#E8B84A]`}
                >
                  {e.numero}
                </span>
                <h3 className="mt-4 text-lg font-medium">{e.titre}</h3>
                <p className="mt-2 leading-relaxed text-[#EEF2EF]/70">
                  {e.texte}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Appel final */}
      <section className="border-t border-[#EEF2EF]/15">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2
            className={`${display.className} text-3xl font-bold sm:text-5xl`}
          >
            Prêt à commencer ?
          </h2>
          <p className="mt-4 text-[#EEF2EF]/70">
            Créez votre compte gratuitement et accédez à toutes les
            fonctionnalités.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-full bg-[#E8B84A] px-8 py-3 font-medium text-[#0F3D3A] transition hover:bg-[#f0c76a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Créer un compte
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#EEF2EF]/15 py-8 text-center text-sm text-[#EEF2EF]/60">
        © 2026 Actic Jobs
      </footer>
    </main>
  );
}