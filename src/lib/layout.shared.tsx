import Link from "next/link";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Logo } from "@/components/ui/logo";
import { DEMO_PATH } from "@/lib/plans";

/** Options shared by the docs layouts: the lockup, a way back to the site, and the demo. */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2.5">
          <Logo height={19} />
          <span className="rounded-md border border-fd-border px-1.5 py-0.5 text-[0.72rem] font-medium tracking-[-0.01em] text-fd-muted-foreground">
            Docs
          </span>
        </span>
      ),
      url: "/docs",
    },
    themeSwitch: { enabled: false },
    links: [
      { text: "Website", url: "/", active: "none" },
      {
        type: "custom",
        on: "nav",
        secondary: true,
        children: (
          <Link
            href={DEMO_PATH}
            className="inline-flex h-8 items-center rounded-full bg-fd-foreground px-3.5 text-[0.8125rem] font-medium text-fd-background transition-opacity hover:opacity-85"
          >
            Book a demo
          </Link>
        ),
      },
    ],
  };
}
