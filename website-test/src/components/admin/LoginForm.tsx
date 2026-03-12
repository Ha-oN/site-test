'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface LoginFormProps {
  onSuccess: (session: any) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });

    if (authErr) {
      setError("Erreur : " + authErr.message);
    } else if (data.user?.app_metadata?.role === 'admin') {
      onSuccess(data.session);
    } else {
      setError("Accès refusé : Admin uniquement.");
      await supabase.auth.signOut();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-white p-4">
      <form onSubmit={handleLogin} className="p-8 border border-zinc-800 rounded-3xl w-full max-w-md bg-zinc-900/50">
        <h1 className="text-3xl font-black italic mb-6 text-center tracking-tighter">ADMIN ACCESS</h1>
        {error && (
          <p className="text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-sm mb-4 text-center">
            {error}
          </p>
        )}
        <input 
          type="email" 
          placeholder="EMAIL" 
          className="w-full p-4 mb-3 bg-black border border-zinc-800 rounded-xl focus:outline-none focus:border-white transition-colors" 
          onChange={e => setEmail(e.target.value)} 
          required
        />
        <input 
          type="password" 
          placeholder="PASSWORD" 
          className="w-full p-4 mb-6 bg-black border border-zinc-800 rounded-xl focus:outline-none focus:border-white transition-colors" 
          onChange={e => setPassword(e.target.value)} 
          required
        />
        <button 
          disabled={loading}
          className="w-full bg-white text-black py-4 rounded-xl font-black hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {loading ? 'CHARGEMENT...' : 'CONNEXION'}
        </button>
      </form>
    </div>
  );
}