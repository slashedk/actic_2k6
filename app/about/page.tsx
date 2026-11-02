import Link from "next/link";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Navbar from "@/app/components/Navbar";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });

const chiffres = [
  { valeur: "18-35", libelle: "ans : le public visé par le programme D-CLIC" },
  { valeur: "2022-2026", libelle: "Stratégie de la Francophonie numérique" },
  { valeur: "100 %", libelle: "des offres publiées visibles par tous" },
];

const fonctionnalites = [
  {
    titre: "Recherche d'offres",
    texte:
      "Les candidats parcourent la liste des offres encore ouvertes et filtrent par titre ou par société.",
  },
  {
    titre: "Publication simple",
    texte:
      "Un recruteur connecté publie une annonce : titre, société, date limite, tranche d'âge, image et pièces à fournir.",
  },
  {
    titre: "Gestion de ses offres",
    texte:
      "Un tableau personnel permet de modifier ou de supprimer ses annonces, avec confirmation avant suppression.",
  },
  {
    titre: "Comptes sécurisés",
    texte:
      "Inscription, connexion et déconnexion, avec des règles d'accès qui limitent la modification d'une offre à son auteur.",
  },
];

const technologies = [
  { nom: "Next.js", role: "Framework React, routage et pages" },
  { nom: "TypeScript", role: "Code typé et plus fiable" },
  { nom: "Tailwind CSS", role: "Interface responsive et cohérente" },
  { nom: "Supabase", role: "Authentification, base de données et stockage" },
];

const competences = [
  "Concevoir une interface responsive et accessible",
  "Structurer une application avec Next.js et TypeScript",
  "Modéliser une base de données relationnelle",
  "Mettre en place l'authentification des utilisateurs",
  "Protéger les données avec des règles de sécurité par ligne",
  "Gérer l'envoi et le stockage de fichiers",
];

export default function AboutPage() {
  return (
    <main
      className={`${body.className} min-h-screen bg-black text-[#EEF2EF] antialiased`}
    >
      <Navbar />

      {/* En-tête */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-10 text-center sm:pt-16">
        <p className="text-sm font-medium uppercase tracking-wider text-[#E8B84A]">
          À propos
        </p>
        <h1
          className={`${display.className} mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl`}
        >
          Une application née d&apos;une formation,
          <span className="text-[#E8B84A]"> pensée pour l&apos;emploi.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#EEF2EF]/70">
          Actic Jobs a été réalisée durant la formation en développement web du
          projet D-CLIC de l&apos;Organisation internationale de la
          Francophonie. Elle met en relation celles et ceux qui cherchent un
          emploi avec celles et ceux qui recrutent.
        </p>
      </section>

      {/* Chiffres */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <ul className="grid gap-6 sm:grid-cols-3">
          {chiffres.map((c) => (
            <li
              key={c.valeur}
              className="rounded-2xl border border-[#EEF2EF]/15 p-6 text-center"
            >
              <p
                className={`${display.className} text-4xl font-extrabold text-[#E8B84A]`}
              >
                {c.valeur}
              </p>
              <p className="mt-2 text-sm text-[#EEF2EF]/70">{c.libelle}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Le programme D-CLIC */}
      <section className="border-t border-[#EEF2EF]/15">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-2">
          <div>
            <h2
              className={`${display.className} text-3xl font-bold sm:text-4xl`}
            >
              Le programme D-CLIC
            </h2>
            <p className="mt-4 leading-relaxed text-[#EEF2EF]/70">
              « D-CLIC, formez-vous au numérique avec l&apos;OIF » est une
              initiative de l&apos;Organisation internationale de la
              Francophonie. Elle propose des formations aux métiers du
              numérique aux jeunes francophones, avec une attention particulière
              aux femmes.
            </p>
            <a
              href="https://www.francophonie.org/dclic"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full border border-[#EEF2EF]/30 px-6 py-3 font-medium transition hover:bg-[#EEF2EF]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8B84A]"
            >
              Découvrir D-CLIC (nouvel onglet)
            </a>
          </div>
          <div className="space-y-5 leading-relaxed text-[#EEF2EF]/70">
            <p>
              L&apos;objectif est simple : renforcer les compétences numériques
              des jeunes, améliorer leurs qualifications et faciliter leur
              accès à l&apos;emploi, en entreprise comme dans
              l&apos;entrepreneuriat.
            </p>
            <p>
              Dans le parcours de développement web, les apprenants ne se
              contentent pas de suivre des cours : ils construisent un projet
              concret, de la conception à la mise en ligne. Actic Jobs est ce
              projet.
            </p>
          </div>
        </div>
      </section>

      {/* L'application */}
      <section className="border-t border-[#EEF2EF]/15 bg-[#EEF2EF] text-[#0F3D3A]">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2
            className={`${display.className} text-3xl font-bold sm:text-4xl`}
          >
            Ce que fait Actic Jobs
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-[#0F3D3A]/75">
            Un parcours complet, pensé pour être compris dès la première visite.
          </p>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {fonctionnalites.map((f, i) => (
              <li key={f.titre} className="rounded-2xl bg-white p-6">
                <span
                  className={`${display.className} text-3xl font-extrabold text-[#E8B84A]`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-medium">{f.titre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#0F3D3A]/75">
                  {f.texte}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Technologies */}
      <section className="border-t border-[#EEF2EF]/15">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2
            className={`${display.className} text-3xl font-bold sm:text-4xl`}
          >
            Les technologies utilisées
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {technologies.map((t) => (
              <li
                key={t.nom}
                className="rounded-2xl border border-[#EEF2EF]/15 p-6"
              >
                <p className={`${display.className} text-xl font-bold`}>
                  {t.nom}
                </p>
                <p className="mt-2 text-sm text-[#EEF2EF]/70">{t.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Compétences acquises */}
      <section className="border-t border-[#EEF2EF]/15">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-2">
          <div>
            <h2
              className={`${display.className} text-3xl font-bold sm:text-4xl`}
            >
              Ce que ce projet nous a appris
            </h2>
            <p className="mt-4 leading-relaxed text-[#EEF2EF]/70">
              Chaque fonctionnalité correspond à une compétence travaillée
              pendant la formation, appliquée à un besoin réel : aider des
              personnes à trouver une opportunité.
            </p>
          </div>
          <ul className="space-y-3">
            {competences.map((c) => (
              <li key={c} className="flex gap-3 leading-relaxed">
                <span
                  aria-hidden="true"
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#E8B84A]"
                />
                <span className="text-[#EEF2EF]/80">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="border-t border-[#EEF2EF]/15">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2
            className={`${display.className} text-3xl font-bold sm:text-5xl`}
          >
            Envie de l&apos;essayer ?
          </h2>
          <p className="mt-4 text-[#EEF2EF]/70">
            Parcourez les offres disponibles ou publiez la vôtre en quelques
            minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/jobs"
              className="rounded-full bg-[#E8B84A] px-8 py-3 font-medium text-[#0F3D3A] transition hover:bg-[#f0c76a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Voir les offres
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-[#EEF2EF]/30 px-8 py-3 font-medium transition hover:bg-[#EEF2EF]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8B84A]"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#EEF2EF]/15 py-8 text-center text-sm text-[#EEF2EF]/60">
        Projet réalisé dans le cadre de la formation en développement web D-CLIC
        de l&apos;OIF
      </footer>
    </main>
  );
}