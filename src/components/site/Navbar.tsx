"use client";

import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ArrowRight, BadgeCheck, BookOpen, Boxes, ChevronDown, FileCode2, Radar, Scale, ShieldCheck, SquareTerminal, Wand2, X } from "lucide-react";
import { AnthropicLogo, ClaudeLogo, CursorLogo, OpenAILogo, WindsurfLogo } from "@/components/brand/ToolLogos";
import Button from "@/components/site/Button";
import { Logo } from "@/components/ui/logo";
import { DEMO_PATH } from "@/lib/plans";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   The bar: lockup, two menus (the product's four moves, and the reading),
   Docs and Contact as plain links, and one action. Transparent over the
   hero; paper with a hairline once the page moves. On phones the same links
   open in a full-screen sheet (a Radix dialog: focus trapped, Escape closes).
   ───────────────────────────────────────────────────────────────────────── */

type Icon = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

const PRODUCT: { icon: Icon; title: string; body: string; href: string }[] = [
  { icon: Scale, title: "Measure", body: "Every seat and API key in one ledger, billed kept apart from usage value.", href: "/#measure" },
  { icon: Radar, title: "Find", body: "Idle seats, oversized plans, premium models on routine work, cold caches.", href: "/#find" },
  { icon: Wand2, title: "Fix", body: "One click in the editor, with Undo. Seat changes wait for an approval.", href: "/#fix" },
  { icon: BadgeCheck, title: "Prove", body: "Savings booked from real sessions after the fix, never forecast.", href: "/#prove" },
];

const TOOLS: { name: string; Logo: Icon }[] = [
  { name: "Claude Code", Logo: ClaudeLogo },
  { name: "Cursor", Logo: CursorLogo },
  { name: "Windsurf", Logo: WindsurfLogo },
  { name: "Anthropic API", Logo: AnthropicLogo },
  { name: "OpenAI API", Logo: OpenAILogo },
  { name: "Amazon Bedrock", Logo: Boxes },
];

const RESOURCES: { icon: Icon; title: string; body: string; href: string }[] = [
  { icon: BookOpen, title: "Documentation", body: "Concepts, guides and reference.", href: "/docs" },
  { icon: SquareTerminal, title: "Quickstart", body: "One command to your first number.", href: "/docs/quickstart" },
  { icon: ShieldCheck, title: "Security", body: "What leaves a machine, and what never does.", href: "/docs/security/overview" },
  { icon: FileCode2, title: "CLI reference", body: "Every planck command and flag.", href: "/docs/reference/cli" },
];

const triggerCls =
  "group inline-flex h-9 items-center gap-1 rounded-full px-3.5 text-[0.9rem] font-medium tracking-[-0.01em] text-body outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-brand-500 data-[state=open]:text-ink";

function MenuItem({ icon: I, title, body, href }: { icon: Icon; title: string; body: string; href: string }) {
  return (
    <NavigationMenu.Link asChild>
      <Link href={href} className="group/item flex gap-3.5 rounded-[14px] p-3 transition-colors hover:bg-band focus-visible:bg-band">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-line bg-surface text-ink shadow-[var(--shadow-flat)] transition-colors group-hover/item:text-brand-600">
          <I className="h-[17px] w-[17px]" strokeWidth={1.7} />
        </span>
        <span>
          <span className="block text-[0.9rem] font-medium tracking-[-0.01em] text-ink">{title}</span>
          <span className="mt-0.5 block text-[0.8125rem] leading-snug text-muted">{body}</span>
        </span>
      </Link>
    </NavigationMenu.Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // the sheet is for phones; widening past it closes it
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  return (
    <header className={cn("nav-root", scrolled && "is-scrolled", open && "is-open")}>
      <div className="wrap flex h-[var(--nav-h)] items-center justify-between gap-6">
        <Link href="/" aria-label="PlanckSpace, home" className="-m-2 rounded-lg p-2">
          <Logo height={21} />
        </Link>

        <NavigationMenu.Root delayDuration={60} className="relative hidden flex-1 justify-center lg:flex">
          <NavigationMenu.List className="flex items-center gap-0.5">
            <NavigationMenu.Item>
              <NavigationMenu.Trigger className={triggerCls}>
                Product
                <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" strokeWidth={2} aria-hidden />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="w-[46rem] p-3">
                <div className="grid grid-cols-[minmax(0,1fr)_14rem] gap-3">
                  <div className="grid grid-cols-2 gap-1">
                    {PRODUCT.map((p) => (
                      <MenuItem key={p.title} {...p} />
                    ))}
                  </div>
                  <div className="rounded-[14px] bg-band p-4">
                    <p className="eyebrow">Works with</p>
                    <ul className="mt-3 space-y-2">
                      {TOOLS.map(({ name, Logo: L }) => (
                        <li key={name} className="flex items-center gap-2.5 text-[0.8125rem] text-body">
                          <L className="h-3.5 w-3.5 text-ink" strokeWidth={1.7} />
                          {name}
                        </li>
                      ))}
                    </ul>
                    <NavigationMenu.Link asChild>
                      <Link href="/docs/quickstart" className="link-arrow mt-4 text-[0.8125rem]">
                        Setup guide <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                      </Link>
                    </NavigationMenu.Link>
                  </div>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Trigger className={triggerCls}>
                Resources
                <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" strokeWidth={2} aria-hidden />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="w-[30rem] p-3">
                <div className="grid grid-cols-2 gap-1">
                  {RESOURCES.map((r) => (
                    <MenuItem key={r.title} {...r} />
                  ))}
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link href="/docs" className={triggerCls}>
                  Docs
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link href="/contact" className={triggerCls}>
                  Contact
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>

          <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
            <NavigationMenu.Viewport className="nav-viewport" />
          </div>
        </NavigationMenu.Root>

        <div className="flex items-center gap-1.5">
          <Button href={DEMO_PATH} size="sm" className="hidden sm:inline-flex">
            Book a demo
          </Button>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button type="button" className="nav-burger lg:hidden" aria-label="Open menu">
                <span className="flex w-[18px] flex-col gap-[5px]" aria-hidden>
                  <span className="h-[1.5px] rounded-full bg-current" />
                  <span className="h-[1.5px] rounded-full bg-current" />
                </span>
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content className="sheet fixed inset-0 z-[var(--z-modal)] flex flex-col overflow-y-auto bg-page" aria-describedby={undefined}>
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <div className="wrap flex h-[var(--nav-h)] shrink-0 items-center justify-between">
                  <Link href="/" onClick={() => setOpen(false)} aria-label="PlanckSpace, home">
                    <Logo height={21} />
                  </Link>
                  <Dialog.Close asChild>
                    <button type="button" className="nav-burger" aria-label="Close menu">
                      <X className="h-5 w-5" strokeWidth={1.7} />
                    </button>
                  </Dialog.Close>
                </div>

                <nav className="wrap flex-1 pb-10 pt-4" aria-label="Main">
                  <p className="eyebrow">Product</p>
                  <ul className="mt-3 border-t border-line">
                    {PRODUCT.map((p) => (
                      <li key={p.title} className="border-b border-line">
                        <Link href={p.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between gap-4 py-4">
                          <span className="text-[1.375rem] font-medium tracking-[-0.025em] text-ink">{p.title}</span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-subtle" strokeWidth={1.8} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="eyebrow mt-10">Resources</p>
                  <ul className="mt-3 border-t border-line">
                    {[...RESOURCES, { icon: BookOpen, title: "Contact", body: "", href: "/contact" }].map((r) => (
                      <li key={r.title} className="border-b border-line">
                        <Link href={r.href} onClick={() => setOpen(false)} className="flex items-center justify-between gap-4 py-3.5 text-[1.0625rem] text-body">
                          {r.title}
                          <ArrowRight className="h-4 w-4 shrink-0 text-subtle" strokeWidth={1.8} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="wrap grid shrink-0 gap-2.5 border-t border-line py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:grid-cols-2">
                  <Button href={DEMO_PATH} size="lg" onClick={() => setOpen(false)}>
                    Book a demo
                  </Button>
                  <Button href="/docs" size="lg" variant="secondary" icon={<BookOpen className="h-4 w-4" strokeWidth={1.8} />} onClick={() => setOpen(false)}>
                    Documentation
                  </Button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
