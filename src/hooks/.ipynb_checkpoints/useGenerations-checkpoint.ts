import { useEffect, useState } from 'react';

export interface Generation {
  id: string;
  image: string;
  mask?: string;
  date: string;
}

const STORAGE_KEY = 'generations';

// Mantém gerações em memória para sincronizar entre instâncias do hook
let globalGenerations: Generation[] | null = null;
const listeners = new Set<(items: Generation[]) => void>();

const loadGenerations = (): Generation[] => {
  if (globalGenerations) return globalGenerations;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      globalGenerations = JSON.parse(stored);
    } else {
      globalGenerations = [];
    }
  } catch {
    globalGenerations = [];
  }
  return globalGenerations;
};

const saveGenerations = (items: Generation[]) => {
  globalGenerations = items;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore write errors
  }
  listeners.forEach(l => l(items));
};

export default function useGenerations() {
  const [generations, setGenerations] = useState<Generation[]>(() => loadGenerations());

  useEffect(() => {
    const listener = (items: Generation[]) => setGenerations(items);
    listeners.add(listener);
    // garantir estado inicial
    setGenerations(loadGenerations());
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const addGeneration = (image: string, mask?: string) => {
    const gen: Generation = { id: Date.now().toString(), image, mask, date: new Date().toISOString() };
    const updated = [gen, ...loadGenerations()];
    saveGenerations(updated);
  };

  return {
    generations,
    addGeneration,
  };
}
