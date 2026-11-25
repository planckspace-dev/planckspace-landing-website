"use client";

import { useEffect, useRef, useState, type ComponentType, type RefObject, type SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ArrowRight, BadgeCheck, BookOpen, Boxes, ChevronDown, FileCode2, LogIn, Radar, Scale, ShieldCheck, SquareTerminal, Wand2, X } from "lucide-react";
import { PlanckspaceLockup } from "@/components/brand/Planckspace";
import { AnthropicLogo, ClaudeLogo, CursorLogo, OpenAILogo, WindsurfLogo } from "@/components/brand/ToolLogos";
import Button from "@/components/site/Button";
import { DEMO_PATH, SIGN_IN_URL } from "@/lib/plans";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   The nav: a floating glass island. Lockup, two menus (the product's four
   moves, and the reading), Docs and Contact as plain links, and one action,
   with a quiet Sign in beside it for people who already have an account.

   The island has two tones, picked by what is under it. A section on a dark
   or coloured field carries data-nav="dark"; while one of them crosses the
   island's centre line the island wears `on-night` (aperture.css re-points
   the palette, so text, buttons and the logo flip by themselves). Everywhere
   else, on the server and without script, it is the light tone. The mega menu
   and the phone sheet are solid paper in both tones (`on-paper`). On phones
   the same links open in a full-screen sheet (a Radix dialog: focus trapped,
   Escape closes).
   ───────────────────────────────────────────────────────────────────────── */

type Icon = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

const PRODUCT: { icon: Icon; title: string; body: string; href: string }[] = [
  { icon: Scale, title: "Measure", body: "See what every seat and API key costs, all in one place.", href: "/#measure" },
  { icon: Radar, title: "Find", body: "Unused seats, oversized plans, expensive models doing simple work.", href: "/#find" },
  { icon: Wand2, title: "Fix", body: "One click in your editor, with Undo. Seat changes wait for approval.", href: "/#fix" },
  { icon: BadgeCheck, title: "Prove", body: "Savings measured from real work after the fix, never a forecast.", href: "/#prove" },
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

// Hover and open fills come from --nav-hover (nav.css), which follows the tone; the focus ring from --nav-ring.
// Colour and fill only: transition-colors would also fade the ring in from currentColor.
const triggerCls =
  "group inline-flex h-9 items-center gap-1 rounded-full px-4 text-[0.9rem] font-medium text-body transition-[color,background-color] duration-160 ease-[var(--ease-out-expo)] hover:bg-[var(--nav-hover)] hover:text-ink data-[state=open]:bg-[var(--nav-hover)] data-[state=open]:text-ink";

const chevronCls = "h-4 w-4 opacity-60 transition-transform duration-160 ease-[var(--ease-out-expo)] group-data-[state=open]:rotate-180";

/** The lockup. Its two tones are set in nav.css (.nav-logo), so it follows the island. */
function Lockup() {
  return <PlanckspaceLockup className="nav-logo shrink-0" height={21} width={122} accent="#2E6BF2" />;
}

type NavTone = "light" | "dark";

const DARK_FIELD = '[data-nav="dark"]';

/**
 * Whether a dark field is under the island, and whether the tone has been
 * applied once already (until then it is set without a transition, so a page
 * that opens on a dark hero does not fade in from light).
 *
 * An IntersectionObserver whose root is collapsed to a 1px strip at the
 * island's vertical centre reports each dark field as it crosses that line:
 * no scroll handler, no layout reads while scrolling. The strip depends on the
 * viewport height, so the observer is rebuilt on resize; the fields are
 * collected again whenever the pathname changes.
 *
 * `initial` is the tone of the server render and of the first client render
 * (a page that opens on a dark hero passes "dark", so the island is dark from
 * the first byte). The observer takes over after mount. Because the first
 * swap carries no transition, a matching initial tone never flashes.
 */
function useNavTone(islandRef: RefObject<HTMLDivElement | null>, initial: NavTone) {
  const pathname = usePathname();
  // keyed by path, so a new route reads as light until its own fields report
  const [tone, setTone] = useState({ path: pathname, dark: initial === "dark" });
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const island = islandRef.current;
    const fields = Array.from(document.querySelectorAll<HTMLElement>(DARK_FIELD));
    if (!island || fields.length === 0) {
      // nothing dark on this page: an "initial" dark has nothing to hand over to
      setTone((t) => (t.dark ? { path: pathname, dark: false } : t));
      return;
    }

    const crossing = new Set<Element>();
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let timer = 0;
    let first = true;

    const observe = () => {
      observer?.disconnect();
      crossing.clear();
      const { top, height } = island.getBoundingClientRect();
      const line = Math.round(top + height / 2);
      const viewport = document.documentElement.clientHeight;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) crossing.add(entry.target);
            else crossing.delete(entry.target);
          }
          const dark = crossing.size > 0;
          setTone((t) => (t.path === pathname && t.dark === dark ? t : { path: pathname, dark }));
          if (first) {
            first = false;
            timer = window.setTimeout(() => setSettled(true), 120);
          }
        },
        { rootMargin: `-${line}px 0px -${Math.max(0, viewport - line - 1)}px 0px` },
      );
      for (const field of fields) observer.observe(field);
    };
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(observe);
    };

    observe();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [islandRef, pathname]);

  return { dark: tone.path === pathname && tone.dark, settled };
}

function MenuItem({ icon: I, title, body, href }: { icon: Icon; title: string; body: string; href: string }) {
  return (
    <NavigationMenu.Link asChild>
      <Link href={href} className="group/item flex gap-3 rounded-[14px] p-3 transition-[background-color] duration-160 ease-[var(--ease-out-expo)] hover:bg-band focus-visible:bg-band">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-line bg-surface text-ink shadow-[var(--shadow-flat)] transition-[color] duration-160 ease-[var(--ease-out-expo)] group-hover/item:text-brand-600">
          <I className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
        </span>
        <span>
          <span className="block text-[0.9rem] font-medium text-ink">{title}</span>
          <span className="mt-1 block text-[0.8125rem] leading-snug text-muted">{body}</span>
        </span>
      </Link>
    </NavigationMenu.Link>
  );
}

/** `initialTone`: the tone to render first, before the page's own fields report. Pass "dark" on a page that opens on one. */
export default function Navbar({ initialTone = "light" }: { initialTone?: NavTone }) {
  const [open, setOpen] = useState(false);
  const islandRef = useRef<HTMLDivElement>(null);
  const { dark, settled } = useNavTone(islandRef, initialTone);

  // the sheet is for phones; widening past it closes it
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  return (
    <header className="nav-root">
      <div ref={islandRef} data-tone={dark ? "dark" : "light"} className={cn("nav-island", dark && "on-night", settled && "is-settled")}>
        <div className="flex flex-1 items-center">
          <Link href="/" aria-label="PlanckSpace, home" className="-m-2 rounded-lg p-2">
            <Lockup />
          </Link>
        </div>

        <NavigationMenu.Root delayDuration={60} className="hidden justify-center lg:flex">
          <NavigationMenu.List className="flex items-center gap-1">
            <NavigationMenu.Item>
              <NavigationMenu.Trigger className={triggerCls}>
                Product
                <ChevronDown className={chevronCls} strokeWidth={1.5} aria-hidden />
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
                        <li key={name} className="flex items-center gap-2 text-[0.8125rem] text-body">
                          <L className="h-4 w-4 text-ink" strokeWidth={1.5} aria-hidden />
                          {name}
                        </li>
                      ))}
                    </ul>
                    <NavigationMenu.Link asChild>
                      <Link href="/docs/quickstart" className="link-arrow mt-4 text-[0.8125rem]">
                        Setup guide <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                      </Link>
                    </NavigationMenu.Link>
                  </div>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Trigger className={triggerCls}>
                Resources
                <ChevronDown className={chevronCls} strokeWidth={1.5} aria-hidden />
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

          {/* Positioned against the island, so the panel is centred under it with a small gap. */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
            <NavigationMenu.Viewport className="nav-viewport on-paper" />
          </div>
        </NavigationMenu.Root>

        {/* The island's padding is lopsided (a wide inset left, a concentric one right), which would pull the links off its centre;
            the extra start padding here evens the two flexible sides so the links sit on the centre line, over the panel. */}
        <div className="flex flex-1 items-center justify-end gap-2 lg:pl-[calc(var(--nav-pad-l)_-_var(--nav-pad-r))]">
          <Button href={SIGN_IN_URL} size="sm" variant="ghost" className="hidden sm:inline-flex">
            Sign in
          </Button>
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
              <Dialog.Content className="sheet on-paper fixed inset-0 z-[var(--z-modal)] flex flex-col overflow-y-auto bg-page" aria-describedby={undefined}>
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                {/* The island's own geometry (nav.css), so the lockup and the close button land where the island's lockup and burger were. */}
                <div className="sheet-bar">
                  <div className="sheet-bar-row">
                    <Link href="/" onClick={() => setOpen(false)} aria-label="PlanckSpace, home" className="-m-2 rounded-lg p-2">
                      <Lockup />
                    </Link>
                    <Dialog.Close asChild>
                      <button type="button" className="nav-burger" aria-label="Close menu">
                        <X className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
                      </button>
                    </Dialog.Close>
                  </div>
                </div>

                <nav className="wrap flex-1 pb-10 pt-4" aria-label="Main">
                  <p className="eyebrow">Product</p>
                  <ul className="mt-3 border-t border-line">
                    {PRODUCT.map((p) => (
                      <li key={p.title} className="border-b border-line">
                        <Link href={p.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between gap-4 py-4">
                          <span className="text-[1.375rem] font-medium tracking-[-0.025em] text-ink">{p.title}</span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-subtle" strokeWidth={1.5} aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="eyebrow mt-10">Resources</p>
                  <ul className="mt-3 border-t border-line">
                    {[...RESOURCES, { icon: BookOpen, title: "Contact", body: "", href: "/contact" }].map((r) => (
                      <li key={r.title} className="border-b border-line">
                        <Link href={r.href} onClick={() => setOpen(false)} className="flex items-center justify-between gap-4 py-3 text-[1.0625rem] text-body">
                          {r.title}
                          <ArrowRight className="h-4 w-4 shrink-0 text-subtle" strokeWidth={1.5} aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Pinned, so Book a demo and Sign in never sit below the fold on a short phone. */}
                <div className="wrap sticky bottom-0 grid shrink-0 gap-3 border-t border-line bg-page py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:grid-cols-2">
                  <Button href={DEMO_PATH} size="lg" onClick={() => setOpen(false)}>
                    Book a demo
                  </Button>
                  {/* Documentation is already first under Resources above. */}
                  <Button href={SIGN_IN_URL} size="lg" variant="secondary" icon={<LogIn className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />} onClick={() => setOpen(false)}>
                    Sign in
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
