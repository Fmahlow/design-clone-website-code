import { useEffect, useState } from 'react';

export interface Generation {
  id: string;
  image: string;
  date: string;
}

const STORAGE_KEY = 'generations';

export default function useGenerations() {
  const [generations, setGenerations] = useState<Generation[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setGenerations(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const save = (items: Generation[]) => {
    setGenerations(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write errors
    }
  };

  const addGeneration = (image: string) => {
    const gen: Generation = { id: Date.now().toString(), image, date: new Date().toISOString() };
    const updated = [gen, ...generations];
    save(updated);
  };

  return {
    generations,
    addGeneration,
  };
}
