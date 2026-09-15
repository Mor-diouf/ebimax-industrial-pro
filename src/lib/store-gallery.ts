import safesLight from "@/assets/store/boutique-coffres-clairs.jpeg.asset.json";
import safesGas from "@/assets/store/boutique-coffres-gaz.jpeg.asset.json";
import tools from "@/assets/store/boutique-outillage.jpeg.asset.json";
import shelves from "@/assets/store/boutique-rayonnages.jpeg.asset.json";
import solar from "@/assets/store/boutique-solaire.jpeg.asset.json";
import pumps from "@/assets/store/boutique-pompes.jpeg.asset.json";
import generators from "@/assets/store/boutique-groupes.jpeg.asset.json";
import pedrollo from "@/assets/store/boutique-pedrollo.jpeg.asset.json";

export const storeGallery = [
  { src: shelves.url, title: "Rayonnages & pièces", alt: "Rayonnages remplis de pièces et équipements dans la boutique EBImax", featured: true },
  { src: pumps.url, title: "Pompes & groupes", alt: "Pompes, motopompes et groupes électrogènes exposés chez EBImax" },
  { src: safesGas.url, title: "Coffres & gaz", alt: "Coffres-forts et gaz réfrigérants disponibles dans la boutique EBImax" },
  { src: tools.url, title: "Outillage professionnel", alt: "Outillage, équipements de protection et accessoires en rayon chez EBImax" },
  { src: solar.url, title: "Énergie solaire", alt: "Onduleurs, batteries et équipements solaires disponibles chez EBImax" },
  { src: generators.url, title: "Énergie & chantier", alt: "Groupes électrogènes, motopompes et fournitures de chantier chez EBImax" },
  { src: pedrollo.url, title: "Pompes Pedrollo", alt: "Pompes Pedrollo et compresseurs exposés dans la boutique EBImax" },
  { src: safesLight.url, title: "Coffres électroniques", alt: "Coffres-forts électroniques disponibles en stock chez EBImax" },
] as const;