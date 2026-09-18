import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/catalog";
import type { DisplayProduct } from "@/lib/products";

export function ProductCard({ product }: { product: DisplayProduct }) {
  const stockStyle = product.stock === "in_stock" ? "stock-good" : product.stock === "low_stock" ? "stock-low" : "stock-order";
  return (
    <article className="group overflow-hidden border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-product">
      <div className="relative aspect-[6/5] overflow-hidden bg-muted">
        <img src={product.image} alt={product.title} loading="lazy" width={900} height={760} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        <span className={`absolute left-4 top-4 ${stockStyle}`}>{product.stockLabel}</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase text-muted-foreground"><span>{product.brand}</span><span>{product.sku}</span></div>
        <h3 className="mt-3 min-h-14 font-display text-xl font-bold leading-tight text-card-foreground">{product.title}</h3>
        {product.description ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{product.description}</p> : null}
        {product.specs.length > 0 && (
          <dl className="my-5 grid gap-2 border-y border-border py-4 text-sm">
            {product.specs.map(([key, value]) => <div key={key} className="flex justify-between gap-4"><dt className="text-muted-foreground">{key}</dt><dd className="font-semibold text-foreground">{value}</dd></div>)}
          </dl>
        )}
        <div className="mt-5 flex items-end justify-between gap-3"><div><span className="text-[11px] font-bold uppercase text-muted-foreground">Prix</span><p className="font-display text-xl font-black text-foreground">{product.price}</p></div><Button asChild size="icon" aria-label={`Demander un devis pour ${product.title}`}><a href={whatsappUrl(product.title)} target="_blank" rel="noreferrer"><MessageCircle /></a></Button></div>
        <Link to="/catalog/$slug" params={{ slug: product.categorySlug }} className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs font-bold uppercase text-muted-foreground hover:text-primary"><span>Voir le rayon</span><ArrowRight className="size-4" /></Link>
      </div>
    </article>
  );
}
