import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  Images,
  MessageCircle,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/catalog";
import type { DisplayProduct } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { ProductDetailModal } from "./product-detail-modal";

export function ProductCard({ product }: { product: DisplayProduct }) {
  const { addItem } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const images =
    product.images && product.images.length > 0 ? product.images : [product.image];

  const stockStyle =
    product.stock === "in_stock"
      ? "stock-good"
      : product.stock === "low_stock"
        ? "stock-low"
        : "stock-order";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.title} ajouté au panier`);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <article
        onClick={() => setModalOpen(true)}
        className="group relative flex flex-col justify-between overflow-hidden border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-product cursor-pointer rounded-xl"
      >
        {/* Container Image */}
        <div className="relative aspect-[6/5] w-full overflow-hidden bg-muted">
          <img
            src={images[currentIdx] || product.image}
            alt={`${product.title} - vue ${currentIdx + 1}`}
            loading="lazy"
            width={900}
            height={760}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />

          {/* Badge Stock */}
          <span className={`absolute left-2 top-2 sm:left-3 sm:top-3 text-[9px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 rounded shadow-sm ${stockStyle}`}>
            {product.stockLabel}
          </span>

          {/* Badge Nombre de photos (si > 1) */}
          {images.length > 1 && (
            <div className="absolute right-2 top-2 sm:right-3 sm:top-3 flex items-center gap-1 rounded-full bg-black/60 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[11px] font-bold text-white backdrop-blur">
              <Images className="size-2.5 sm:size-3" />
              <span>{images.length}</span>
            </div>
          )}

          {/* Flèches de carrousel au survol (si plusieurs photos) */}
          {images.length > 1 && (
            <div className="absolute inset-x-1.5 sm:inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handlePrevImage}
                className="pointer-events-auto size-6 sm:size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-transform active:scale-95 shadow"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="size-3.5 sm:size-4" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="pointer-events-auto size-6 sm:size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-transform active:scale-95 shadow"
                aria-label="Photo suivante"
              >
                <ChevronRight className="size-3.5 sm:size-4" />
              </button>
            </div>
          )}

          {/* Points de pagination (si plusieurs photos) */}
          {images.length > 1 && (
            <div className="absolute bottom-1.5 sm:bottom-2 inset-x-0 flex justify-center gap-1 sm:gap-1.5 pointer-events-auto">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIdx(i);
                  }}
                  className={`size-1.5 sm:size-2 rounded-full transition-all ${
                    currentIdx === i
                      ? "bg-primary w-3 sm:w-4"
                      : "bg-white/70 hover:bg-white"
                  }`}
                  aria-label={`Aller à la photo ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Bouton Aperçu Rapide flottant au survol (Desktop) */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-foreground shadow-lg backdrop-blur">
              <Eye className="size-3.5 text-primary" /> Voir détails
            </span>
          </div>
        </div>

        {/* Détails du produit */}
        <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-4 md:p-5">
          <div>
            <div className="flex items-center justify-between gap-1 text-[9px] sm:text-xs font-bold uppercase text-muted-foreground">
              <span className="truncate">{product.brand}</span>
              <span className="truncate">{product.sku}</span>
            </div>

            <h3 className="mt-1 sm:mt-2 font-display text-xs sm:text-base md:text-lg font-black leading-snug text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            {product.description ? (
              <p className="mt-1 line-clamp-1 sm:line-clamp-2 text-[10px] sm:text-xs leading-4 sm:leading-5 text-muted-foreground">
                {product.description}
              </p>
            ) : null}

            {product.specs.length > 0 && (
              <dl className="my-2 hidden sm:grid gap-1 border-y border-border py-2 text-xs">
                {product.specs.slice(0, 2).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-2">
                    <dt className="text-muted-foreground truncate">{key}</dt>
                    <dd className="font-semibold text-foreground truncate">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-border">
            <div className="flex items-end justify-between gap-1 sm:gap-2">
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider block">
                  Prix
                </span>
                <p className="font-display text-xs sm:text-base md:text-lg font-black text-foreground truncate">
                  {product.price}
                </p>
              </div>

              {/* Boutons d'actions rapides */}
              <div className="flex gap-1 sm:gap-1.5 shrink-0">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleAddToCart}
                  aria-label={`Ajouter ${product.title} au panier`}
                  className="size-7 sm:size-8 md:size-9 hover:border-primary hover:text-primary transition-colors"
                >
                  <ShoppingCart className="size-3.5 sm:size-4" />
                </Button>
                <Button
                  asChild
                  size="icon"
                  aria-label={`Demander un devis pour ${product.title}`}
                  className="size-7 sm:size-8 md:size-9 bg-success/90 hover:bg-success text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a href={whatsappUrl(product.title)} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-3.5 sm:size-4" />
                  </a>
                </Button>
              </div>
            </div>

            <Link
              to="/catalog/$slug"
              params={{ slug: product.categorySlug }}
              onClick={(e) => e.stopPropagation()}
              className="mt-2 sm:mt-3 hidden sm:flex items-center justify-between text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="truncate">{product.category}</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </article>

      {/* Modal / Dialog Fiche Produit Complète */}
      <ProductDetailModal
        product={product}
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialImageIndex={currentIdx}
      />
    </>
  );
}
