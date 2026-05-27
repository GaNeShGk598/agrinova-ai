import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api, WeatherResponse } from "@/lib/api";
import { getUserLocation } from "@/lib/location";
import { Cloud, Droplets, Thermometer, Wind, CloudRain, Sun, CloudFog, MapPin, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MOCK_WEATHER: WeatherResponse = {
  forecast: {
    current: { temperature_2m: 28, relative_humidity_2m: 65, precipitation: 0, weather_code: 1 },
    daily: {
      time: Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() + i); return d.toISOString().split("T")[0];
      }),
      temperature_2m_max: [30, 31, 29, 27, 26, 28, 30],
      temperature_2m_min: [18, 19, 17, 16, 15, 16, 17],
      precipitation_sum: [0, 0, 5, 12, 2, 0, 0],
      weather_code: [1, 0, 61, 63, 61, 2, 1],
    },
  },
  suggestions: [
    "Good conditions for spraying pesticides today.",
    "Heavy rain expected in 3 days — delay harvesting.",
    "Soil moisture stable. Maintain current irrigation schedule.",
  ],
};

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
  45: "Foggy", 48: "Icy Fog", 51: "Light Drizzle", 53: "Moderate Drizzle",
  55: "Dense Drizzle", 61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
  71: "Slight Snow", 73: "Moderate Snow", 75: "Heavy Snow", 80: "Rain Showers",
  81: "Moderate Showers", 82: "Violent Showers", 95: "Thunderstorm",
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationLabel, setLocationLabel] = useState<string>("Detecting location...");
  const [usingMock, setUsingMock] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    setUsingMock(false);
    try {
      const coords = await getUserLocation();
      if (coords.source === "fallback") {
        setLocationLabel("India (default location)");
        toast.info("Location permission denied — using default location (India)");
      } else {
        setLocationLabel(`${coords.lat.toFixed(2)}°N, ${coords.lon.toFixed(2)}°E`);
      }
      const res = await api.weather.get(coords.lat, coords.lon);
      setWeather(res);
    } catch (err) {
      console.warn("Weather API unavailable, using demo data:", err);
      setWeather(MOCK_WEATHER);
      setLocationLabel("Demo data (backend offline)");
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather(); }, []);

  const getWeatherIcon = (code: number, className = "w-6 h-6") => {
    if (code === 0 || code === 1) return <Sun className={`${className} text-amber-500`} />;
    if (code === 2 || code === 3) return <CloudFog className={`${className} text-slate-400`} />;
    if (code >= 51 && code <= 65) return <CloudRain className={`${className} text-blue-500`} />;
    return <Cloud className={`${className} text-slate-400`} />;
  };

  const getConditionLabel = (code: number) => WMO_DESCRIPTIONS[code] ?? "Unknown";

  const getDayName = (dateStr: string, idx: number) => {
    if (idx === 0) return "Today";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short" });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground text-sm">Fetching weather for your location…</p>
      </div>
    );
  }

  const current = weather?.forecast?.current;
  const daily = weather?.forecast?.daily;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weather Intelligence</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {locationLabel}
            {usingMock && <span className="text-amber-500 text-xs ml-2">(demo mode)</span>}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchWeather} className="gap-2 self-start">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-background border-primary/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                {getWeatherIcon(current?.weather_code ?? 0, "w-24 h-24")}
                <div>
                  <div className="text-5xl font-bold tracking-tighter">
                    {current?.temperature_2m ?? "--"}°C
                  </div>
                  <p className="text-lg text-muted-foreground mt-2 font-medium">
                    {getConditionLabel(current?.weather_code ?? 0)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-muted-foreground">Humidity</div>
                    <div className="font-semibold text-base">{current?.relative_humidity_2m ?? "--"}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="text-muted-foreground">Wind</div>
                    <div className="font-semibold text-base">Data from API</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CloudRain className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-muted-foreground">Precipitation</div>
                    <div className="font-semibold text-base">{current?.precipitation ?? 0} mm</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="text-muted-foreground">Today High/Low</div>
                    <div className="font-semibold text-base">
                      {daily?.temperature_2m_max?.[0] ?? "--"}° / {daily?.temperature_2m_min?.[0] ?? "--"}°
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Farm Actions</CardTitle>
            <CardDescription>Based on current forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {(weather?.suggestions ?? []).map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 text-sm bg-muted/50 p-3 rounded-lg"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {s}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {(daily?.time ?? []).map((time, i) => (
              <div key={time} className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-card/50 hover:bg-muted/50 transition-colors">
                <span className="font-medium text-sm mb-2">{getDayName(time, i)}</span>
                {getWeatherIcon(daily?.weather_code?.[i] ?? 0, "w-8 h-8 mb-3")}
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold">{daily?.temperature_2m_max?.[i]}°</span>
                  <span className="text-muted-foreground">{daily?.temperature_2m_min?.[i]}°</span>
                </div>
                <div className="text-[10px] text-blue-500 mt-2 flex items-center gap-1">
                  <Droplets className="w-3 h-3" />
                  {daily?.precipitation_sum?.[i] ?? 0} mm
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
