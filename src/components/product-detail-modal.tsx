import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShoppingCart,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  Images,
} from "lucide-react";
import { whatsappUrl } from "@/lib/catalog";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import type { DisplayProduct } from "@/lib/products";

export function ProductDetailModal({
  product,
  open,
  onOpenChange,
  initialImageIndex = 0,
}: {
  product: DisplayProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialImageIndex?: number;
}) {
  const { addItem } = useCart();
  const [activeIdx, setActiveIdx] = useState(initialImageIndex);
  const [quantity, setQuantity] = useState(1);

  const images =
    product.images && product.images.length > 0 ? product.images : [product.image];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast.success(`${quantity}x ${product.title} ajouté au panier`);
  };

  const stockIcon =
    product.stock === "in_stock" ? (
      <CheckCircle2 className="size-4 text-emerald-600" />
    ) : (
      <Clock className="size-4 text-amber-600" />
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden sm:rounded-2xl max-h-[92vh] flex flex-col">
        {/* Accessible hidden header for screen readers */}
        <DialogHeader className="sr-only">
          <DialogTitle>{product.title}</DialogTitle>
          <DialogDescription>Détails du produit et galerie photos</DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 p-5 sm:p-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Colonne GAUCHE : GALERIE PHOTOS */}
            <div className="flex flex-col gap-3">
              {/* Image Principale */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted/40 shadow-inner flex items-center justify-center group">
                <img
                  src={images[activeIdx] || product.image}
                  alt={`${product.title} - Photo ${activeIdx + 1}`}
                  className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />

                {/* Badge Stock */}
                <div className="absolute left-3 top-3">
                  <Badge variant="outline" className="bg-background/90 backdrop-blur font-bold shadow-sm">
                    {product.stockLabel}
                  </Badge>
                </div>

                {/* Indicateur Compteur Photos */}
                {images.length > 1 && (
                  <div className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    <Images className="size-3.5" />
                    <span>
                      {activeIdx + 1} / {images.length}
                    </span>
                  </div>
                )}

                {/* Flèches Navigation (si plusieurs images) */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-md"
                      aria-label="Image précédente"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-md"
                      aria-label="Image suivante"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Barre de miniatures (si plusieurs images) */}
              {images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1 scrollbar-thin">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      className={`relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-lg border-2 bg-muted/30 transition-all ${
                        activeIdx === i
                          ? "border-primary ring-2 ring-primary/40 scale-105 shadow-sm"
                          : "border-border/70 opacity-60 hover:opacity-100 hover:border-border"
                      }`}
                      aria-label={`Afficher la photo ${i + 1}`}
                    >
                      <img
                        src={img}
                        alt={`Vignette ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Colonne DROITE : INFORMATIONS & ACTIONS */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Marque & SKU */}
                <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                  <span>{product.brand}</span>
                  <span>Réf : {product.sku}</span>
                </div>

                {/* Titre Produit */}
                <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-foreground leading-tight">
                  {product.title}
                </h2>

                {/* Statut Disponibilité & Catégorie */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="font-bold">
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    {stockIcon}
                    <span>{product.stockLabel}</span>
                  </div>
                </div>

                {/* Prix */}
                <div className="rounded-xl bg-muted/40 p-4 border border-border/70">
                  <span className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider block">
                    Prix indicatif
                  </span>
                  <p className="font-display text-2xl sm:text-3xl font-black text-foreground mt-0.5">
                    {product.price}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tarif garanti en magasin • Facture pro disponible
                  </p>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Description
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Spécifications Techniques */}
                {product.specs && product.specs.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Caractéristiques techniques
                    </h3>
                    <div className="rounded-lg border border-border divide-y divide-border overflow-hidden text-xs">
                      {product.specs.map(([k, v], idx) => (
                        <div key={idx} className="flex justify-between px-3 py-2 bg-card even:bg-muted/30">
                          <span className="text-muted-foreground font-medium">{k}</span>
                          <span className="font-bold text-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions : Quantité + Panier + WhatsApp */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  {/* Sélecteur de quantité */}
                  <div className="flex items-center border border-border rounded-lg bg-card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>

                  {/* Bouton Panier */}
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="flex-1 font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    <ShoppingCart className="mr-2 size-5" />
                    Ajouter au panier
                  </Button>
                </div>

                {/* Bouton Devis WhatsApp */}
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full font-bold border-success/40 text-success hover:bg-success/10 hover:text-success"
                >
                  <a href={whatsappUrl(product.title)} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-2 size-5 text-success" />
                    Demander un devis sur WhatsApp
                  </a>
                </Button>

                {/* Réassurance */}
                <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-primary" />
                    <span>Garantie certifiée</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="size-4 text-primary" />
                    <span>Livraison Dakar & Régions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
