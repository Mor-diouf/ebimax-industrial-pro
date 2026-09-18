import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/lib/catalog";
import { fetchProducts, stockLabels, uploadProductPhoto, type StockValue } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Espace admin — Ajouter un produit | EBImax Technique" },
    { name: "description", content: "Ajoutez, modifiez et supprimez les produits du catalogue EBImax Technique." },
    { property: "og:title", content: "Espace admin — EBImax Technique" },
    { property: "og:description", content: "Gestion du catalogue produits EBImax Technique." },
    { property: "og:type", content: "website" },
    { name: "robots", content: "noindex" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AdminPage,
});

type SpecRow = { label: string; value: string };

const emptyForm = {
  title: "",
  brand: "",
  sku: "",
  categorySlug: categories[0].slug as string,
  price: "",
  quoteOnly: true,
  stock: "in_stock" as StockValue,
  description: "",
};

function AdminPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [specs, setSpecs] = useState<SpecRow[]>([{ label: "", value: "" }]);
  const [file, setFile] = useState<File | null>(null);

  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin-products"], queryFn: fetchProducts });

  const createProduct = useMutation({
    mutationFn: async () => {
      if (!form.title.trim()) throw new Error("Le nom du produit est obligatoire.");
      const imagePath = file ? await uploadProductPhoto(file) : null;
      const cleanSpecs = specs.filter((row) => row.label.trim() && row.value.trim()).map((row) => [row.label.trim(), row.value.trim()]);
      const { error } = await supabase.from("products").insert({
        title: form.title.trim(),
        brand: form.brand.trim(),
        sku: form.sku.trim(),
        category_slug: form.categorySlug,
        price: form.quoteOnly ? "Sur devis" : form.price.trim() || "Sur devis",
        stock: form.stock,
        description: form.description.trim(),
        specs: cleanSpecs,
        image_url: imagePath,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Produit ajouté au catalogue");
      setForm(emptyForm);
      setSpecs([{ label: "", value: "" }]);
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => toast.error(error.message || "L’ajout a échoué"),
  });

  const removeProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Produit supprimé");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => toast.error(error.message || "La suppression a échoué"),
  });

  return (
    <section className="py-12">
      <div className="site-container">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">Espace administration</p>
        <h1 className="mt-2 font-display text-3xl font-black uppercase sm:text-4xl">Gérer les produits</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Ajoutez vos articles avec photo, prix et caractéristiques : ils apparaissent immédiatement sur l’accueil et dans le rayon choisi.</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr]">
          <form
            className="h-fit border border-border bg-card p-6"
            onSubmit={(event) => { event.preventDefault(); createProduct.mutate(); }}
          >
            <h2 className="font-display text-xl font-black uppercase">Nouveau produit</h2>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-2"><Label htmlFor="title">Nom du produit *</Label><Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={120} placeholder="Motopompe Pedrollo CP 158" required /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2"><Label htmlFor="brand">Marque</Label><Input id="brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} maxLength={60} placeholder="Pedrollo" /></div>
                <div className="grid gap-2"><Label htmlFor="sku">Référence</Label><Input id="sku" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} maxLength={40} placeholder="PED-CP158" /></div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Rayon</Label>
                <select id="category" value={form.categorySlug} onChange={(e) => setForm({ ...form, categorySlug: e.target.value })} className="h-10 border border-input bg-background px-3 text-sm">
                  {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="stock">Disponibilité</Label>
                <select id="stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value as StockValue })} className="h-10 border border-input bg-background px-3 text-sm">
                  {Object.entries(stockLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>

              <div className="grid gap-2">
                <Label>Prix</Label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={form.quoteOnly} onChange={(e) => setForm({ ...form, quoteOnly: e.target.checked })} /> Afficher « Sur devis »</label>
                {!form.quoteOnly && <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} maxLength={40} placeholder="850 000 FCFA" />}
              </div>

              <div className="grid gap-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={800} rows={4} placeholder="Présentation du produit, usages, garantie…" /></div>

              <div className="grid gap-2">
                <Label>Caractéristiques techniques</Label>
                {specs.map((row, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <Input value={row.label} maxLength={40} placeholder="Puissance" onChange={(e) => setSpecs(specs.map((item, i) => i === index ? { ...item, label: e.target.value } : item))} />
                    <Input value={row.value} maxLength={60} placeholder="1.5 HP" onChange={(e) => setSpecs(specs.map((item, i) => i === index ? { ...item, value: e.target.value } : item))} />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => setSpecs([...specs, { label: "", value: "" }])}><Plus className="size-4" /> Ajouter une ligne</Button>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="photo">Photo du produit</Label>
                <Input id="photo" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                {file && <span className="text-xs text-muted-foreground">{file.name}</span>}
              </div>

              <Button type="submit" size="lg" disabled={createProduct.isPending}>
                {createProduct.isPending ? <Loader2 className="animate-spin" /> : <Upload />} Publier le produit
              </Button>
            </div>
          </form>

          <div>
            <h2 className="font-display text-xl font-black uppercase">Produits publiés ({items.length})</h2>
            {isLoading ? (
              <p className="mt-5 text-sm text-muted-foreground">Chargement…</p>
            ) : items.length === 0 ? (
              <p className="mt-5 border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Aucun produit publié pour l’instant. Utilisez le formulaire pour en ajouter un.</p>
            ) : (
              <ul className="mt-5 grid gap-3">
                {items.map((product) => (
                  <li key={product.id} className="flex items-center gap-4 border border-border bg-card p-3">
                    <img src={product.image} alt={product.title} className="size-16 shrink-0 object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base font-bold">{product.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{product.category} · {product.price} · {product.stockLabel}</p>
                    </div>
                    <Button variant="outline" size="icon" aria-label={`Supprimer ${product.title}`} onClick={() => removeProduct.mutate(product.id)} disabled={removeProduct.isPending}><Trash2 /></Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
