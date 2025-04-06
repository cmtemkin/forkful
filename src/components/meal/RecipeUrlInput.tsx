
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LinkIcon } from 'lucide-react';

export interface RecipeUrlInputProps {
  initialUrl?: string;
  onImageUrl?: (url: string) => void;
  onRecipeUrl?: (url: string) => void;
}

const RecipeUrlInput = ({ initialUrl = '', onImageUrl, onRecipeUrl }: RecipeUrlInputProps) => {
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleImport = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Here would typically be API call to extract recipe
      // For now, we'll simulate a success
      
      // If recipe extraction successful
      if (onRecipeUrl) {
        onRecipeUrl(url);
      }
      
      // If image URL extraction successful
      if (onImageUrl) {
        // For demo, we'll just use a placeholder image
        onImageUrl('https://source.unsplash.com/random/300x200/?food');
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
        />
        <Button 
          onClick={handleImport} 
          disabled={isLoading}
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
