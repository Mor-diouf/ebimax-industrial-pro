import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  MessageCircle,
  PackageCheck,
  Wrench,
} from "lucide-react";
import heroImage from "@/assets/hero-kpor.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { categories, whatsappUrl } from "@/lib/catalog";
import { storeGallery } from "@/lib/store-gallery";
import { fetchProducts } from "@/lib/products";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quincaillerie SOPE S. FALLOU — Équipements & Énergie" },
      {
        name: "description",
        content:
          "Quincaillerie, énergie, pompes, outillage, sécurité et froid pour les professionnels au Sénégal.",
      },
      { property: "og:title", content: "Quincaillerie SOPE S. FALLOU — Équipements" },
      {
        property: "og:description",
        content:
          "Quincaillerie, énergie, pompes, outillage, sécurité et froid pour les professionnels au Sénégal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const featured = products.slice(0, 4);

  return (
    <>
      <section className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[660px] overflow-hidden bg-foreground text-background">
        <img
          src={heroImage}
          alt="Groupe électrogène industriel jaune dans un atelier"
          width={1600}
          height={900}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--foreground)_0%,color-mix(in_oklch,var(--foreground)_88%,transparent)_45%,transparent_85%)]" />
        <div className="site-container relative flex min-h-[500px] sm:min-h-[600px] lg:min-h-[660px] items-center py-12 sm:py-16 lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-4 sm:mb-6 flex items-center gap-3 text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              <span className="h-px w-8 sm:w-10 bg-primary" /> Performance sans compromis
            </p>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-7xl font-black uppercase leading-[1.05] sm:leading-[0.95] break-words">
              Quincaillerie
              <br />
              <span className="text-primary">SOPE S. FALLOU</span>
            </h1>
            <p className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-lg leading-relaxed text-background/80">
              Votre partenaire fiable pour tous vos besoins en équipements industriels, outillage,
              électricité et énergie (Entreprise AB619).
            </p>
            <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button asChild size="lg" className="h-12 px-6 font-extrabold w-full sm:w-auto">
                <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 size-5" /> Demander un devis
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 border-background/30 bg-background/5 text-background hover:bg-background hover:text-foreground w-full sm:w-auto"
              >
                <Link to="/catalog/$slug" params={{ slug: "energie-solaire" }}>
                  Nos Rayons <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-background/15 bg-foreground/80 backdrop-blur">
          <div className="site-container grid grid-cols-2 divide-x divide-background/15 sm:grid-cols-4">
            {[
              [PackageCheck, "Stock local"],
              [BadgeCheck, "Matériel pro"],
              [Wrench, "Conseil technique"],
              [Headphones, "Service réactif"],
            ].map(([Icon, label]) => {
              const IconComponent = Icon as typeof PackageCheck;
              return (
                <div
                  key={label as string}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 py-3.5 sm:py-4 text-[10px] sm:text-xs font-bold uppercase"
                >
                  <IconComponent className="size-3.5 sm:size-4 text-primary shrink-0" />
                  <span className="truncate">{label as string}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="site-container">
          <div className="mb-8 sm:mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                Nos spécialités
              </p>
              <h2 className="mt-1.5 font-display text-2xl sm:text-4xl font-black uppercase">
                Équipez chaque projet
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Une sélection professionnelle pour l’énergie, l’eau, le chantier, la sécurité et le
              froid.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to="/catalog/$slug"
                params={{ slug: category.slug }}
                className="group relative aspect-[4/5] overflow-hidden bg-foreground rounded-xl shadow-sm"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  width={900}
                  height={700}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--foreground)_0%,transparent_70%)]" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 text-background">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase text-primary block">
                    {category.count} réf.
                  </span>
                  <h3 className="mt-0.5 sm:mt-1 font-display text-xs sm:text-base lg:text-lg font-bold leading-tight">
                    {category.name}
                  </h3>
                  <ArrowRight className="mt-2 sm:mt-3 size-3.5 sm:size-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/40 py-12 sm:py-20">
        <div className="site-container">
          <div className="mb-8 sm:mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                Sélection magasin
              </p>
              <h2 className="mt-1.5 font-display text-2xl sm:text-4xl font-black uppercase">
                Produits vedettes
              </h2>
            </div>
            <span className="hidden text-xs sm:text-sm text-muted-foreground md:block">
              Prix en FCFA · Devis rapides sur WhatsApp
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="site-container">
          <div className="mb-8 sm:mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                En direct du magasin
              </p>
              <h2 className="mt-1.5 font-display text-2xl sm:text-4xl font-black uppercase">
                Notre boutique, notre stock
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Découvrez une partie de nos équipements disponibles et échangez avec notre équipe pour
              confirmer votre référence.
            </p>
          </div>
          <div className="grid auto-rows-[140px] sm:auto-rows-[200px] md:auto-rows-[260px] grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
            {storeGallery.map((photo, index) => (
              <figure
                key={photo.src}
                className={`group relative overflow-hidden bg-muted rounded-xl ${photo.featured ? "col-span-2 row-span-2" : ""} ${index === 5 ? "col-span-2" : ""}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,color-mix(in_oklch,var(--foreground)_78%,transparent)_0%,transparent_55%)]" />
                <figcaption className="absolute bottom-0 left-0 p-3 sm:p-4 font-display text-xs sm:text-base font-extrabold uppercase text-background">
                  {photo.title}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-6 sm:mt-8 flex flex-col items-start justify-between gap-4 border-l-4 border-primary bg-muted/60 p-4 sm:p-6 sm:flex-row sm:items-center rounded-r-xl">
            <div>
              <p className="font-display text-base sm:text-xl font-extrabold uppercase">
                Une référence vous intéresse ?
              </p>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Envoyez-nous la photo ou le nom du produit sur WhatsApp.
              </p>
            </div>
            <Button asChild className="w-full sm:w-auto font-bold">
              <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 size-4 text-success" /> Vérifier la disponibilité
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-primary py-10 sm:py-14">
        <div className="site-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.16em]">
              Besoin d’une référence précise ?
            </p>
            <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-black uppercase leading-tight">
              Parlez à un conseiller technique.
            </h2>
          </div>
          <Button
            asChild
            size="lg"
            className="h-12 bg-foreground px-6 text-background hover:bg-foreground/90 w-full sm:w-auto font-extrabold"
          >
            <a href={whatsappUrl()} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 size-5" /> Obtenir un devis
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
