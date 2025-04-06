
import React, { useState } from 'react';
import { Clipboard, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '../components/EmptyState';
import { toast } from '@/hooks/use-toast';

const groceryItems = [
  { id: '1', name: 'Fettucine', checked: false, recipe: 'Chicken Alfredo' },
  { id: '2', name: 'Heavy cream', checked: false, recipe: 'Chicken Alfredo' },
  { id: '3', name: 'Parmesan cheese', checked: false, recipe: 'Chicken Alfredo' },
  { id: '4', name: 'Butter', checked: false, recipe: 'Chicken Alfredo' },
];

const GroceryList = () => {
  const [items, setItems] = useState(groceryItems);
  
  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };
  
  const copyToClipboard = () => {
    const text = items.map(item => `- ${item.name}`).join('\n');
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "Your grocery list has been copied to the clipboard."
        });
      },
      () => {
        toast({
          title: "Failed to copy",
          description: "Please try again or manually select the text.",
          variant: "destructive"
        });
      }
    );
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title="No items in your grocery list"
        description="Lock meals in the calendar to automatically generate a grocery list"
        actionLink="/calendar"
        actionText="Go to Calendar"
      />
    );
  }
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b">
        <h1 className="text-2xl font-bold text-center">Grocery List</h1>
      </div>
      
      {/* List controls */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
        <span className="text-sm font-medium">
          {items.filter(i => i.checked).length} of {items.length} items checked
        </span>
        <Button 
          size="sm"
          variant="outline"
          onClick={copyToClipboard}
        >
          <Clipboard className="h-4 w-4 mr-1" />
          Copy List
        </Button>
      </div>
      
      {/* Grocery list */}
      <div className="divide-y">
        {items.map(item => (
          <div 
            key={item.id}
            className="flex items-center px-4 py-3"
            onClick={() => toggleItem(item.id)}
          >
            <div className={`w-5 h-5 border rounded-md mr-3 flex items-center justify-center ${
              item.checked ? 'bg-chow-primary border-chow-primary' : 'border-gray-300'
            }`}>
              {item.checked && (
                <svg className="w-3 h-3 text-white" fill="none" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`${item.checked ? 'line-through text-gray-400' : ''}`}>
                {item.name}
              </p>
              <p className="text-xs text-gray-500">From: {item.recipe}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Generate new list button */}
      <div className="fixed bottom-24 inset-x-0 px-4">
        <Button 
          className="w-full bg-chow-primary hover:bg-chow-primary/90 py-6 rounded-full"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Generate New List
        </Button>
      </div>
    </div>
  );
};

export default GroceryList;
