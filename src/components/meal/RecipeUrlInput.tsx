
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LinkIcon } from 'lucide-react';

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
    
    try {
      // In the future, this would call the external service API
      // For now, we'll simulate a success with mock data
      
      const sourceDomain = extractDomain(url);
      
      // Mock response data format that would come from the API
      const mockResponseData = {
        title: "Example Recipe",
        image_url: 'https://source.unsplash.com/random/300x200/?food',
        ingredients: [
          "Ingredient 1",
          "Ingredient 2",
          "Ingredient 3"
        ],
        instructions: [
          "Step 1: Do something",
          "Step 2: Do something else",
          "Step 3: Finish cooking"
        ],
        source_url: url,
        domain: sourceDomain,
        metadata: {
          import_method: "mock_data",
          tags: ["example", "mock"],
          prep_time: "10 minutes"
        }
      };
      
      // If recipe extraction successful
      if (onRecipeUrl) {
        onRecipeUrl(url);
      }
      
      // If image URL extraction successful
      if (onImageUrl && mockResponseData.image_url) {
        onImageUrl(mockResponseData.image_url);
      }
      
      // If we need to pass extracted data back
      if (onScrapedData) {
        onScrapedData({
          title: mockResponseData.title,
          ingredients: mockResponseData.ingredients.join('\n'),
          instructions: mockResponseData.instructions,
          imageUrl: mockResponseData.image_url,
          sourceUrl: mockResponseData.source_url,
          sourceDomain: mockResponseData.domain,
          metadata: mockResponseData.metadata
        });
      }
      
    } catch (err) {
      setError('Failed to import recipe');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-2">
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
          disabled={disabled || isLoading}
          size="sm"
        >
          <LinkIcon className="h-4 w-4 mr-1" />
          Import
        </Button>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      
      <p className="text-gray-500 text-sm">
        Paste a URL to import recipe details automatically
      </p>
    </div>
  );
};

export default RecipeUrlInput;
