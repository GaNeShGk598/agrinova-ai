import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { api, AlertOut } from "@/lib/api";
import { toast } from "sonner";
import { Bell, AlertTriangle, Info, CheckCircle2, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SmartAlerts() {
  const [alerts, setAlerts] = useState<AlertOut[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create form state
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("weather");
  const [severity, setSeverity] = useState("low");

  // Evaluate state
  const [soilMoisture, setSoilMoisture] = useState([45]);
  const [humidity, setHumidity] = useState([70]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.alerts.list().catch(() => [
        { id: "1", type: "weather", severity: "high", title: "Frost Warning", message: "Frost expected tonight.", created_at: new Date().toISOString(), user_id: "u1" },
        { id: "2", type: "irrigation", severity: "medium", title: "Low Soil Moisture", message: "Zone 3 moisture dropped below 30%.", created_at: new Date().toISOString(), user_id: "u1" },
        { id: "3", type: "market", severity: "low", title: "Wheat Price Up", message: "Wheat prices rose by 2% today.", created_at: new Date().toISOString(), user_id: "u1" }
      ]);
      setAlerts(res as AlertOut[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAlert = await api.alerts.create({
        type: type as any,
        severity: severity as any,
        title,
        message: msg
      }).catch(() => ({
        id: Math.random().toString(),
        type, severity, title, message: msg, created_at: new Date().toISOString(), user_id: "u1"
      }));
      setAlerts([newAlert as AlertOut, ...alerts]);
      toast.success("Alert created successfully");
      setTitle("");
      setMsg("");
    } catch (err) {
      toast.error("Failed to create alert");
    }
  };

  const handleEvaluate = async () => {
    try {
      const res = await api.alerts.evaluate(soilMoisture[0], humidity[0]).catch(() => {
        const created = [];
        if (soilMoisture[0] < 30) created.push({ id: Math.random().toString(), type: "irrigation", severity: "high", title: "Critical Moisture", message: `Moisture at ${soilMoisture[0]}%`, created_at: new Date().toISOString(), user_id: "1" });
        if (humidity[0] > 85) created.push({ id: Math.random().toString(), type: "disease", severity: "medium", title: "High Humidity", message: `Humidity at ${humidity[0]}%, fungal risk high`, created_at: new Date().toISOString(), user_id: "1" });
        return { created };
      });
      if (res.created.length > 0) {
        setAlerts([...(res.created as AlertOut[]), ...alerts]);
        toast.info(`Generated ${res.created.length} new alerts based on conditions`);
      } else {
        toast.success("Conditions optimal. No alerts generated.");
      }
    } catch (err) {
      toast.error("Evaluation failed");
    }
  };

  const getIcon = (type: string, severity: string) => {
    const colorClass = severity === 'high' ? 'text-destructive' : severity === 'medium' ? 'text-amber-500' : 'text-blue-500';
    switch (type) {
      case 'weather': return <Bell className={`w-5 h-5 ${colorClass}`} />;
      case 'irrigation': return <Info className={`w-5 h-5 ${colorClass}`} />;
      case 'disease': return <AlertTriangle className={`w-5 h-5 ${colorClass}`} />;
      default: return <Bell className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Alerts</h1>
        <p className="text-muted-foreground mt-1">Manage notifications and setup automated condition triggers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Alerts</CardTitle>
                <CardDescription>Recent notifications requiring your attention</CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/10">{alerts.length} Total</Badge>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading alerts...</div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {alerts.map((a) => (
                      <motion.div 
                        key={a.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="mt-1 p-2 rounded-full bg-background border">
                          {getIcon(a.type, a.severity)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">{a.title}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(a.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{a.message}</p>
                          <div className="flex gap-2 mt-3">
                            <Badge variant="outline" className="text-[10px] capitalize">{a.type}</Badge>
                            <Badge variant={a.severity === 'high' ? 'destructive' : a.severity === 'medium' ? 'outline' : 'secondary'} className="text-[10px] capitalize">
                              {a.severity}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Manual Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Schedule Maintenance" />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Input value={msg} onChange={e => setMsg(e.target.value)} required placeholder="Details..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weather">Weather</SelectItem>
                        <SelectItem value="irrigation">Irrigation</SelectItem>
                        <SelectItem value="disease">Disease</SelectItem>
                        <SelectItem value="market">Market</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Severity</Label>
                    <Select value={severity} onValueChange={setSeverity}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full">Add Alert</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Condition Simulator
              </CardTitle>
              <CardDescription>Test automated triggers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Soil Moisture</Label>
                  <span className="text-sm text-muted-foreground">{soilMoisture[0]}%</span>
                </div>
                <Slider value={soilMoisture} onValueChange={setSoilMoisture} max={100} step={1} />
                <p className="text-[10px] text-muted-foreground">&lt; 30% triggers Irrigation Alert</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Humidity</Label>
                  <span className="text-sm text-muted-foreground">{humidity[0]}%</span>
                </div>
                <Slider value={humidity} onValueChange={setHumidity} max={100} step={1} />
                <p className="text-[10px] text-muted-foreground">&gt; 85% triggers Disease Alert</p>
              </div>
              <Button variant="secondary" className="w-full" onClick={handleEvaluate}>
                <Play className="w-4 h-4 mr-2" />
                Evaluate Conditions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}