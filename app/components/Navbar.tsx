import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const liens = [
  { label: "Accueil", href: "/" },
  { label: "Liste des offres", href: "/jobs" },
  { label: "Mes offres", href: "/mes-offres" },
];

export default function Navbar() {
  return (
    <header className="flex w-full flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-10">
      <Link href="/" className={`${display.className} text-xl font-extrabold`}>
        Actic Jobs
      </Link>
      <nav
        aria-label="Navigation principale"
        className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
      >
        {liens.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="hover:underline focus-visible:underline"
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/signin"
          className="rounded-full bg-[#E8B84A] px-4 py-1.5 font-medium text-[#0F3D3A] hover:bg-[#f0c76a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Connexion
        </Link>
      </nav>
    </header>
  );
}