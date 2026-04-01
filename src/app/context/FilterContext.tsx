'use client';

import { createContext, useContext, useState } from 'react';

interface BankInfo {
  name: string;
  count: number;
}

interface FilterMeta {
  categories: string[];
  banks: BankInfo[];
  resultsCount: number;
}

interface FilterContextValue {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedBanks: string[];
  setSelectedBanks: (banks: string[] | ((prev: string[]) => string[])) => void;
  isBankModalOpen: boolean;
  setIsBankModalOpen: (open: boolean) => void;
  meta: FilterMeta;
  setMeta: (meta: FilterMeta) => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [meta, setMeta] = useState<FilterMeta>({ categories: ['All'], banks: [], resultsCount: 0 });

  return (
    <FilterContext.Provider value={{
      searchTerm, setSearchTerm,
      selectedCategory, setSelectedCategory,
      selectedBanks, setSelectedBanks,
      isBankModalOpen, setIsBankModalOpen,
      meta, setMeta,
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export const useFilterContext = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilterContext must be used within FilterProvider');
  return ctx;
};
