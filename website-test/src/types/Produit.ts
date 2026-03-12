export interface Produit {
  id: number;
  name: string;
  type: string;
  mots_clefs: string;
  prix: number;
  exemplaires: number;
  sold_out: boolean;
  image_url: string;
  collection_id: number; // L'ID de la collection parente
}