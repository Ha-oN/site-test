export interface Collection {
  id: number;
  created_at?: string;      // Optionnel, géré par Supabase
  name: string;
  presentation_pic: string; // URL de l'image de couverture
  mots_clefs: string;       // Liste de tags ou description courte
  date_debut: string;       // Format 'YYYY-MM-DD'
  date_fin?: string | null; // Optionnel
  nb_pieces: number;        // Nombre d'articles dans la collection
  active: boolean;          // Si vrai, s'affiche dans le carousel
  theme_name?: string;       
}