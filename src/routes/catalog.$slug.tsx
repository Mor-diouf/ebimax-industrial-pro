import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { categories, products, whatsappUrl } from "@/lib/catalog";

export const Route = createFileRoute("/catalog/$slug")({
  loader: ({ params }) => {
    const category = categories.find((item) => item.slug === params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.category.name} — EBImax Technique` : "Catalogue indisponible — EBImax" },
    { name: "description", content: loaderData ? `Découvrez nos équipements ${loaderData.category.name.toLowerCase()} et demandez votre devis.` : "Ce catalogue EBImax n’est pas disponible." },
    { property: "og:title", content: loaderData ? `${loaderData.category.name} — EBImax Technique` : "Catalogue EBImax" },
    { property: "og:description", content: loaderData ? `Équipements professionnels ${loaderData.category.name.toLowerCase()} au Sénégal.` : "Catalogue d’équipements professionnels EBImax." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CatalogPage,
  notFoundComponent: CatalogNotFound,
});

function CatalogPage() {
  const { category } = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const matching = useMemo(() => products.filter((product) => product.categorySlug === category.slug && `${product.title} ${product.brand} ${product.sku}`.toLowerCase().includes(query.toLowerCase())), [category.slug, query]);
  const related = matching.length ? matching : query ? [] : products.filter((product) => product.categorySlug !== category.slug);
  const displayingRelated = !query && matching.length === 0;
  return <>
    <section className="relative min-h-[360px] overflow-hidden bg-foreground text-background"><img src={category.image} alt={category.name} width={900} height={700} className="absolute inset-0 h-full w-full object-cover opacity-55" /><div className="absolute inset-0 bg-[linear-gradient(90deg,var(--foreground)_0%,color-mix(in_oklch,var(--foreground)_75%,transparent)_55%,transparent)]"/><div className="site-container relative flex min-h-[360px] items-end py-12"><div><Link to="/" className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase text-background/70 hover:text-primary"><ArrowLeft className="size-4"/> Retour à l’accueil</Link><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Catalogue professionnel</p><h1 className="mt-3 max-w-3xl font-display text-4xl font-black uppercase sm:text-6xl">{category.name}</h1><p className="mt-4 text-sm text-background/70">{category.count} références disponibles sur demande</p></div></div></section>
    <section className="py-16"><div className="site-container"><div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">{displayingRelated ? "À découvrir aussi" : "Dans ce rayon"}</p><h2 className="mt-2 font-display text-3xl font-black uppercase">{displayingRelated ? "Notre sélection actuelle" : `${matching.length} produit${matching.length > 1 ? "s" : ""}`}</h2></div><label className="relative block w-full md:max-w-sm"><span className="sr-only">Rechercher dans le catalogue</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un produit, une référence…" className="h-11 bg-card pl-10"/></label></div>{related.length > 0 ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{related.map((product) => <ProductCard key={product.id} product={product}/>)}</div> : <div className="border border-border bg-muted px-6 py-16 text-center"><h3 className="font-display text-2xl font-bold">Aucun produit trouvé</h3><p className="mt-2 text-sm text-muted-foreground">Essayez une autre référence ou demandez-nous directement.</p><Button asChild className="mt-6"><a href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle/> Demander au conseiller</a></Button></div>}</div></section>
  </>;
}

function CatalogNotFound() { return <section className="site-container py-24 text-center"><h1 className="font-display text-4xl font-black uppercase">Catalogue introuvable</h1><p className="mt-3 text-muted-foreground">Cette catégorie n’existe pas ou a été déplacée.</p><Button asChild className="mt-7"><Link to="/">Retour à l’accueil</Link></Button></section>; }