import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Headphones, MessageCircle, PackageCheck, Wrench } from "lucide-react";
import heroImage from "@/assets/hero-kpor.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { categories, products, whatsappUrl } from "@/lib/catalog";
import { storeGallery } from "@/lib/store-gallery";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "EBImax Technique — Équipements industriels" },
    { name: "description", content: "Énergie, pompes, outillage, sécurité et froid pour les professionnels au Sénégal." },
    { property: "og:title", content: "EBImax Technique — Équipements industriels" },
    { property: "og:description", content: "Énergie, pompes, outillage, sécurité et froid pour les professionnels au Sénégal." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative min-h-[610px] overflow-hidden bg-foreground text-background lg:min-h-[660px]">
        <img src={heroImage} alt="Groupe électrogène industriel jaune dans un atelier" width={1600} height={900} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[68%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--foreground)_0%,color-mix(in_oklch,var(--foreground)_88%,transparent)_38%,transparent_75%)]" />
        <div className="site-container relative flex min-h-[610px] items-center py-16 lg:min-h-[660px]">
          <div className="max-w-2xl">
            <p className="mb-6 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] text-primary"><span className="h-px w-10 bg-primary" /> Performance sans compromis</p>
            <h1 className="font-display text-4xl font-black uppercase leading-[0.95] sm:text-6xl lg:text-7xl">Générateurs<br /><span className="text-primary">industriels KPOR</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-background/75 sm:text-lg">Fiables, robustes et adaptés aux conditions exigeantes de chantier.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Button asChild size="lg" className="h-12 px-6 font-extrabold"><a href={whatsappUrl("Groupe Électrogène KPOR Diesel")} target="_blank" rel="noreferrer"><MessageCircle /> Demander un devis</a></Button><Button asChild variant="outline" size="lg" className="h-12 border-background/30 bg-background/5 text-background hover:bg-background hover:text-foreground"><Link to="/catalog/$slug" params={{ slug: "energie-solaire" }}>Voir les modèles <ArrowRight /></Link></Button></div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-t border-background/15 bg-foreground/75 backdrop-blur"><div className="site-container grid grid-cols-2 divide-x divide-background/15 md:grid-cols-4">{[[PackageCheck,"Stock local"],[BadgeCheck,"Matériel pro"],[Wrench,"Conseil technique"],[Headphones,"Service réactif"]].map(([Icon,label]) => { const IconComponent = Icon as typeof PackageCheck; return <div key={label as string} className="flex items-center justify-center gap-2 px-2 py-4 text-[11px] font-bold uppercase sm:text-xs"><IconComponent className="size-4 text-primary" />{label as string}</div>; })}</div></div>
      </section>

      <section className="py-20">
        <div className="site-container">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">Nos spécialités</p><h2 className="mt-2 font-display text-3xl font-black uppercase sm:text-4xl">Équipez chaque projet</h2></div><p className="max-w-md text-sm leading-6 text-muted-foreground">Une sélection professionnelle pour l’énergie, l’eau, le chantier, la sécurité et le froid.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => <Link key={category.id} to="/catalog/$slug" params={{ slug: category.slug }} className="group relative aspect-[4/5] overflow-hidden bg-foreground"><img src={category.image} alt={category.name} loading="lazy" width={900} height={700} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-[linear-gradient(0deg,var(--foreground)_0%,transparent_70%)]" /><div className="absolute inset-x-0 bottom-0 p-5 text-background"><span className="text-[10px] font-bold uppercase text-primary">{category.count} références</span><h3 className="mt-1 font-display text-lg font-bold leading-tight">{category.name}</h3><ArrowRight className="mt-3 size-5 transition-transform group-hover:translate-x-1" /></div></Link>)}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted py-20">
        <div className="site-container"><div className="mb-10 flex items-end justify-between gap-5"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">Sélection magasin</p><h2 className="mt-2 font-display text-3xl font-black uppercase sm:text-4xl">Produits vedettes</h2></div><span className="hidden text-sm text-muted-foreground md:block">Prix en FCFA · Devis rapides sur WhatsApp</span></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></div>
      </section>

      <section className="py-20">
        <div className="site-container">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">En direct du magasin</p><h2 className="mt-2 font-display text-3xl font-black uppercase sm:text-4xl">Notre boutique, notre stock</h2></div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">Découvrez une partie de nos équipements disponibles et échangez avec notre équipe pour confirmer votre référence.</p>
          </div>
          <div className="grid auto-rows-[210px] grid-cols-2 gap-3 md:auto-rows-[260px] md:grid-cols-4">
            {storeGallery.map((photo, index) => (
              <figure key={photo.src} className={`group relative overflow-hidden bg-muted ${photo.featured ? "col-span-2 row-span-2" : ""} ${index === 5 ? "col-span-2" : ""}`}>
                <img src={photo.src} alt={photo.alt} loading="lazy" width={1280} height={720} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,color-mix(in_oklch,var(--foreground)_78%,transparent)_0%,transparent_55%)]" />
                <figcaption className="absolute bottom-0 left-0 p-4 font-display text-sm font-extrabold uppercase text-background sm:text-base">{photo.title}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-start justify-between gap-5 border-l-4 border-primary bg-muted p-6 sm:flex-row sm:items-center">
            <div><p className="font-display text-xl font-extrabold uppercase">Une référence vous intéresse ?</p><p className="mt-1 text-sm text-muted-foreground">Envoyez-nous la photo ou le nom du produit sur WhatsApp.</p></div>
            <Button asChild><a href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle /> Vérifier la disponibilité</a></Button>
          </div>
        </div>
      </section>

      <section className="bg-primary py-14"><div className="site-container flex flex-col items-start justify-between gap-7 md:flex-row md:items-center"><div><p className="text-xs font-black uppercase tracking-[0.16em]">Besoin d’une référence précise ?</p><h2 className="mt-2 font-display text-3xl font-black uppercase">Parlez à un conseiller technique.</h2></div><Button asChild size="lg" className="h-12 bg-foreground px-6 text-background hover:bg-foreground/90"><a href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle /> Obtenir un devis</a></Button></div></section>
    </>
  );
}
