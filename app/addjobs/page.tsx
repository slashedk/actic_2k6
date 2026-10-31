import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });

const cafes = [
  {
    nom: "Brise du matin",
    origine: "Éthiopie, lavé",
    notes: "Fleur d’oranger, thé noir, citron confit",
    prix: "14 €",
    couleur: "bg-[#E8B84A]",
  },
  {
    nom: "Fond de cale",
    origine: "Brésil, naturel",
    notes: "Noisette grillée, cacao, caramel",
    prix: "12 €",
    couleur: "bg-[#C9573B]",
  },
  {
    nom: "Marée haute",
    origine: "Colombie, honey",
    notes: "Mangue, sucre roux, finale douce",
    prix: "15 €",
    couleur: "bg-[#7FB8A8]",
  },
];

export default function Accueil() {
  return (
    <main
      className={`${body.className} min-h-screen bg-[#0F3D3A] text-[#EEF2EF] antialiased`}
    >
      {/* Navigation */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className={`${display.className} text-xl font-extrabold`}>
          Torréfaction Marée
        </span>
        <nav className="flex gap-6 text-sm">
          <a href="#cafes" className="hover:underline focus-visible:underline">
            Nos cafés
          </a>
          <a
            href="#commande"
            className="rounded-full bg-[#E8B84A] px-4 py-1.5 font-medium text-[#0F3D3A] hover:bg-[#f0c76a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Commander
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-28">
        <h1
          className={`${display.className} max-w-4xl text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl md:text-8xl`}
        >
          Torréfié lundi, chez vous jeudi.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#EEF2EF]/80">
          Trois cafés de spécialité, torréfiés en petites quantités chaque
          semaine. Vous commandez, on torréfie, on expédie.
        </p>
        <a
          href="#cafes"
          className="mt-10 inline-block rounded-full bg-[#EEF2EF] px-7 py-3 font-medium text-[#0F3D3A] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8B84A]"
        >
          Voir les cafés de la semaine
        </a>
      </section>

      {/* Cafés */}
      <section id="cafes" className="bg-[#EEF2EF] text-[#0F3D3A]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2
            className={`${display.className} text-3xl font-bold sm:text-4xl`}
          >
            Les cafés de la semaine
          </h2>

          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {cafes.map((c) => (
              <li
                key={c.nom}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#0F3D3A]/15 bg-white"
              >
                <div className={`${c.couleur} h-40`} aria-hidden="true" />
                <div className="flex flex-1 flex-col p-6">
                  <h3
                    className={`${display.className} text-xl font-bold`}
                  >
                    {c.nom}
                  </h3>
                  <p className="mt-1 text-sm text-[#0F3D3A]/70">{c.origine}</p>
                  <p className="mt-4 flex-1 leading-relaxed">{c.notes}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-medium">{c.prix} / 250 g</span>
                    <button
                      type="button"
                      className="rounded-full bg-[#0F3D3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#165552] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F3D3A]"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Commande */}
      <section
        id="commande"
        className="mx-auto max-w-6xl px-6 py-24 text-center"
      >
        <h2
          className={`${display.className} mx-auto max-w-2xl text-3xl font-bold sm:text-5xl`}
        >
          Prévenez-moi à la prochaine torréfaction
        </h2>
        <form className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="email" className="sr-only">
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="vous@exemple.com"
            className="w-full rounded-full border border-[#EEF2EF]/30 bg-transparent px-5 py-3 placeholder:text-[#EEF2EF]/50 focus:border-[#E8B84A] focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-[#E8B84A] px-6 py-3 font-medium text-[#0F3D3A] hover:bg-[#f0c76a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            M’inscrire
          </button>
        </form>
      </section>

      <footer className="border-t border-[#EEF2EF]/15 py-8 text-center text-sm text-[#EEF2EF]/60">
        © {new Date().getFullYear()} Torréfaction Marée
      </footer>
    </main>
  );
}