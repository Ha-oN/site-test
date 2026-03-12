import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useCollections() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCollections = async () => {
    const { data } = await supabase.from('collections').select('*').order('id', { ascending: false });
    if (data) setCollections(data);
  };

  const deleteCollection = async (id: number) => {
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (!error) fetchCollections();
    return { error };
  };

  // Ajoute ici tes fonctions handleSubmit, upload, etc.

  return { collections, fetchCollections, deleteCollection, loading };
}