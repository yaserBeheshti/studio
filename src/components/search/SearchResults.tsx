'use client';

import type { FC } from 'react';
import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Car, Palette, Tag, CalendarDays } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale'; // Import Persian locale
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


export interface CarMessage {
  id: string;
  model: string;
  color: string;
  type: string;
  price: number;
  snippet: string;
  imageUrl?: string;
  timestamp: Date;
}

interface SearchResultsProps {
  results: CarMessage[];
  isLoading: boolean;
  hasSearched: boolean; // Added prop to know if a search has been performed
}

const ResultCard: FC<{ message: CarMessage }> = ({ message }) => {
  // Format time ago in Persian
  const timeAgo = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true, locale: faIR });

  // Function to format price with commas and currency symbol (adjust if needed)
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`; // Keep dollar sign for now, can be localized later
   };

  return (
    <Card className="w-full overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 bg-card">
      <CardHeader className="p-4 pb-2">
        {message.imageUrl && (
          <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
            <Image
              src={message.imageUrl}
              alt={`${message.model} - ${message.color}`}
              layout="fill"
              objectFit="cover"
              data-ai-hint={`${message.model} ${message.color}`}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <CardTitle className="text-lg font-semibold text-primary">{message.model}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground flex items-center gap-1">
          <CalendarDays className="w-3 h-3 ml-1" /> {/* Added margin for RTL */}
           ارسال شده {timeAgo}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <p className="text-foreground text-base">{message.snippet}</p>
         <div className="flex flex-wrap gap-2 items-center text-sm">
           <Badge variant="secondary" className="flex items-center gap-1">
             <Palette className="w-3 h-3 ml-1" /> {/* Added margin for RTL */}
             {message.color}
           </Badge>
           <Badge variant="secondary" className="flex items-center gap-1">
             <Car className="w-3 h-3 ml-1" /> {/* Added margin for RTL */}
             {message.type}
           </Badge>
         </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center bg-secondary/30">
        <span className="text-lg font-bold text-accent flex items-center gap-1">
           <Tag className="w-4 h-4 ml-1" /> {/* Added margin for RTL */}
           {formatPrice(message.price)}
        </span>
        {/* Add action buttons if needed later, e.g., View on Telegram */}
      </CardFooter>
    </Card>
  );
};

const LoadingSkeleton: FC = () => (
  <Card className="w-full overflow-hidden shadow-sm">
    <CardHeader className="p-4 pb-2">
        <Skeleton className="w-full h-48 mb-4 rounded-md" />
        <Skeleton className="h-6 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="p-4 pt-0 space-y-3">
       <Skeleton className="h-4 w-full" />
       <Skeleton className="h-4 w-5/6" />
       <div className="flex flex-wrap gap-2 items-center">
         <Skeleton className="h-6 w-16 rounded-full" />
         <Skeleton className="h-6 w-20 rounded-full" />
       </div>
    </CardContent>
    <CardFooter className="p-4 pt-0 flex justify-between items-center bg-secondary/30">
      <Skeleton className="h-6 w-24" />
    </CardFooter>
  </Card>
);

export const SearchResults: FC<SearchResultsProps> = ({ results, isLoading, hasSearched }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(6)].map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!hasSearched) {
     return (
        <div className="text-center py-10 text-muted-foreground">
            <p>معیارهای خود را در بالا وارد کرده و برای یافتن خودروها روی جستجو کلیک کنید.</p>
        </div>
     );
  }


  if (results.length === 0) {
    return (
       <Alert variant="default" className="mt-6 bg-secondary">
          <AlertCircle className="h-4 w-4 ml-2" /> {/* Added margin for RTL */}
          <AlertTitle>نتیجه‌ای یافت نشد</AlertTitle>
          <AlertDescription>
            برای نتایج گسترده‌تر، فیلترهای جستجوی خود را تنظیم کنید.
          </AlertDescription>
       </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {results.map((message) => (
        <ResultCard key={message.id} message={message} />
      ))}
    </div>
  );
};
