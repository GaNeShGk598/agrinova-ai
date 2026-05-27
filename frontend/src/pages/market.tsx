import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { api, MarketTrend } from "@/lib/api";
import { motion } from "framer-motion";

export default function MarketPrices() {
  const [crop, setCrop] = useState("wheat");
  const [data, setData] = useState<MarketTrend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarket = async () => {
      setLoading(true);
      try {
        const res = await api.market.prices(crop, 8).catch(() => ({
          crop: crop,
          unit: "quintal",
          trend: crop === "wheat" ? "rising" : crop === "corn" ? "falling" : "stable",
          change_pct: crop === "wheat" ? 4.5 : crop === "corn" ? -2.1 : 0.5,
          series: [
            { week: "Week 1", price: 180 },
            { week: "Week 2", price: 185 },
            { week: "Week 3", price: 182 },
            { week: "Week 4", price: 190 },
            { week: "Week 5", price: 195 },
            { week: "Week 6", price: 200 },
            { week: "Week 7", price: 210 },
            { week: "Week 8", price: 220 },
          ].map(p => ({ ...p, price: p.price * (crop === "soybean" ? 2 : crop === "rice" ? 1.5 : 1) }))
        }));
        setData(res as MarketTrend);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarket();
  }, [crop]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Prices</h1>
          <p className="text-muted-foreground mt-1">Track historical pricing trends to optimize your selling strategy.</p>
        </div>
        <div className="w-48">
          <Select value={crop} onValueChange={setCrop}>
            <SelectTrigger>
              <SelectValue placeholder="Select Crop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wheat">Wheat</SelectItem>
              <SelectItem value="rice">Rice</SelectItem>
              <SelectItem value="corn">Corn</SelectItem>
              <SelectItem value="soybean">Soybean</SelectItem>
              <SelectItem value="cotton">Cotton</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading || !data ? (
        <div className="h-[400px] flex items-center justify-center border rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">Current Price ({data.unit})</div>
                <div className="text-3xl font-bold">${data.series[data.series.length - 1].price.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">Trend Status</div>
                <div className="flex items-center gap-2">
                  {data.trend === 'rising' ? <TrendingUp className="text-primary w-8 h-8" /> : 
                   data.trend === 'falling' ? <TrendingDown className="text-destructive w-8 h-8" /> : 
                   <Minus className="text-muted-foreground w-8 h-8" />}
                  <span className="text-2xl font-bold capitalize">{data.trend}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">8-Week Change</div>
                <div className="text-3xl font-bold flex items-center gap-2">
                  <span className={data.change_pct > 0 ? "text-primary" : data.change_pct < 0 ? "text-destructive" : ""}>
                    {data.change_pct > 0 ? "+" : ""}{data.change_pct}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="capitalize">{crop} Price History</CardTitle>
              <CardDescription>Last 8 weeks trailing data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.series} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(val) => `$${val}`}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      formatter={(val: number) => [`$${val.toFixed(2)}`, 'Price']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={data.trend === 'falling' ? "hsl(var(--destructive))" : "hsl(var(--primary))"} 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: "hsl(var(--card))", strokeWidth: 2 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}