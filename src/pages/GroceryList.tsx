
import React, { useState, useEffect } from 'react';
import { Clipboard, Trash2, CheckSquare, Square, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '../components/EmptyState';
import { useToast } from '@/hooks/use-toast';
import { SwipeAction } from '../components/SwipeAction';

interface GroceryItem {
  id: string;
  name: string;
  checked: boolean;
  recipe: string;
}

const GroceryList = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load grocery items from localStorage
    const storedItems = localStorage.getItem('chowdown_groceries');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);
  
  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chowdown_groceries', JSON.stringify(items));
  }, [items]);
  
  const toggleItem = (id: string) => {
    if (isEditMode) {
      // In edit mode, toggle selection
      setSelectedItems(prev => 
        prev.includes(id) 
          ? prev.filter(itemId => itemId !== id)
          : [...prev, id]
      );
    } else {
      // Normal mode, toggle checked state
      setItems(items.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      ));
    }
  };
  
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedItems([]);
  };
  
  const deleteSelectedItems = () => {
    if (selectedItems.length === 0) return;
    
    setItems(items.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    
    toast({
      title: "Items deleted",
      description: `${selectedItems.length} items removed from your grocery list.`
    });
  };
  
  const deleteAllItems = () => {
    setItems([]);
    setSelectedItems([]);
    setIsEditMode(false);
    
    toast({
      title: "List cleared",
      description: "All items have been removed from your grocery list."
    });
  };
  
  const handleSwipeDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "Item removed from your grocery list."
    });
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
  
  const selectAll = () => {
    if (selectedItems.length === items.length) {
      // If all are selected, deselect all
      setSelectedItems([]);
    } else {
      // Otherwise, select all
      setSelectedItems(items.map(item => item.id));
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title="No items in your grocery list"
        description="Add ingredients from recipes to generate a grocery list"
        actionLink="/calendar"
        actionText="Go to Calendar"
      />
    );
  }
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b flex justify-between items-center">
        {isEditMode ? (
          <>
            <Button 
              size="sm"
              variant="ghost"
              onClick={toggleEditMode}
              className="text-gray-500"
            >
              <X className="h-5 w-5 mr-1" />
              Cancel
            </Button>
            <h1 className="text-xl font-bold">Select Items</h1>
            <Button 
              size="sm"
              variant="ghost"
              onClick={deleteSelectedItems}
              disabled={selectedItems.length === 0}
              className="text-chow-downvote"
            >
              <Trash2 className="h-5 w-5 mr-1" />
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button 
              size="sm"
              variant="ghost"
              onClick={toggleEditMode}
            >
              <Edit className="h-5 w-5 mr-1" />
              Edit
            </Button>
            <h1 className="text-xl font-bold">Grocery List</h1>
            <Button 
              size="sm"
              variant="ghost"
              onClick={copyToClipboard}
            >
              <Clipboard className="h-5 w-5 mr-1" />
              Copy
            </Button>
          </>
        )}
      </div>
      
      {/* List controls */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
        {isEditMode ? (
          <>
            <Button 
              size="sm"
              variant="ghost"
              onClick={selectAll}
            >
              {selectedItems.length === items.length ? 'Deselect All' : 'Select All'}
            </Button>
            <span className="text-sm font-medium">
              {selectedItems.length} selected
            </span>
          </>
        ) : (
          <>
            <span className="text-sm font-medium">
              {items.filter(i => i.checked).length} of {items.length} items checked
            </span>
            <Button 
              size="sm"
              variant="outline"
              onClick={deleteAllItems}
              className="text-chow-downvote hover:bg-chow-downvote/10 border-chow-downvote/20"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </>
        )}
      </div>
      
      {/* Grocery list */}
      <div className="divide-y">
        {items.map(item => (
          <SwipeAction
            key={item.id}
            onSwipe={() => handleSwipeDelete(item.id)}
            threshold={100}
          >
            <div 
              className="flex items-center px-4 py-3"
              onClick={() => toggleItem(item.id)}
            >
              <div className="mr-3">
                {isEditMode ? (
                  selectedItems.includes(item.id) ? (
                    <CheckSquare className="h-5 w-5 text-chow-primary" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )
                ) : (
                  <div className={`w-5 h-5 border rounded-md flex items-center justify-center ${
                    item.checked ? 'bg-chow-primary border-chow-primary' : 'border-gray-300'
                  }`}>
                    {item.checked && (
                      <svg className="w-3 h-3 text-white" fill="none" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className={`${!isEditMode && item.checked ? 'line-through text-gray-400' : ''}`}>
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">From: {item.recipe}</p>
              </div>
            </div>
          </SwipeAction>
        ))}
      </div>
    </div>
  );
};

export default GroceryList;
