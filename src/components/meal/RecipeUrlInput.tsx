
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LinkIcon, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export interface RecipeUrlInputProps {
  initialUrl?: string;
  onImageUrl?: (url: string) => void;
  onRecipeUrl?: (url: string) => void;
  disabled?: boolean;
  onScrapedData?: (data: { 
    title?: string; 
    ingredients?: string; 
    instructions?: string[];
    imageUrl?: string;
    sourceUrl?: string;
    sourceDomain?: string;
    metadata?: Record<string, any>;
  }) => void;
}

// Type definition for recipe scraper response
interface RecipeScraperResponse {
  title?: string;
  ingredients?: string[];
  instructions?: string[];
  image_url?: string;
  source_url?: string;
  domain?: string;
  error?: string;
  metadata?: Record<string, any>;
}

const RecipeUrlInput = ({ 
  initialUrl = '', 
  onImageUrl, 
  onRecipeUrl,
  disabled = false,
  onScrapedData
}: RecipeUrlInputProps) => {
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  
  const extractDomain = (url: string): string => {
    try {
      const domainMatch = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/im);
      return domainMatch ? domainMatch[1] : '';
    } catch (err) {
      return '';
    }
  };
  
  const handleImport = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setShowFallback(false);
    
    try {
      // Call the recipe scraper API with the correct format
      const response = await fetch('https://b0b8d8dc-e78d-47d1-afe9-e21296de19ac-00-35giat6k1wqxr.spock.replit.dev/chain-recipe-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }), // Ensure correct JSON format with url property
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      const data: RecipeScraperResponse = await response.json();
      console.log("Raw API response:", data);
      
      // Handle error or empty data from the service
      if (data.error || (!data.title && !data.ingredients?.length)) {
        console.error("No recipe data found or error:", data.error || "Empty response");
        setShowFallback(true);
        return;
      }
      
      const sourceDomain = data.domain || extractDomain(url);
      
      // If recipe extraction successful
      if (onRecipeUrl) {
        onRecipeUrl(url);
      }
      
      // If image URL extraction successful
      if (onImageUrl && data.image_url) {
        onImageUrl(data.image_url);
      }
      
      // If we need to pass extracted data back
      if (onScrapedData) {
        onScrapedData({
          title: data.title,
          ingredients: data.ingredients?.join('\n'),
          instructions: data.instructions,
          imageUrl: data.image_url,
          sourceUrl: data.source_url || url,
          sourceDomain,
          metadata: data.metadata
        });
      }
      
    } catch (err) {
      console.error('Error importing recipe:', err);
      setShowFallback(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Paste recipe URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
          disabled={disabled || isLoading}
        />
        <Button 
          onClick={handleImport} 
          disabled={disabled || isLoading || !url}
          size="sm"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <LinkIcon className="h-4 w-4 mr-1" />
          )}
          Import
        </Button>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      
      {showFallback && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 mt-2">
          <AlertTitle className="text-base font-semibold">We couldn't find a recipe at that link.</AlertTitle>
          <AlertDescription className="text-sm">
            The page may not contain structured recipe data, or the format wasn't readable.
            You can still enter the recipe manually using the form below.
          </AlertDescription>
        </Alert>
      )}
      
      {!error && !showFallback && (
        <p className="text-gray-500 text-sm">
          Paste a URL to import recipe details automatically
        </p>
      )}
    </div>
  );
};

export default RecipeUrlInput;
