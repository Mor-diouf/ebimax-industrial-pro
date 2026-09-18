import safesLight from "@/assets/store/boutique-coffres-clairs.jpeg.asset.json";
import safesGas from "@/assets/store/boutique-coffres-gaz.jpeg.asset.json";
import tools from "@/assets/store/boutique-outillage.jpeg.asset.json";
import shelves from "@/assets/store/boutique-rayonnages.jpeg.asset.json";
import solar from "@/assets/store/boutique-solaire.jpeg.asset.json";
import pumps from "@/assets/store/boutique-pompes.jpeg.asset.json";
import generators from "@/assets/store/boutique-groupes.jpeg.asset.json";
import pedrollo from "@/assets/store/boutique-pedrollo.jpeg.asset.json";
import storefront from "@/assets/store/boutique-devanture.jpeg.asset.json";
import ab619 from "@/assets/store/boutique-ab619.jpeg.asset.json";
import ab619Logo from "@/assets/store/boutique-logo-ab619.jpeg.asset.json";

export type StorePhoto = { src: string; title: string; alt: string; featured?: boolean };

export const storeGallery: StorePhoto[] = [
  { src: shelves.url, title: "Rayonnages & pièces", alt: "Rayonnages remplis de pièces et équipements dans la boutique EBImax", featured: true },
  { src: storefront.url, title: "Notre devanture", alt: "Devanture bleue et jaune de la quincaillerie à Dakar" },
  { src: pumps.url, title: "Pompes & groupes", alt: "Pompes, motopompes et groupes électrogènes exposés chez EBImax" },
  { src: safesGas.url, title: "Coffres & gaz", alt: "Coffres-forts et gaz réfrigérants disponibles dans la boutique EBImax" },
  { src: tools.url, title: "Outillage professionnel", alt: "Outillage, équipements de protection et accessoires en rayon chez EBImax" },
  { src: solar.url, title: "Énergie solaire", alt: "Onduleurs, batteries et équipements solaires disponibles chez EBImax" },
  { src: ab619.url, title: "Groupes & solaire AB619", alt: "Affiche AB619 présentant groupes électriques, moteurs et panneaux solaires" },
  { src: generators.url, title: "Énergie & chantier", alt: "Groupes électrogènes, motopompes et fournitures de chantier chez EBImax" },
  { src: pedrollo.url, title: "Pompes Pedrollo", alt: "Pompes Pedrollo et compresseurs exposés dans la boutique EBImax" },
  { src: ab619Logo.url, title: "Entreprise AB619", alt: "Logo de l'entreprise AB619 Elektrikasyon" },
  { src: safesLight.url, title: "Coffres électroniques", alt: "Coffres-forts électroniques disponibles en stock chez EBImax" },
];
