import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BasicQRForm from "./pages/BasicQRForm";
import SecureQRForm from "./pages/SecureQRForm";
import QRViewer from "./pages/QRViewer";
import DataViewer from "./pages/DataViewer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
    <Routes>
  <Route path="/" element={<Index />} />
  <Route path="/basic" element={<BasicQRForm />} />
  <Route path="/secure" element={<SecureQRForm />} />
  <Route path="/qr/:uuid" element={<QRViewer />} />
  <Route path="/secure/view/:uuid" element={<QRViewer />} /> {/* ✅ Add this */}
  <Route path="/view" element={<DataViewer />} />
  <Route path="*" element={<NotFound />} />
</Routes>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

// qrcode.js is a popular open-source JavaScript library that allows you 
// to generate QR codes easily. It supports cross-browser QR code generation 
// using HTML5 canvas and table tags, and it doesn't have any additional 
// dependencies.