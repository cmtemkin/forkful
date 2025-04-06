
interface ScrapedRecipe {
  title: string;
  ingredients: string[];
  image?: string;
}

export async function scrapeRecipe(url: string): Promise<ScrapedRecipe | null> {
  try {
    // In a production app, this would call a backend API
    // For now, we'll simulate scraping with a frontend request
    
    console.log("Attempting to scrape recipe from URL:", url);
    
    // Use a CORS proxy to fetch the recipe page
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      console.error("Failed to fetch URL content:", response.status, response.statusText);
      throw new Error('Failed to fetch recipe page');
    }
    
    const data = await response.json();
    
    if (!data.contents) {
      console.error("No content returned from URL");
      throw new Error('No content returned from the URL');
    }
    
    // Parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, 'text/html');
    
    // Extract recipe details based on common patterns
    // Note: This is a simplified approach and will need refinement for production
    
    // Try to find title (looking for common schema formats and fallbacks)
    let title = '';
    
    // Look for schema.org Recipe markup
    const schemaScripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
    let recipeSchema = null;
    
    for (const script of schemaScripts) {
      if (!script.textContent) continue;
      
      try {
        const parsed = JSON.parse(script.textContent);
        
        // Handle single recipe objects
        if (parsed["@type"] === "Recipe") {
          recipeSchema = parsed;
          break;
        }
        
        // Handle arrays of schemas (@graph)
        if (Array.isArray(parsed["@graph"])) {
          const recipeObj = parsed["@graph"].find((item: any) => item["@type"] === "Recipe");
          if (recipeObj) {
            recipeSchema = recipeObj;
            break;
          }
        }
      } catch (e) {
        console.error("Error parsing JSON-LD schema:", e);
        // Continue to next script tag if this one fails
      }
    }
    
    // Extract title from schema
    if (recipeSchema && recipeSchema.name) {
      title = recipeSchema.name;
    }
    
    // Fallback to common title patterns if schema didn't work
    if (!title) {
      // Try common heading patterns
      const headings = doc.querySelectorAll('h1');
      for (const heading of headings) {
        if (heading.textContent && heading.textContent.trim().length > 0) {
          title = heading.textContent.trim();
          break;
        }
      }
    }
    
    // Extract ingredients (multiple approaches)
    let ingredients: string[] = [];
    
    // Try to find ingredients from schema
    if (recipeSchema && recipeSchema.recipeIngredient) {
      if (Array.isArray(recipeSchema.recipeIngredient)) {
        ingredients = recipeSchema.recipeIngredient;
      } else if (typeof recipeSchema.recipeIngredient === 'string') {
        ingredients = [recipeSchema.recipeIngredient];
      }
    }
    
    // Fallback: Look for common ingredient patterns
    if (ingredients.length === 0) {
      // Look for lists within sections that might contain "ingredient" in the class or ID
      const potentialLists = Array.from(doc.querySelectorAll('ul, ol')).slice(0, 10); // Limit search to avoid performance issues
      
      for (const list of potentialLists) {
        const parentEl = list.parentElement;
        const listItems = list.querySelectorAll('li');
        
        // Check if this list or its parent has "ingredient" in the class/id
        const listClassHasIngredient = list.className.toLowerCase().includes('ingredient');
        const listIdHasIngredient = list.id.toLowerCase().includes('ingredient');
        const parentHasIngredient = parentEl && (
          (parentEl.className && parentEl.className.toLowerCase().includes('ingredient')) ||
          (parentEl.id && parentEl.id.toLowerCase().includes('ingredient'))
        );
        
        if ((listClassHasIngredient || listIdHasIngredient || parentHasIngredient) && listItems.length > 0) {
          ingredients = Array.from(listItems)
            .map(li => li.textContent?.trim() || '')
            .filter(text => text.length > 0);
          
          if (ingredients.length > 0) {
            break;
          }
        }
      }
    }
    
    // Extract image (multiple approaches)
    let image = '';
    
    // Try schema first
    if (recipeSchema) {
      if (typeof recipeSchema.image === 'string') {
        image = recipeSchema.image;
      } else if (recipeSchema.image && typeof recipeSchema.image === 'object') {
        if (recipeSchema.image.url) {
          image = recipeSchema.image.url;
        } else if (Array.isArray(recipeSchema.image) && recipeSchema.image.length > 0) {
          const firstImage = recipeSchema.image[0];
          image = typeof firstImage === 'string' ? firstImage : firstImage?.url || '';
        }
      }
    }
    
    // Fallback: Look for large images
    if (!image) {
      const images = Array.from(doc.querySelectorAll('img')).slice(0, 20); // Limit search to avoid performance issues
      
      const filteredImages = images.filter(img => {
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt') || '';
        
        // Filter out tiny images, icons, and ads
        return src && 
               !src.includes('icon') && 
               !src.includes('logo') && 
               !src.includes('ad') &&
               !src.includes('pixel') &&
               (img.width > 200 || img.height > 200 || 
                src.includes('jpg') || src.includes('jpeg') || src.includes('png'));
      });
      
      // Try to find an image that relates to the recipe title
      if (filteredImages.length > 0) {
        // Prioritize images that might be recipe images
        const mainImage = filteredImages.find(img => {
          const alt = img.getAttribute('alt') || '';
          const src = img.getAttribute('src') || '';
          
          return (title && alt.includes(title)) || 
                 src.includes('hero') || 
                 src.includes('main') || 
                 src.includes('recipe');
        }) || filteredImages[0]; // Default to first filtered image if no match
        
        image = mainImage.getAttribute('src') || '';
        
        // Handle relative URLs
        if (image && !image.startsWith('http')) {
          try {
            const baseUrl = new URL(url).origin;
            image = image.startsWith('/') ? `${baseUrl}${image}` : `${baseUrl}/${image}`;
          } catch (e) {
            console.error("Error converting relative URL to absolute:", e);
          }
        }
      }
    }
    
    // Log results for debugging
    console.log("Scraped recipe:", { 
      title, 
      ingredientsCount: ingredients.length, 
      hasImage: !!image 
    });
    
    return {
      title: title || 'Untitled Recipe',
      ingredients: ingredients.length ? ingredients : ['No ingredients found'],
      image: image || undefined
    };
  } catch (error) {
    console.error("Error scraping recipe:", error);
    return null;
  }
}
