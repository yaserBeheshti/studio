'use client';

import type { FC } from 'react';
import React, { useState, useCallback } from 'react';
import { SearchFilters, type SearchCriteria } from '@/components/search/SearchFilters';
import { SearchResults, type CarMessage } from '@/components/search/SearchResults';
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/toaster"

const initialFilters: SearchCriteria = {
  color: '',
  model: '',
  type: '',
  minPrice: 0,
  maxPrice: 100000,
};

const HomePage: FC = () => {
  const [filters, setFilters] = useState<SearchCriteria>(initialFilters);
  const [searchResults, setSearchResults] = useState<CarMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false); // Track if a search has been performed

  // Dummy fetch function - replace with actual API call or fake service
  const fakeFetchMessages = useCallback(async (criteria: SearchCriteria): Promise<CarMessage[]> => {
    console.log('Searching with criteria:', criteria);
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Basic mock data generation - refine as needed
    const mockData: CarMessage[] = [
      { id: '1', model: 'Toyota Camry', color: 'Silver', type: 'Sedan', price: 25000, snippet: 'Slightly used Toyota Camry, great condition. Low mileage.', imageUrl: `https://picsum.photos/seed/1/400/300`, timestamp: new Date(Date.now() - Math.random() * 1000000000) },
      { id: '2', model: 'Honda CR-V', color: 'Blue', type: 'SUV', price: 32000, snippet: 'Family-friendly Honda CR-V available now. spacious interior.', imageUrl: `https://picsum.photos/seed/2/400/300`, timestamp: new Date(Date.now() - Math.random() * 1000000000) },
      { id: '3', model: 'Ford F-150', color: 'Black', type: 'Truck', price: 45000, snippet: 'Powerful Ford F-150, perfect for work. Towing package included.', imageUrl: `https://picsum.photos/seed/3/400/300`, timestamp: new Date(Date.now() - Math.random() * 1000000000) },
      { id: '4', model: 'Tesla Model 3', color: 'White', type: 'Sedan', price: 55000, snippet: 'Electric Tesla Model 3 Long Range. Autopilot included.', imageUrl: `https://picsum.photos/seed/4/400/300`, timestamp: new Date(Date.now() - Math.random() * 1000000000) },
      { id: '5', model: 'BMW X5', color: 'Gray', type: 'SUV', price: 65000, snippet: 'Luxury BMW X5 with premium package. Low mileage.', imageUrl: `https://picsum.photos/seed/5/400/300`, timestamp: new Date(Date.now() - Math.random() * 1000000000) },
    ];

     // Simple filtering logic (expand this for better matching)
     const filteredData = mockData.filter(message => {
      const matchColor = !criteria.color || message.color.toLowerCase().includes(criteria.color.toLowerCase());
      const matchModel = !criteria.model || message.model.toLowerCase().includes(criteria.model.toLowerCase());
      const matchType = !criteria.type || message.type.toLowerCase() === criteria.type.toLowerCase();
      const matchPrice = message.price >= criteria.minPrice && message.price <= criteria.maxPrice;
      return matchColor && matchModel && matchType && matchPrice;
    });

    setIsLoading(false);
    return filteredData;
  }, []);


  const handleSearch = useCallback(async (newFilters: SearchCriteria) => {
    setFilters(newFilters);
    setHasSearched(true); // Mark that a search has been initiated
    const results = await fakeFetchMessages(newFilters);
    setSearchResults(results);
  }, [fakeFetchMessages]);


  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Telegram Auto Finder</h1>
        <p className="text-muted-foreground">Find car deals from Telegram messages</p>
      </header>

      <div className="w-full max-w-4xl mb-8">
         <SearchFilters onSearch={handleSearch} initialFilters={initialFilters} isLoading={isLoading} />
      </div>

      <Separator className="w-full max-w-4xl mb-8" />

      <div className="w-full max-w-4xl flex-grow">
        <SearchResults results={searchResults} isLoading={isLoading} hasSearched={hasSearched} />
      </div>
       <Toaster />
    </div>
  );
};

export default HomePage;
