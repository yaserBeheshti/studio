
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

// Translate car types to Persian
const carTypes = [
  { value: 'sedan', label: 'سدان' },
  { value: 'suv', label: 'شاسی بلند' },
  { value: 'truck', label: 'وانت' },
  { value: 'coupe', label: 'کوپه' },
  { value: 'convertible', label: 'کروک' },
  { value: 'hatchback', label: 'هاچ بک' },
  { value: 'van', label: 'ون' },
];
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
  }, [form.watch]); // Removed form dependency as watch is stable


  function onSubmit(values: z.infer<typeof formSchema>) {
    const searchCriteria: SearchCriteria = {
      color: values.color || '',
      model: values.model || '',
      type: values.type || '', // Already handles '' correctly if 'any' was selected
      minPrice: values.priceRange[0],
      maxPrice: values.priceRange[1],
    };
    onSearch(searchCriteria);
  }

   // Function to format price with commas and currency symbol (adjust if needed)
   const formatPrice = (price: number) => {
    // Consider using Intl.NumberFormat for better localization in the future
    return `$${price.toLocaleString('fa-IR')}`; // Using fa-IR for potential Persian number formatting
   };


  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center gap-2">
            <Search className="w-5 h-5 ml-2" /> {/* Moved icon to the left for RTL */}
            فیلترهای جستجو
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
                    <FormLabel>مدل</FormLabel>
                    <FormControl>
                      <Input placeholder="مثلا کمری، F-150" {...field} />
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
                    <FormLabel>رنگ</FormLabel>
                    <FormControl>
                      <Input placeholder="مثلا نقره‌ای، آبی" {...field} />
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
                    <FormLabel>نوع</FormLabel>
                    {/*
                      - Pass a value prop to Select, mapping empty string form value to "any".
                      - Update onValueChange to map "any" back to empty string for the form state.
                    */}
                    <Select
                      onValueChange={(value) => field.onChange(value === 'any' ? '' : value)} // Map 'any' back to '' for form state
                      value={field.value === '' || field.value === undefined ? 'any' : field.value} // Map empty/undefined form value to "any" for display
                      dir="rtl" // Ensure Select direction is RTL
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="نوع خودرو را انتخاب کنید" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         {/* Change value from "" to "any" to avoid error */}
                         <SelectItem value="any">هر نوع</SelectItem>
                         {carTypes.map((type) => (
                           <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
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
                   <FormLabel>محدوده قیمت: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</FormLabel>
                  <FormControl>
                     <Slider
                        dir="rtl" // Set slider direction to RTL
                        value={field.value} // Use controlled value from RHF
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
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" /> {/* Moved icon to the left */}
                    در حال جستجو...
                  </>
                ) : (
                  <>
                    <Search className="ml-2 h-4 w-4" /> {/* Moved icon to the left */}
                    جستجوی خودرو
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
