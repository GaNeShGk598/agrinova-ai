import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, WeatherResponse, AlertOut } from "@/lib/api";
import { getUserLocation } from "@/lib/location";
import { useEffect, useState } from "react";
import { Sprout, Droplets, ThermometerSun, CloudRain } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const MOCK_WEATHER: WeatherResponse = {
  forecast: { current: { temperature_2m: 28, relative_humidity_2m: 72, precipitation: 0, weather_code: 1 } },
  suggestions: [
    "Dry next 3 days — schedule irrigation early morning.",
    "Conditions stable — continue normal field operations.",
  ],
};

const MOCK_ALERTS: AlertOut[] = [
  { id: "1", type: "weather", severity: "high", title: "Frost Warning", message: "Frost expected tonight — cover sensitive crops.", created_at: new Date().toISOString(), user_id: "u1" },
  { id: "2", type: "irrigation", severity: "medium", title: "Low Soil Moisture", message: "Zone 3 moisture dropped below 30%.", created_at: new Date().toISOString(), user_id: "u1" },
];

export default function Dashboard() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertOut[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coords = await getUserLocation();
        const [wRes, aRes] = await Promise.allSettled([
          api.weather.get(coords.lat, coords.lon),
          api.alerts.list(),
        ]);
        setWeather(wRes.status === "fulfilled" ? wRes.value : MOCK_WEATHER);
        setAlerts(aRes.status === "fulfilled" ? aRes.value : MOCK_ALERTS);
      } catch {
        setWeather(MOCK_WEATHER);
        setAlerts(MOCK_ALERTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const cur = weather?.forecast?.current;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's what's happening on the farm today.</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <ThermometerSun className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-temperature">{cur?.temperature_2m ?? "--"}°C</div>
              <p className="text-xs text-muted-foreground mt-1">Current condition</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Humidity</CardTitle>
              <Droplets className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-humidity">{cur?.relative_humidity_2m ?? "--"}%</div>
              <p className="text-xs text-muted-foreground mt-1">Relative humidity</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Precipitation</CardTitle>
              <CloudRain className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-precipitation">{cur?.precipitation ?? 0} mm</div>
              <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Sprout className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-alerts">{alerts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Requiring attention</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {(weather?.suggestions ?? []).map((s, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Sprout className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Alerts</CardTitle>
              <Link href="/alerts">
                <Button variant="ghost" size="sm" className="text-primary text-xs">View all</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {alerts.slice(0, 3).map((a) => (
                  <li key={a.id} className="flex flex-col gap-1 p-3 rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{a.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${a.severity === "high" ? "bg-destructive/10 text-destructive" : a.severity === "medium" ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"}`}>
                        {a.severity.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{a.message}</span>
                  </li>
                ))}
                {alerts.length === 0 && (
                  <p className="text-muted-foreground text-sm">No recent alerts.</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item} initial="hidden" animate="show">
        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Predict Crop", href: "/crop" },
                { label: "Scan Leaf", href: "/disease" },
                { label: "Market Prices", href: "/market" },
                { label: "Weather Forecast", href: "/weather" },
              ].map((action) => (
                <Link key={action.href} href={action.href}>
                  <Button variant="outline" className="w-full h-12 text-sm" data-testid={`button-${action.label.toLowerCase().replace(/ /g, "-")}`}>
                    {action.label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
