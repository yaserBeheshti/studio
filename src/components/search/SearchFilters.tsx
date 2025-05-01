'use client';

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Search } from 'lucide-react';

export interface SearchCriteria {
  color: string;
  model: string;
  type: string;
  minPrice: number;
  maxPrice: number;
}

interface SearchFiltersProps {
  onSearch: (criteria: SearchCriteria) => void;
  initialFilters: SearchCriteria;
  isLoading: boolean;
}

const formSchema = z.object({
  color: z.string().optional(),
  model: z.string().optional(),
  type: z.string().optional(),
  priceRange: z.array(z.number()).min(2).max(2),
});

const carTypes = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Hatchback', 'Van'];
const MAX_PRICE = 100000; // Define a max price for the slider

export const SearchFilters: FC<SearchFiltersProps> = ({ onSearch, initialFilters, isLoading }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([initialFilters.minPrice, initialFilters.maxPrice]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: initialFilters.color,
      model: initialFilters.model,
      type: initialFilters.type,
      priceRange: [initialFilters.minPrice, initialFilters.maxPrice],
    },
  })

  // Update local state when form's priceRange changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'priceRange' && value.priceRange) {
        setPriceRange(value.priceRange as [number, number]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    const searchCriteria: SearchCriteria = {
      color: values.color || '',
      model: values.model || '',
      type: values.type || '',
      minPrice: values.priceRange[0],
      maxPrice: values.priceRange[1],
    };
    onSearch(searchCriteria);
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Camry, F-150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Silver, Blue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select car type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Any Type</SelectItem>
                        {carTypes.map((type) => (
                           <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="priceRange"
              render={({ field }) => (
                <FormItem>
                   <FormLabel>Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}</FormLabel>
                  <FormControl>
                     <Slider
                        defaultValue={[initialFilters.minPrice, initialFilters.maxPrice]}
                        min={0}
                        max={MAX_PRICE}
                        step={1000}
                        minStepsBetweenThumbs={1}
                        onValueChange={(value) => {
                           field.onChange(value); // Update RHF state
                        }}
                        className="py-2"
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
              {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Cars
                  </>
                )
              }
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
