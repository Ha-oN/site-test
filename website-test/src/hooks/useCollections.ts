import { useState, useEffect, useCallback } from 'react'; // Ajoutez useEffect et useCallback
import { supabase } from '@/lib/supabase';

export function useCollections() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Initialisez à true pour éviter le flash "Aucune collection"

  // On utilise useCallback pour pouvoir l'appeler dans useEffect sans boucle infinie
  const fetchCollections = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      if (data) setCollections(data);
    } catch (err) {
      console.error("Erreur chargement collections:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Déclenche le chargement automatique à l'initialisation
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const deleteCollection = async (id: number) => {
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (!error) fetchCollections();
    return { error };
  };

  return { collections, fetchCollections, deleteCollection, loading };
}