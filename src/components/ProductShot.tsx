import Image from "next/image";
import overview from "../../assets/product-shots/02-overview-panel.png";

/* ─────────────────────────────────────────────────────────────────────────
   The hero product shot: a real capture of the Overview screen, framed in
   the site's own browser chrome. Dimensions come from the static import, and
   it is marked priority — this is the LCP element.
   ───────────────────────────────────────────────────────────────────────── */

export default function ProductShot() {
  return (
    <div className="bezel">
      <div className="bezel-core">
        {/* browser chrome */}
        <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--panel)] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f26d5f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f5bd4f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#59c76f]" />
          <div className="num mx-auto flex h-6 w-full max-w-sm items-center justify-center rounded-md border border-[var(--border)] bg-white text-[10.5px] text-[var(--text-3)]">
            console.planckspace.dev/overview
          </div>
        </div>

        <Image
          src={overview}
          alt="The PlanckSpace Overview dashboard: usage value, cost per shipped session, shipped rate and session count for the last 30 days, alongside a spend-over-time chart and $594 per month of recoverable waste."
          priority
          sizes="(min-width: 1280px) 1152px, 100vw"
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
