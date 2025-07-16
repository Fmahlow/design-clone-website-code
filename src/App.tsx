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
import ChangeStyle from "./pages/ChangeStyle";
import Profile, { ProfileOverview } from "./pages/Profile";
import ProfilePersonalData from "./pages/ProfilePersonalData";
import ProfileBilling from "./pages/ProfileBilling";
import ProfileDiamonds from "./pages/ProfileDiamonds";

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
            <Route path="change-style" element={<ChangeStyle />} />
            <Route path="improve-render" element={<Index />} />
            <Route path="generations" element={<Generations />} />
            <Route path="projects" element={<Projects />} />
            <Route path="academy" element={<Academy />} />
            <Route path="profile" element={<Profile />}>
              <Route index element={<ProfileOverview />} />
              <Route path="personal-data" element={<ProfilePersonalData />} />
              <Route path="billing" element={<ProfileBilling />} />
              <Route path="diamonds" element={<ProfileDiamonds />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
