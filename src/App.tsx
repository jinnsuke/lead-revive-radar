
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import { Event } from "./types/event";

const queryClient = new QueryClient();

const App = () => {
  const [events, setEvents] = useState<Event[]>([]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen bg-white">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/calendar" element={
                <div className="flex min-h-screen bg-white w-full">
                  <Sidebar />
                  <Calendar events={events} />
                </div>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
