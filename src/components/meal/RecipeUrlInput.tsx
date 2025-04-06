
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from "@/hooks/use-toast";
import { scrapeRecipe } from '@/utils/recipeScraperService';

interface RecipeUrlInputProps {
  disabled: boolean;
  onScrapedData: (data: {
    title?: string;
    ingredients?: string;
    imageUrl?: string;
  }) => void;
}

const RecipeUrlInput = ({ disabled, onScrapedData }: RecipeUrlInputProps) => {
  const [recipeUrl, setRecipeUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [lastScrapedUrl, setLastScrapedUrl] = useState("");

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setRecipeUrl(url);
  };
  
  const handleUrlBlur = async () => {
    // Only attempt to scrape if the URL is reasonably valid and different from last scraped URL
    if (
      recipeUrl && 
      recipeUrl.includes('http') && 
      (recipeUrl.includes('.com') || recipeUrl.includes('.org') || recipeUrl.includes('.net')) &&
      recipeUrl !== lastScrapedUrl
    ) {
      await scrapeRecipeData(recipeUrl);
      setLastScrapedUrl(recipeUrl);
    }
  };
  
  const scrapeRecipeData = async (url: string) => {
    if (isScraping) return; // Prevent multiple scraping attempts
    
    setIsScraping(true);
    
    try {
      const scrapedData = await scrapeRecipe(url);
      
      if (scrapedData) {
        // Pass scraped data to parent component
        onScrapedData({
          title: scrapedData.title,
          ingredients: scrapedData.ingredients.join('\n'),
          imageUrl: scrapedData.image
        });
        
        toast({
          title: "Recipe Details Loaded",
          description: "Successfully imported recipe information",
        });
      } else {
        toast({
          title: "Couldn't Load Recipe",
          description: "Please enter recipe details manually",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error scraping recipe:", error);
      toast({
        title: "Error",
        description: "Failed to extract recipe details. Please enter manually.",
        variant: "destructive",
      });
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Recipe URL (optional)</label>
      <div className="relative">
        <Input
          value={recipeUrl}
          onChange={handleUrlChange}
          onBlur={handleUrlBlur}
          placeholder="Paste a link to automatically fetch details"
          type="url"
          disabled={disabled}
        />
        {isScraping && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-chow-primary"></div>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Paste a recipe URL to automatically extract details
      </p>
    </div>
  );
};

export default RecipeUrlInput;
