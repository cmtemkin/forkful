
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
    
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipe page');
    }
    
    const data = await response.json();
    
    if (!data.contents) {
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
    const schemaScript = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'))
      .find(script => script.textContent?.includes('"@type":"Recipe"'));
      
    if (schemaScript?.textContent) {
      try {
        const schema = JSON.parse(schemaScript.textContent);
        if (schema["@type"] === "Recipe" || (Array.isArray(schema["@graph"]) && 
            schema["@graph"].find((item: any) => item["@type"] === "Recipe"))) {
          const recipeObj = schema["@type"] === "Recipe" ? schema : 
            schema["@graph"].find((item: any) => item["@type"] === "Recipe");
          
          title = recipeObj.name || '';
        }
      } catch (e) {
        console.error("Error parsing JSON-LD schema:", e);
      }
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
    if (schemaScript?.textContent) {
      try {
        const schema = JSON.parse(schemaScript.textContent);
        const recipeObj = schema["@type"] === "Recipe" ? schema : 
          (Array.isArray(schema["@graph"]) ? 
            schema["@graph"].find((item: any) => item["@type"] === "Recipe") : null);
        
        if (recipeObj && recipeObj.recipeIngredient) {
          ingredients = Array.isArray(recipeObj.recipeIngredient) ? 
            recipeObj.recipeIngredient : [recipeObj.recipeIngredient];
        }
      } catch (e) {
        console.error("Error extracting ingredients from schema:", e);
      }
    }
    
    // Fallback: Look for common ingredient patterns
    if (ingredients.length === 0) {
      // Look for lists within sections that might contain "ingredient" in the class or ID
      const potentialLists = doc.querySelectorAll('ul, ol');
      for (const list of potentialLists) {
        const parentEl = list.parentElement;
        const listItems = list.querySelectorAll('li');
        
        // Check if this list or its parent has "ingredient" in the class/id
        if ((list.className.toLowerCase().includes('ingredient') || 
            list.id.toLowerCase().includes('ingredient') ||
            (parentEl && (
              parentEl.className.toLowerCase().includes('ingredient') ||
              parentEl.id.toLowerCase().includes('ingredient')
            ))) && listItems.length > 0) {
            
          ingredients = Array.from(listItems).map(li => li.textContent?.trim() || '')
            .filter(text => text.length > 0);
          break;
        }
      }
    }
    
    // Extract image (multiple approaches)
    let image = '';
    
    // Try schema first
    if (schemaScript?.textContent) {
      try {
        const schema = JSON.parse(schemaScript.textContent);
        const recipeObj = schema["@type"] === "Recipe" ? schema : 
          (Array.isArray(schema["@graph"]) ? 
            schema["@graph"].find((item: any) => item["@type"] === "Recipe") : null);
        
        if (recipeObj) {
          image = recipeObj.image || 
            (recipeObj.image && recipeObj.image.url) || 
            (Array.isArray(recipeObj.image) ? recipeObj.image[0] : '');
        }
      } catch (e) {
        console.error("Error extracting image from schema:", e);
      }
    }
    
    // Fallback: Look for large images
    if (!image) {
      const images = Array.from(doc.querySelectorAll('img'))
        .filter(img => {
          const src = img.getAttribute('src') || '';
          // Filter out tiny images and icons
          return src && !src.includes('icon') && !src.includes('logo') && 
            (img.width > 200 || img.height > 200 || 
            src.includes('jpg') || src.includes('jpeg') || src.includes('png'));
        });
      
      if (images.length > 0) {
        // Prioritize images that might be recipe images
        const mainImage = images.find(img => {
          const src = img.getAttribute('src') || '';
          const alt = img.getAttribute('alt') || '';
          return alt.includes(title) || 
            src.includes('hero') || 
            src.includes('main') || 
            src.includes('recipe');
        }) || images[0];
        
        image = mainImage.getAttribute('src') || '';
        
        // Handle relative URLs
        if (image && !image.startsWith('http')) {
          const baseUrl = new URL(url).origin;
          image = image.startsWith('/') ? `${baseUrl}${image}` : `${baseUrl}/${image}`;
        }
      }
    }
    
    console.log("Scraped recipe:", { title, ingredients: ingredients.length, image: !!image });
    
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
