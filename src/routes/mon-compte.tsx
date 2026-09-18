import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Package, User, MapPin, Phone, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/mon-compte")({
  head: () => ({
    meta: [
      { title: "Mon Compte — Quincaillerie SOPE S. FALLOU" },
      { name: "robots", content: "noindex" }
    ]
  }),
  component: MonComptePage,
});

function MonComptePage() {
  const navigate = useNavigate();
  const { user, profile, isAdmin, isLoading: authLoading, signOut } = useAuth();

  // If not logged in and done loading, redirect to auth
  if (!authLoading && !user) {
    navigate({ to: "/auth" });
    return null;
  }

  // Fetch Orders for this user
  const { data: myOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-muted/30 py-12 flex justify-center">
        <div className="animate-pulse h-32 w-full max-w-md bg-muted rounded-xl"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const name = user.user_metadata?.first_name 
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
    : user.email;

  return (
    <div className="min-h-screen bg-muted/30 pb-12 pt-8">
      <div className="site-container">
        
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                {isAdmin ? "Espace Administrateur" : "Espace Client"}
              </p>
              <Badge variant={isAdmin ? "default" : "secondary"} className="font-mono text-[10px] uppercase font-bold">
                {isAdmin ? "Admin" : (profile?.role || "Client")}
              </Badge>
            </div>
            <h1 className="mt-2 font-display text-3xl font-black uppercase sm:text-4xl">Bonjour, {user.user_metadata?.first_name || 'Client'}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <Button onClick={() => navigate({ to: "/admin" })} className="bg-primary text-primary-foreground font-bold hover:bg-primary/90">
                <ShieldCheck className="mr-2 size-4" /> Panneau Administration
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout} className="text-muted-foreground">
              <LogOut className="mr-2 size-4" /> Déconnexion
            </Button>
          </div>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="mb-8 grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="orders">Mes commandes</TabsTrigger>
            <TabsTrigger value="profile">Mes informations</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="font-display font-black uppercase flex items-center gap-2">
                  <Package className="size-5" /> Historique de commandes
                </CardTitle>
                <CardDescription>Retrouvez ici toutes vos commandes passées sur notre site.</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="py-8 text-center text-muted-foreground animate-pulse">Chargement de vos commandes...</div>
                ) : myOrders.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-12 text-center">
                    <Package className="mx-auto size-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-bold">Vous n'avez pas encore passé de commande</h3>
                    <p className="mt-2 text-sm text-muted-foreground mb-6">Découvrez notre catalogue pour trouver ce qu'il vous faut.</p>
                    <Button onClick={() => navigate({ to: "/" })}>Voir les produits</Button>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Date</TableHead>
                          <TableHead>Numéro</TableHead>
                          <TableHead>Articles</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myOrders.map((order) => {
                          const date = new Date(order.created_at).toLocaleDateString("fr-SN", {
                            day: "2-digit", month: "short", year: "numeric"
                          });
                          const itemsList = order.items as any[];
                          return (
                            <TableRow key={order.id}>
                              <TableCell className="text-sm whitespace-nowrap">{date}</TableCell>
                              <TableCell className="font-mono text-xs text-muted-foreground">{order.id.split('-')[0].toUpperCase()}</TableCell>
                              <TableCell className="text-sm">
                                <div className="font-medium mb-1">{itemsList.length} article(s)</div>
                                <ul className="text-xs text-muted-foreground list-disc pl-2">
                                  {itemsList.map((item: any, i: number) => (
                                    <li key={i}>{item.quantity}x {item.title}</li>
                                  ))}
                                </ul>
                              </TableCell>
                              <TableCell className="font-bold whitespace-nowrap">{order.total_price}</TableCell>
                              <TableCell>
                                {order.status === "pending" ? (
                                  <Badge variant="outline" className="text-amber-600 border-amber-600">En attente de validation</Badge>
                                ) : order.status === "delivered" ? (
                                  <Badge className="bg-success text-success-foreground">Livrée</Badge>
                                ) : (
                                  <Badge variant="destructive">Annulée</Badge>
                                )}
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

          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display font-black uppercase flex items-center gap-2">
                    <User className="size-5" /> Coordonnées
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom complet</p>
                    <p className="font-medium">{name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rôle attribué</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={isAdmin ? "default" : "secondary"} className="font-mono text-xs uppercase font-bold">
                        {profile?.role || "customer"}
                      </Badge>
                      {isAdmin ? (
                        <span className="text-xs text-muted-foreground">(Accès complet gestion boutique)</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">(Client standard)</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-display font-black uppercase flex items-center gap-2">
                    <MapPin className="size-5" /> Informations de livraison
                  </CardTitle>
                  <CardDescription>Ces informations seront pré-remplies lors de vos prochaines commandes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
                    <p className="text-sm">Pour l'instant, les informations de livraison sont saisies au moment de passer la commande.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
