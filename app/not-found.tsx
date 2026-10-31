import Link from "next/link";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Navbar from "@/app/components/Navbar";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });

export default function CustomNotFound() {
  return (
    <main
      className={`${body.className} flex min-h-screen flex-col bg-black text-[#EEF2EF] antialiased`}
    >
      <Navbar />

      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
        <p
          className={`${display.className} text-[8rem] font-extrabold leading-none tracking-tight text-[#E8B84A] sm:text-[12rem]`}
        >
          404
        </p>

        <h1
          className={`${display.className} mt-4 text-3xl font-bold sm:text-4xl`}
        >
          Cette page est introuvable
        </h1>

        <p className="mt-4 max-w-md leading-relaxed text-[#EEF2EF]/70">
          Le lien est peut-être incorrect, ou la page a été déplacée. Retournez
          à l&apos;accueil ou parcourez les offres disponibles.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-[#E8B84A] px-6 py-3 font-medium text-[#0F3D3A] transition hover:bg-[#f0c76a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/jobs"
            className="rounded-full border border-[#EEF2EF]/30 px-6 py-3 font-medium transition hover:bg-[#EEF2EF]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8B84A]"
          >
            Voir les offres
          </Link>
        </div>
      </section>
    </main>
  );
}