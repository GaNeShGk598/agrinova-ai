import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ProtectedRoute } from "@/components/protected-route";
import { AppLayout } from "@/components/layout";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import CropPrediction from "@/pages/crop";
import DiseaseDetection from "@/pages/disease";
import Analytics from "@/pages/analytics";
import SmartAlerts from "@/pages/alerts";
import MarketPrices from "@/pages/market";
import Weather from "@/pages/weather";
import FertilizerAdvisor from "@/pages/fertilizer";
import YieldEstimator from "@/pages/yield";
import Profile from "@/pages/profile";

const queryClient = new QueryClient();

function ProtectedLayout({ component: Component }: { component: React.ComponentType }) {
  return (
    <ProtectedRoute component={() => (
      <AppLayout>
        <Component />
      </AppLayout>
    )} />
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/crop"><ProtectedLayout component={CropPrediction} /></Route>
      <Route path="/disease"><ProtectedLayout component={DiseaseDetection} /></Route>
      <Route path="/analytics"><ProtectedLayout component={Analytics} /></Route>
      <Route path="/alerts"><ProtectedLayout component={SmartAlerts} /></Route>
      <Route path="/market"><ProtectedLayout component={MarketPrices} /></Route>
      <Route path="/weather"><ProtectedLayout component={Weather} /></Route>
      <Route path="/fertilizer"><ProtectedLayout component={FertilizerAdvisor} /></Route>
      <Route path="/yield"><ProtectedLayout component={YieldEstimator} /></Route>
      <Route path="/profile"><ProtectedLayout component={Profile} /></Route>
      <Route path="/"><ProtectedLayout component={Dashboard} /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
          <SonnerToaster richColors position="top-right" />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
