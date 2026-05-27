import { useState } from "react";
import { useLocation, Link } from "wouter";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Sprout, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const tok = await api.auth.register({ name, email, password, region });
      api.auth.setSession(tok);
      toast.success(`Account created! Welcome, ${tok.user.name}`);
      setLocation("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      if (
        msg.includes("timed out") ||
        msg.includes("fetch") ||
        msg.includes("NetworkError") ||
        msg.includes("Failed to fetch")
      ) {
        toast.warning("Backend offline — continuing in demo mode", { duration: 4000 });
        api.auth.setSession({
          access_token: "demo_token",
          token_type: "bearer",
          user: { id: "demo", name, email, region },
        });
        setLocation("/");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Sprout className="w-8 h-8" />
            AgriNova AI
          </div>
        </div>
        <Card className="border-primary/20 shadow-xl backdrop-blur-sm bg-card/90">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>Join AgriNova AI to start your precision farming journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Farmer" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" data-testid="input-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="farmer@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" data-testid="input-email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" data-testid="input-password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input id="region" placeholder="e.g. Karnataka, India" value={region} onChange={e => setRegion(e.target.value)} autoComplete="address-level1" data-testid="input-region" />
              </div>
              <Button type="submit" className="w-full" disabled={loading} data-testid="button-submit">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</> : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
