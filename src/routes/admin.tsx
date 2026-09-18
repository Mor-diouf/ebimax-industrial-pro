import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Package,
  Plus,
  Trash2,
  Upload,
  ShoppingBag,
  Settings2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/lib/catalog";
import { fetchProducts, stockLabels, uploadProductPhoto, type StockValue } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Espace admin — Quincaillerie SOPE S. FALLOU" },
      { name: "description", content: "Gestion du catalogue et des commandes." },
      { name: "robots", content: "noindex" },
    ],
  }),
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
  const [files, setFiles] = useState<File[]>([]);

  // Fetch Products
  const { data: items = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchProducts,
  });

  // Fetch Orders
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Product Mutations
  const createProduct = useMutation({
    mutationFn: async () => {
      if (!form.title.trim()) throw new Error("Le nom du produit est obligatoire.");

      let imagePath = null;
      if (files.length > 0) {
        const uploadedPaths = await Promise.all(files.map((f) => uploadProductPhoto(f)));
        imagePath = uploadedPaths.join(",");
      }

      const cleanSpecs = specs
        .filter((row) => row.label.trim() && row.value.trim())
        .map((row) => [row.label.trim(), row.value.trim()]);
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
      setFiles([]);
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

  // Order Mutations
  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Statut de la commande mis à jour");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error: Error) => toast.error(error.message || "La mise à jour a échoué"),
  });

  const inStockCount = items.filter((i) => i.stock === "in_stock").length;
  const lowStockCount = items.length - inStockCount;

  return (
    <div className="min-h-screen bg-muted/30 pb-12 pt-8">
      <div className="site-container">
        {/* Header Dashboard */}
        <div className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
            Tableau de bord
          </p>
          <h1 className="mt-2 font-display text-3xl font-black uppercase sm:text-4xl">
            Administration
          </h1>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8 grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="products">Produits ({items.length})</TabsTrigger>
            <TabsTrigger value="orders">Commandes ({orders.length})</TabsTrigger>
          </TabsList>

          {/* TAB: PRODUITS */}
          <TabsContent value="products" className="space-y-8">
            {/* Statistiques Rapides */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
                  <Package className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{items.length}</div>
                  <p className="text-xs text-muted-foreground">Dans le catalogue en ligne</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Stock</CardTitle>
                  <CheckCircle2 className="size-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inStockCount}</div>
                  <p className="text-xs text-muted-foreground">Disponibilité immédiate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sur commande</CardTitle>
                  <AlertCircle className="size-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{lowStockCount}</div>
                  <p className="text-xs text-muted-foreground">Stock limité ou à commander</p>
                </CardContent>
              </Card>
            </div>

            {/* Layout Principal */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Formulaire d'Ajout (Colonne 1) */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="font-display font-black uppercase">
                      Nouveau Produit
                    </CardTitle>
                    <CardDescription>Ajoutez un article au catalogue.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      className="grid gap-5"
                      onSubmit={(event) => {
                        event.preventDefault();
                        createProduct.mutate();
                      }}
                    >
                      <div className="grid gap-2">
                        <Label htmlFor="title">Nom du produit *</Label>
                        <Input
                          id="title"
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          maxLength={120}
                          placeholder="Ex: Motopompe CP 158"
                          required
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="brand">Marque</Label>
                          <Input
                            id="brand"
                            value={form.brand}
                            onChange={(e) => setForm({ ...form, brand: e.target.value })}
                            maxLength={60}
                            placeholder="Pedrollo"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="sku">Réf.</Label>
                          <Input
                            id="sku"
                            value={form.sku}
                            onChange={(e) => setForm({ ...form, sku: e.target.value })}
                            maxLength={40}
                            placeholder="PED-CP158"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="category">Rayon</Label>
                        <select
                          id="category"
                          value={form.categorySlug}
                          onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {categories.map((category) => (
                            <option key={category.slug} value={category.slug}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="stock">Disponibilité</Label>
                        <select
                          id="stock"
                          value={form.stock}
                          onChange={(e) =>
                            setForm({ ...form, stock: e.target.value as StockValue })
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {Object.entries(stockLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-2">
                        <Label>Prix de vente</Label>
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={form.quoteOnly}
                            onChange={(e) => setForm({ ...form, quoteOnly: e.target.checked })}
                            className="rounded border-input text-primary focus:ring-primary"
                          />{" "}
                          Afficher « Sur devis »
                        </label>
                        {!form.quoteOnly && (
                          <Input
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            maxLength={40}
                            placeholder="850 000 FCFA"
                          />
                        )}
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          maxLength={800}
                          rows={3}
                          placeholder="Présentation du produit…"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Caractéristiques</Label>
                        {specs.map((row, index) => (
                          <div key={index} className="grid grid-cols-2 gap-2">
                            <Input
                              value={row.label}
                              maxLength={40}
                              placeholder="Ex: Puissance"
                              onChange={(e) =>
                                setSpecs(
                                  specs.map((item, i) =>
                                    i === index ? { ...item, label: e.target.value } : item,
                                  ),
                                )
                              }
                            />
                            <Input
                              value={row.value}
                              maxLength={60}
                              placeholder="Ex: 1.5 HP"
                              onChange={(e) =>
                                setSpecs(
                                  specs.map((item, i) =>
                                    i === index ? { ...item, value: e.target.value } : item,
                                  ),
                                )
                              }
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full mt-1"
                          onClick={() => setSpecs([...specs, { label: "", value: "" }])}
                        >
                          <Plus className="mr-2 size-4" /> Ajouter une caractéristique
                        </Button>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="photos">Photos du produit (Plusieurs possibles)</Label>
                        <div className="rounded-md border border-dashed border-input p-4 text-center">
                          <Input
                            id="photos"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                            className="hidden"
                          />
                          <Label
                            htmlFor="photos"
                            className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                          >
                            {files.length > 0 ? (
                              <span className="font-medium text-foreground">
                                {files.length} fichier(s) sélectionné(s)
                              </span>
                            ) : (
                              <span>Cliquez pour sélectionner des images</span>
                            )}
                          </Label>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full font-bold"
                        disabled={createProduct.isPending}
                      >
                        {createProduct.isPending ? (
                          <Loader2 className="mr-2 animate-spin" />
                        ) : (
                          <Upload className="mr-2 size-4" />
                        )}{" "}
                        Publier le produit
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Liste des Produits (Colonnes 2-3) */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="font-display font-black uppercase">
                      Inventaire en Ligne
                    </CardTitle>
                    <CardDescription>
                      Consultez et supprimez les articles actuellement publiés.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingProducts ? (
                      <div className="flex justify-center p-8">
                        <Loader2 className="size-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : items.length === 0 ? (
                      <div className="rounded-lg border border-dashed p-12 text-center">
                        <Package className="mx-auto size-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-bold">Aucun produit publié</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Utilisez le formulaire pour ajouter votre premier produit au catalogue.
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="w-[80px]">Photo</TableHead>
                              <TableHead>Produit</TableHead>
                              <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                              <TableHead>Stock</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {items.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>
                                  <img
                                    src={product.image}
                                    alt=""
                                    className="size-10 rounded object-cover border"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  {product.title}
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {product.price}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                  {product.category}
                                </TableCell>
                                <TableCell>
                                  {product.stock === "in_stock" ? (
                                    <Badge
                                      variant="default"
                                      className="bg-success text-success-foreground hover:bg-success/90"
                                    >
                                      En stock
                                    </Badge>
                                  ) : product.stock === "limited" ? (
                                    <Badge
                                      variant="secondary"
                                      className="bg-orange-500 text-white hover:bg-orange-600"
                                    >
                                      Stock limité
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive">Sur commande</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => removeProduct.mutate(product.id)}
                                    disabled={removeProduct.isPending}
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB: COMMANDES */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="font-display font-black uppercase flex items-center gap-2">
                  <ShoppingBag className="size-5" /> Liste des Commandes
                </CardTitle>
                <CardDescription>Gérez les commandes passées depuis le panier.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-12 text-center">
                    <ShoppingBag className="mx-auto size-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-bold">Aucune commande pour le moment</h3>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Date</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Articles</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => {
                          const date = new Date(order.created_at).toLocaleDateString("fr-SN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                          const itemsList = order.items as any[];

                          return (
                            <TableRow key={order.id}>
                              <TableCell className="text-sm whitespace-nowrap">{date}</TableCell>
                              <TableCell>
                                <p className="font-bold">{order.customer_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {order.customer_phone}
                                </p>
                              </TableCell>
                              <TableCell className="text-sm">
                                <div className="font-medium mb-1">{itemsList.length} article(s)</div>
                                <ul className="text-xs text-muted-foreground list-disc pl-2">
                                  {itemsList.map((item: any, i: number) => (
                                    <li key={i}>{item.quantity}x {item.title}</li>
                                  ))}
                                </ul>
                              </TableCell>
                              <TableCell className="font-bold whitespace-nowrap">
                                {order.total_price}
                              </TableCell>
                              <TableCell>
                                {order.status === "pending" ? (
                                  <Badge
                                    variant="outline"
                                    className="text-amber-600 border-amber-600"
                                  >
                                    En attente
                                  </Badge>
                                ) : order.status === "delivered" ? (
                                  <Badge className="bg-success text-success-foreground">
                                    Livrée
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive">Annulée</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {order.status === "pending" && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-success text-success hover:bg-success hover:text-success-foreground"
                                        onClick={() =>
                                          updateOrderStatus.mutate({
                                            id: order.id,
                                            status: "delivered",
                                          })
                                        }
                                      >
                                        Valider
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={() =>
                                          updateOrderStatus.mutate({
                                            id: order.id,
                                            status: "cancelled",
                                          })
                                        }
                                      >
                                        Annuler
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
