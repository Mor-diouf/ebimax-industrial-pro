import { Link, useLocation } from "@tanstack/react-router";
import {
  ArrowRight,
  Headphones,
  HeartHandshake,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  Phone,
  ShieldCheck,
  Wrench,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { categories, store, whatsappUrl } from "@/lib/catalog";
import { CartSheet } from "./cart-sheet";
import { useAuth } from "@/lib/auth-context";
import { User } from "lucide-react";

export function BrandMark() {
  return (
    <Link
      to="/"
      className="flex items-center gap-3"
      aria-label="Quincaillerie SOPE S. FALLOU — Accueil"
    >
      <span className="grid size-10 place-items-center bg-primary font-display text-xl font-black text-primary-foreground italic">
        ⚡
      </span>
      <span className="leading-none">
        <strong className="block font-display text-xl font-black uppercase text-foreground italic">
          AB<span className="text-primary">619</span>
        </strong>
        <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Elektrikasyon
        </span>
      </span>
    </Link>
  );
}

export function StoreShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, isLoading } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-foreground text-background">
        <div className="site-container flex min-h-9 items-center justify-between gap-4 py-2 text-xs font-semibold">
          <span className="hidden sm:inline">
            Conseil, disponibilité et service pour vos équipements
          </span>
          {/* Right Header Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <a
              href={`tel:${store.phone.replaceAll(" ", "")}`}
              className="hidden items-center gap-2 rounded-full border border-background/10 bg-background/5 px-4 py-2 text-sm font-bold transition-colors hover:bg-background/10 sm:flex"
            >
              <Phone className="size-4" />
              {store.phone}
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full bg-success px-4 py-2 text-sm font-bold text-success-foreground transition-colors hover:bg-success/90 md:flex"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="site-container flex h-20 items-center justify-between gap-6">
          <BrandMark />
          <nav className="hidden items-center gap-6 xl:flex" aria-label="Navigation principale">
            <Link to="/" activeOptions={{ exact: true }} className="nav-link">
              Accueil
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                to="/catalog/$slug"
                params={{ slug: category.slug }}
                className="nav-link"
              >
                {category.shortName}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="hidden lg:block">
              <Button asChild variant="ghost" size="sm" className="font-bold">
                <Link to={user ? "/mon-compte" : "/auth"}>
                  <User className="mr-2 size-4" />
                  {isLoading ? "..." : user ? "Mon compte" : "Se connecter"}
                </Link>
              </Button>
            </div>
            
            <CartSheet />
            
            <div className="hidden lg:block">
              <Button asChild className="h-11 font-bold">
                <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                  <MessageCircle /> Demander un devis
                </a>
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {open && (
          <nav
            className="site-container grid gap-1 border-t border-border py-4 lg:hidden"
            aria-label="Navigation mobile"
          >
            <Link to="/" onClick={() => setOpen(false)} className="mobile-nav-link">
              Accueil
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                to="/catalog/$slug"
                params={{ slug: category.slug }}
                onClick={() => setOpen(false)}
                className="mobile-nav-link"
              >
                {category.shortName}
              </Link>
            ))}
            <Link to={user ? "/mon-compte" : "/auth"} onClick={() => setOpen(false)} className="mobile-nav-link flex items-center">
              <User className="mr-2 size-4" /> {isLoading ? "..." : user ? "Mon compte" : "Se connecter"}
            </Link>
            <Link to="/admin" onClick={() => setOpen(false)} className="mobile-nav-link">
              Espace admin
            </Link>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="bg-foreground text-background">
        <div className="site-container grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <BrandMark />
            <p className="mt-5 max-w-sm text-sm leading-6 text-background/65">
              {store.tagline}. Des solutions sélectionnées pour les professionnels exigeants.
            </p>
          </div>
          <div>
            <p className="footer-title">Nos rayons</p>
            <div className="mt-4 grid gap-2 text-sm text-background/65">
              {categories.slice(0, 4).map((c) => (
                <Link
                  key={c.slug}
                  to="/catalog/$slug"
                  params={{ slug: c.slug }}
                  className="hover:text-primary"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="footer-title">Contact direct</p>
            <Link to="/admin" className="mt-4 block text-sm text-background/65 hover:text-primary">
              Espace admin
            </Link>
            <a
              href={`tel:${store.phone.replaceAll(" ", "")}`}
              className="mt-4 flex items-center gap-2 text-sm"
            >
              <Phone className="size-4 text-primary" />
              {store.phone}
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center gap-2 text-sm"
            >
              <MessageCircle className="size-4 text-success" />
              Écrire sur WhatsApp
            </a>
          </div>
        </div>
        <div className="border-t border-background/10">
          <div className="site-container flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-background/50">
            <span>© 2026 Quincaillerie SOPE S. FALLOU</span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4" /> Matériel professionnel · Assistance dédiée
            </span>
          </div>
        </div>
      </footer>
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-30 grid size-14 place-items-center rounded-full bg-success text-success-foreground shadow-lg transition-transform hover:scale-105"
        aria-label="Contacter la quincaillerie sur WhatsApp"
      >
        <MessageCircle className="size-6" />
      </a>
    </div>
  );
}
