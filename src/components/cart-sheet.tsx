import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { store } from "@/lib/catalog";
import { useEffect } from "react";

export function CartSheet({ trigger }: { trigger?: React.ReactNode } = {}) {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", company: "" });

  useEffect(() => {
    if (user && isOpen && !customer.name) {
      const name = user.user_metadata?.first_name 
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
        : "";
      setCustomer((prev) => ({ ...prev, name }));
    }
  }, [user, isOpen]);

  const totalPrice = items.reduce((sum, item) => {
    // Basic price parsing, assuming format "120000 FCFA"
    const priceStr = item.price.replace(/[^\d]/g, "");
    const priceNum = parseInt(priceStr, 10);
    return sum + (isNaN(priceNum) ? 0 : priceNum * item.quantity);
  }, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-SN", { style: "currency", currency: "XOF" })
      .format(price)
      .replace("F CFA", "FCFA");
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address) {
      return toast.error("Veuillez remplir tous les champs obligatoires.");
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_address: customer.address,
        customer_company: customer.company,
        items: items,
        total_price: formatPrice(totalPrice),
        status: "pending",
        user_id: user?.id || null,
      };

      const { error } = await supabase.from("orders").insert(orderData);

      if (error) throw error;

      toast.success("Votre commande a été envoyée !");

      // WhatsApp Redirect
      const productLines = items.map((i) => `- ${i.quantity}x ${i.title} (${i.price})`).join("%0A");
      const message = `Bonjour Quincaillerie SOPE S. FALLOU,%0AJe viens de passer une commande sur votre site.%0A%0A*Détails client:*%0ANom: ${customer.name}%0ATél: ${customer.phone}%0AAdresse: ${customer.address}%0AEntreprise: ${customer.company || "N/A"}%0A%0A*Ma Commande:*%0A${productLines}%0A%0A*Total Estimé:* ${formatPrice(totalPrice)}`;

      window.open(`https://wa.me/${store.whatsapp}?text=${message}`, "_blank");

      clearCart();
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'envoi de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="outline" size="icon" className="relative shrink-0">
            <ShoppingCart className="size-5" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display font-black uppercase">Votre Panier</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingCart className="size-12 opacity-50" />
            <p>Votre panier est vide.</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-6 overflow-hidden pt-4">
            <div className="flex-1 overflow-y-auto pr-4">
              <ul className="grid gap-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <img src={item.image} alt="" className="size-16 rounded border object-cover" />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="line-clamp-2 text-sm font-bold leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-6 h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-6 h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="size-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto size-6 h-6 w-6 text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-4">
              <div className="mb-4 flex items-center justify-between font-bold">
                <span>Total Estimé</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <form onSubmit={handleCheckout} className="grid gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="address">Adresse de livraison *</Label>
                  <Input
                    id="address"
                    required
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="company">Entreprise (Optionnel)</Label>
                  <Input
                    id="company"
                    value={customer.company}
                    onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
                  />
                </div>
                <Button
                  type="submit"
                  className="mt-2 w-full font-bold uppercase"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Validation..." : "Valider la commande"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
