import { useState, useCallback } from 'react';

export function useOpenCategories(initial: { [key: string]: boolean } = {}) {
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>(initial);

  const toggleCategory = useCallback((categoryId: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  }, []);

  return { openCategories, setOpenCategories, toggleCategory };
} 