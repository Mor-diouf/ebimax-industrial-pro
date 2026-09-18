import pedrolloImage from "@/assets/product-pedrollo.jpg";
import kporImage from "@/assets/product-kpor.jpg";
import drillImage from "@/assets/product-drill.jpg";
import safeImage from "@/assets/product-safe.jpg";

export const store = {
  name: "Quincaillerie SOPE S. FALLOU",
  tagline: "Équipements, électricité, énergie et quincaillerie générale",
  phone: "+221 77 619 19 30",
  whatsapp: "221776191930",
};

export const categories = [
  {
    id: "cat-1",
    name: "Énergie & Solaire",
    shortName: "Énergie & Solaire",
    slug: "energie-solaire",
    image: "/categories/energie.jpg",
    count: 14,
  },
  {
    id: "cat-2",
    name: "Pompes à Eau & Irrigation",
    shortName: "Pompes & Eau",
    slug: "pompes-eau",
    image: "/categories/pompes.jpg",
    count: 22,
  },
  {
    id: "cat-3",
    name: "Outillage & Chantier",
    shortName: "Outillage & Chantier",
    slug: "outillage-chantier",
    image: "/categories/outillage.jpg",
    count: 35,
  },
  {
    id: "cat-4",
    name: "Sécurité & Coffres-forts",
    shortName: "Sécurité & Coffres",
    slug: "securite-coffres",
    image: "/categories/securite.jpg",
    count: 8,
  },
  {
    id: "cat-5",
    name: "Gaz Réfrigérants",
    shortName: "Gaz & Froid",
    slug: "gaz-froid",
    image: "/categories/gaz.jpg",
    count: 10,
  },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export function whatsappUrl(product?: string) {
  const message = product
    ? `Bonjour Quincaillerie SOPE S. FALLOU, je souhaite demander un devis pour : ${product}.`
    : "Bonjour Quincaillerie SOPE S. FALLOU, je souhaite obtenir un devis.";
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
}
