
interface ScrapedRecipe {
  title?: string;
  ingredients?: string[];
  image?: string;
  instructions?: string[];
}

export async function scrapeRecipe(url: string): Promise<ScrapedRecipe | null> {
  try {
    console.log("Attempting to scrape recipe from URL:", url);
    
    // Use the new recipe scraper API
    const response = await fetch('https://b0b8d8dc-e78d-47d1-afe9-e21296de19ac-00-35giat6k1wqxr.spock.replit.dev/chain-recipe-scraper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      console.error("Failed to fetch recipe data:", response.status, response.statusText);
      throw new Error('Failed to fetch recipe data');
    }
    
    const data = await response.json();
    
    // Handle error from the service
    if (data.error) {
      console.error("Error from recipe scraper:", data.error);
      return null;
    }
    
    // Log results for debugging
    console.log("Scraped recipe:", { 
      title: data.title, 
      ingredientsCount: data.ingredients?.length, 
      instructionsCount: data.instructions?.length,
      hasImage: !!data.image_url 
    });
    
    return {
      title: data.title,
      ingredients: data.ingredients,
      image: data.image_url,
      instructions: data.instructions
    };
  } catch (error) {
    console.error("Error scraping recipe:", error);
    return null;
  }
}
