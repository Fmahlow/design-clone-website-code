import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Index from "./pages/Index";
import EmptyRoom from "./pages/EmptyRoom";
import ChangeObjects from "./pages/ChangeObjects";
import Generations from "./pages/Generations";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import Academy from "./pages/Academy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="empty-room" element={<EmptyRoom />} />
            <Route path="change-objects" element={<ChangeObjects />} />
            <Route path="improve-render" element={<Index />} />
            <Route path="generations" element={<Generations />} />
            <Route path="projects" element={<Projects />} />
            <Route path="academy" element={<Academy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
