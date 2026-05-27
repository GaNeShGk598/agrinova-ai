import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, UserOut } from "@/lib/api";
import { useEffect, useState } from "react";
import { User, MapPin, Mail, Globe } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const [user, setUser] = useState<UserOut | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = api.auth.currentUser();
    setUser(u);
    setLoading(false);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
    // Mock save
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and personal information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-none shadow-none bg-transparent">
          <CardContent className="p-0 space-y-6 flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {user?.name?.charAt(0) || 'F'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user?.name || 'Demo Farmer'}</h2>
              <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {user?.region || 'Not specified'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2"><User className="w-4 h-4"/> Full Name</Label>
                <Input id="name" defaultValue={user?.name || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4"/> Email Address</Label>
                <Input id="email" type="email" defaultValue={user?.email || ''} readOnly className="bg-muted/50 cursor-not-allowed" />
                <p className="text-[10px] text-muted-foreground">Email cannot be changed directly.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region" className="flex items-center gap-2"><MapPin className="w-4 h-4"/> Region</Label>
                  <Input id="region" defaultValue={user?.region || 'Midwest'} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className="flex items-center gap-2"><Globe className="w-4 h-4"/> Language</Label>
                  <Select defaultValue={user?.language || 'en'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="mt-4">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}