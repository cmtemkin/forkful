
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import VotingFeed from "./pages/VotingFeed";
import CalendarView from "./pages/CalendarView";
import AddMeal from "./pages/AddMeal";
import EditMeal from "./pages/EditMeal";
import MealDetail from "./pages/MealDetail";
import GroceryList from "./pages/GroceryList";
import Households from "./pages/Households";
import HouseholdDetail from "./pages/HouseholdDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/feed" replace />} />
            <Route path="feed" element={<VotingFeed />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="add-meal" element={<AddMeal />} />
            <Route path="edit-meal/:id" element={<EditMeal />} />
            <Route path="meal/:id" element={<MealDetail />} />
            <Route path="grocery-list" element={<GroceryList />} />
            <Route path="households" element={<Households />} />
            <Route path="household/:id" element={<HouseholdDetail />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
