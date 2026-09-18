import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Home,
  LayoutGrid,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categories, store, whatsappUrl } from "@/lib/catalog";
import { CartSheet } from "./cart-sheet";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

export function BrandMark() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 sm:gap-3"
      aria-label="Quincaillerie SOPE S. FALLOU — Accueil"
    >
      <span className="grid size-9 sm:size-10 place-items-center bg-primary font-display text-lg sm:text-xl font-black text-primary-foreground italic rounded-md">
        ⚡
      </span>
      <span className="leading-none">
        <strong className="block font-display text-lg sm:text-xl font-black uppercase text-foreground italic">
          AB<span className="text-primary">619</span>
        </strong>
        <span className="mt-0.5 block text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Elektrikasyon
        </span>
      </span>
    </Link>
  );
}

export function StoreShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, isLoading } = useAuth();
  const { totalItems: totalCartItems } = useCart();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Barre d'annonces supérieure */}
      <div className="bg-foreground text-background">
        <div className="site-container flex min-h-9 items-center justify-between gap-2 py-1.5 text-xs font-semibold">
          <span className="truncate text-background/80 text-[11px] sm:text-xs">
            Conseil & équipements à Dakar (AB619)
          </span>
          {/* Actions Droite */}
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href={`tel:${store.phone.replaceAll(" ", "")}`}
              className="flex items-center gap-1.5 rounded-full border border-background/10 bg-background/5 px-2.5 sm:px-4 py-1 sm:py-2 text-[11px] sm:text-sm font-bold transition-colors hover:bg-background/10"
            >
              <Phone className="size-3.5 text-primary" />
              <span className="font-mono">{store.phone}</span>
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-full bg-success px-3.5 py-1.5 text-xs font-bold text-success-foreground transition-colors hover:bg-success/90"
            >
              <MessageCircle className="size-3.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* En-tête Principal Sticky */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="site-container flex h-16 sm:h-20 items-center justify-between gap-4">
          <BrandMark />

          {/* Navigation Desktop */}
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

          {/* Actions d'en-tête */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="font-bold">
                <Link to={user ? "/mon-compte" : "/auth"}>
                  <User className="mr-2 size-4" />
                  {isLoading ? "..." : user ? "Mon compte" : "Se connecter"}
                </Link>
              </Button>
              {isAdmin && (
                <Button asChild variant="outline" size="sm" className="font-bold border-primary text-primary hover:bg-primary/10">
                  <Link to="/admin">
                    <ShieldCheck className="mr-1.5 size-4" /> Admin
                  </Link>
                </Button>
              )}
            </div>

            {/* Panier */}
            <CartSheet />

            {/* Bouton Devis (Desktop) */}
            <div className="hidden lg:block">
              <Button asChild className="h-11 font-bold">
                <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 size-4" /> Demander un devis
                </a>
              </Button>
            </div>

            {/* Bouton Menu Mobile (Hamburger) */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden shrink-0"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {/* Tiroir / Menu Mobile déroulant */}
        {open && (
          <nav
            className="site-container grid gap-2 border-t border-border py-4 lg:hidden max-h-[80vh] overflow-y-auto"
            aria-label="Navigation mobile"
          >
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="mobile-nav-link flex items-center gap-2.5 font-bold text-sm"
            >
              <Home className="size-4 text-primary" />
              <span>Accueil</span>
            </Link>

            <div className="py-2.5 border-y border-border/60">
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-2">
                Nos Rayons Spécialisés
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to="/catalog/$slug"
                    params={{ slug: category.slug }}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg p-2.5 text-xs font-semibold bg-muted/40 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <span>{category.shortName}</span>
                    <ArrowRight className="size-3 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to={user ? "/mon-compte" : "/auth"}
              onClick={() => setOpen(false)}
              className="mobile-nav-link flex items-center justify-between font-bold text-sm"
            >
              <span className="flex items-center">
                <User className="mr-2.5 size-4 text-primary" />
                {isLoading ? "..." : user ? "Mon compte" : "Se connecter"}
              </span>
              {isAdmin && <Badge className="text-[10px] bg-primary font-bold">Admin</Badge>}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="mobile-nav-link flex items-center text-primary font-bold bg-primary/10 rounded-lg text-sm"
              >
                <ShieldCheck className="mr-2.5 size-4" /> Espace Administration
              </Link>
            )}

            <div className="pt-2">
              <Button asChild className="w-full font-bold h-11">
                <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 size-4 text-success" /> Écrire sur WhatsApp
                </a>
              </Button>
            </div>
          </nav>
        )}
      </header>

      {/* Contenu principal (avec padding bottom sur mobile pour ne pas être masqué par la barre de navigation) */}
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>

      {/* Footer */}
      <footer className="bg-foreground text-background pb-16 lg:pb-0">
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

      {/* Bouton flottant WhatsApp (Desktop uniquement) */}
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noreferrer"
        className="hidden lg:grid fixed bottom-6 right-6 z-30 size-14 place-items-center rounded-full bg-success text-success-foreground shadow-lg transition-transform hover:scale-105"
        aria-label="Contacter la quincaillerie sur WhatsApp"
      >
        <MessageCircle className="size-6" />
      </a>

      {/* Barre de navigation mobile fixée en bas (App-like navigation pour mobile) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-background/95 backdrop-blur-md py-2 px-2 lg:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
        aria-label="Navigation mobile rapide"
      >
        <Link
          to="/"
          activeOptions={{ exact: true }}
          className="flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-primary"
        >
          <Home className="size-5" />
          <span className="text-[10px] font-bold">Accueil</span>
        </Link>

        <Link
          to="/catalog/$slug"
          params={{ slug: categories[0].slug }}
          className="flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-primary"
        >
          <LayoutGrid className="size-5" />
          <span className="text-[10px] font-bold">Rayons</span>
        </Link>

        {/* Panier avec trigger CartSheet */}
        <CartSheet
          trigger={
            <button
              type="button"
              className="relative flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
              aria-label="Voir le panier"
            >
              <div className="relative">
                <ShoppingBag className="size-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold">Panier</span>
            </button>
          }
        />

        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 text-success transition-transform active:scale-95"
          aria-label="Contacter sur WhatsApp"
        >
          <MessageCircle className="size-5" />
          <span className="text-[10px] font-bold">WhatsApp</span>
        </a>

        <Link
          to={user ? "/mon-compte" : "/auth"}
          className="flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-primary"
        >
          <User className="size-5" />
          <span className="text-[10px] font-bold">{user ? "Compte" : "Connexion"}</span>
        </Link>
      </nav>
    </div>
  );
}
