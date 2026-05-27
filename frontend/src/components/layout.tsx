import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { LayoutDashboard, Sprout, Microscope, BarChart3, Bell, TrendingUp, Cloud, FlaskConical, Wheat, User, LogOut, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTheme } from "next-themes";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Crop Prediction", url: "/crop", icon: Sprout },
  { title: "Disease Detection", url: "/disease", icon: Microscope },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Smart Alerts", url: "/alerts", icon: Bell },
  { title: "Market Prices", url: "/market", icon: TrendingUp },
  { title: "Weather", url: "/weather", icon: Cloud },
  { title: "Fertilizer Advisor", url: "/fertilizer", icon: FlaskConical },
  { title: "Yield Estimator", url: "/yield", icon: Wheat },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    api.auth.clearSession();
    setLocation("/login");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground overflow-hidden">
        <Sidebar variant="inset">
          <SidebarHeader className="h-16 flex items-center px-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2 font-bold text-xl text-primary w-full">
              <Sprout className="w-6 h-6" />
              <span>AgriNova AI</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location === item.url}>
                        <Link href={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border p-4 space-y-2">
            <SidebarMenu>
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/profile"}>
                  <Link href="/profile" className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:text-destructive">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b flex items-center px-4 md:hidden bg-card z-10 sticky top-0">
            <SidebarTrigger />
            <div className="ml-4 font-bold text-lg text-primary flex items-center gap-2">
               <Sprout className="w-5 h-5" />
               AgriNova
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
