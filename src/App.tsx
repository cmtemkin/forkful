
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import VotingFeed from "./pages/VotingFeed";
import CalendarView from "./pages/CalendarView";
import AddMeal from "./pages/AddMeal";
import MealDetail from "./pages/MealDetail";
import GroceryList from "./pages/GroceryList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<VotingFeed />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="add-meal" element={<AddMeal />} />
            <Route path="meal/:id" element={<MealDetail />} />
            <Route path="grocery-list" element={<GroceryList />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
