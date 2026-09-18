import { supabase } from "@/integrations/supabase/client";
import { categories, type CategorySlug } from "@/lib/catalog";

export type StockValue = "in_stock" | "low_stock" | "on_demand";

export const stockLabels: Record<StockValue, string> = {
  in_stock: "En stock magasin",
  low_stock: "Stock limité",
  on_demand: "Sur commande (48h)",
};

export type DisplayProduct = {
  id: string;
  title: string;
  brand: string;
  sku: string;
  category: string;
  categorySlug: CategorySlug;
  price: string;
  stock: string;
  stockLabel: string;
  description?: string;
  image: string;
  images: string[];
  specs: ReadonlyArray<readonly [string, string]>;
};

export type StoredProduct = {
  id: string;
  title: string;
  brand: string;
  sku: string;
  category_slug: string;
  price: string;
  stock: string;
  description: string;
  specs: unknown;
  image_url: string | null;
  created_at: string;
};

const FALLBACK_IMAGE = categories[2].image;

function parseSpecs(value: unknown): ReadonlyArray<readonly [string, string]> {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row): row is [string, string] => Array.isArray(row) && row.length === 2)
    .map(([label, val]) => [String(label), String(val)] as const);
}

export function toDisplayProduct(row: StoredProduct, signedUrls?: string[]): DisplayProduct {
  const category = categories.find((item) => item.slug === row.category_slug);
  const stock = (row.stock as StockValue) in stockLabels ? (row.stock as StockValue) : "in_stock";
  const validSignedUrls = (signedUrls?.filter(Boolean) as string[]) || [];

  return {
    id: row.id,
    title: row.title,
    brand: row.brand || "EBImax",
    sku: row.sku || "—",
    category: category?.name ?? "Catalogue",
    categorySlug: (category?.slug ?? categories[0].slug) as CategorySlug,
    price: row.price || "Sur devis",
    stock,
    stockLabel: stockLabels[stock],
    description: row.description,
    image:
      validSignedUrls.length > 0
        ? validSignedUrls[0]
        : (row.image_url?.split(",")[0] ?? FALLBACK_IMAGE),
    images:
      validSignedUrls.length > 0
        ? validSignedUrls
        : row.image_url
          ? row.image_url.split(",")
          : [FALLBACK_IMAGE],
    specs: parseSpecs(row.specs),
  };
}

export async function signPhoto(path: string | null): Promise<string | undefined> {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  const { data } = await supabase.storage
    .from("product-photos")
    .createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl;
}

export async function fetchProducts(): Promise<DisplayProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as unknown as StoredProduct[];

  const signed = await Promise.all(
    rows.map(async (row) => {
      if (!row.image_url) return [];
      const paths = row.image_url.split(",");
      const signedPaths = await Promise.all(paths.map((p) => signPhoto(p.trim())));
      return signedPaths.filter(Boolean) as string[];
    }),
  );

  return rows.map((row, index) => toDisplayProduct(row, signed[index]));
}

export async function uploadProductPhoto(file: File): Promise<string> {
  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from("product-photos")
    .upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}
