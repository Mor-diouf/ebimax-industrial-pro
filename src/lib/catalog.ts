import energyImage from "@/assets/category-energy.jpg";
import pumpsImage from "@/assets/category-pumps.jpg";
import toolsImage from "@/assets/category-tools.jpg";
import safesImage from "@/assets/category-safes.jpg";
import gasImage from "@/assets/category-gas.jpg";
import pedrolloImage from "@/assets/product-pedrollo.jpg";
import kporImage from "@/assets/product-kpor.jpg";
import drillImage from "@/assets/product-drill.jpg";
import safeImage from "@/assets/product-safe.jpg";

export const store = {
  name: "EBImax Technique",
  tagline: "Équipements industriels, énergie et outillage professionnel",
  phone: "+221 875 865 650",
  whatsapp: "221875865650",
};

export const categories = [
  { id: "cat-1", name: "Énergie & Solaire", shortName: "Énergie & Solaire", slug: "energie-solaire", image: energyImage, count: 14 },
  { id: "cat-2", name: "Pompes à Eau & Irrigation", shortName: "Pompes & Eau", slug: "pompes-eau", image: pumpsImage, count: 22 },
  { id: "cat-3", name: "Outillage & Chantier", shortName: "Outillage & Chantier", slug: "outillage-chantier", image: toolsImage, count: 35 },
  { id: "cat-4", name: "Sécurité & Coffres-forts", shortName: "Sécurité & Coffres", slug: "securite-coffres", image: safesImage, count: 8 },
  { id: "cat-5", name: "Gaz Réfrigérants", shortName: "Gaz & Froid", slug: "gaz-froid", image: gasImage, count: 10 },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export const products = [
  {
    id: "prod-01", title: "Motopompe Pedrollo CP 158", brand: "Pedrollo", sku: "PED-CP158",
    category: "Pompes à Eau & Irrigation", categorySlug: "pompes-eau" as CategorySlug,
    price: "Sur devis", quoteOnly: true, stock: "in_stock", stockLabel: "En stock magasin", image: pedrolloImage,
    specs: [["Puissance", "1.5 HP"], ["Débit max", "160 L/min"], ["Alimentation", "220V"]],
  },
  {
    id: "prod-02", title: "Groupe Électrogène KPOR Diesel", brand: "KPOR", sku: "KPO-KDE5000",
    category: "Énergie & Solaire", categorySlug: "energie-solaire" as CategorySlug,
    price: "850 000 FCFA", quoteOnly: false, stock: "in_stock", stockLabel: "En stock magasin", image: kporImage,
    specs: [["Puissance", "5 kVA"], ["Carburant", "Diesel"], ["Démarrage", "Électrique"]],
  },
  {
    id: "prod-03", title: "Perceuse & Marteau Piqueur EBImax", brand: "EBImax", sku: "EBI-ROT2071",
    category: "Outillage & Chantier", categorySlug: "outillage-chantier" as CategorySlug,
    price: "65 000 FCFA", quoteOnly: false, stock: "low_stock", stockLabel: "Stock limité", image: drillImage,
    specs: [["Puissance", "1300W"], ["Fréquence", "50-60Hz"], ["Mandrin", "SDS-Plus"]],
  },
  {
    id: "prod-04", title: "Coffre-fort Électronique Blindé", brand: "EBImax", sku: "SAF-DIG-04",
    category: "Sécurité & Coffres-forts", categorySlug: "securite-coffres" as CategorySlug,
    price: "Sur devis", quoteOnly: true, stock: "on_demand", stockLabel: "Sur commande (48h)", image: safeImage,
    specs: [["Type", "Clavier numérique + Clé"], ["Sécurité", "Double gâche en acier"], ["Poids", "45 kg"]],
  },
] as const;

export function whatsappUrl(product?: string) {
  const message = product
    ? `Bonjour EBImax Technique, je souhaite demander un devis pour : ${product}.`
    : "Bonjour EBImax Technique, je souhaite obtenir un devis.";
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
}