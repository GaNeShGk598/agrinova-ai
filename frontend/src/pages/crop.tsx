import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { api, CropPredictResponse } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, Sparkles, TrendingUp } from "lucide-react";

const SEASONS = [
  { value: "kharif", label: "Kharif (Monsoon — Jun–Oct)" },
  { value: "rabi", label: "Rabi (Winter — Oct–Mar)" },
  { value: "zaid", label: "Zaid (Summer — Mar–Jun)" },
  { value: "summer", label: "Summer" },
  { value: "winter", label: "Winter" },
  { value: "monsoon", label: "Monsoon" },
];

const MOCK_RESULT: CropPredictResponse = {
  candidates: [
    { crop: "Soybean", confidence: 92, reasoning: "Optimal pH and high N levels make soybean highly viable in this region." },
    { crop: "Corn", confidence: 85, reasoning: "Good moisture but P levels are slightly sub-optimal for maximum yield." },
    { crop: "Wheat", confidence: 70, reasoning: "Season is appropriate but organic matter is on the lower end." },
  ],
  explanation: "Based on the provided soil profile, leguminous crops are favored due to moderate organic matter and pH levels.",
  best_pick: "Soybean",
  next_steps: ["Prepare soil with pre-emergent herbicide", "Source high-quality soybean seeds certified for your region"],
};

const formSchema = z.object({
  ph: z.coerce.number().min(2, "pH must be 2–10").max(10, "pH must be 2–10"),
  n: z.coerce.number().min(0, "Must be ≥ 0"),
  p: z.coerce.number().min(0, "Must be ≥ 0"),
  k: z.coerce.number().min(0, "Must be ≥ 0"),
  organic_matter: z.coerce.number().min(0).optional(),
  moisture: z.coerce.number().min(0).max(100).optional(),
  season: z.string().min(1, "Season is required"),
  region: z.string().min(1, "Region is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CropPrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropPredictResponse | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ph: 6.5,
      n: 50,
      p: 40,
      k: 40,
      organic_matter: 2,
      moisture: 45,
      season: "kharif",
      region: "Karnataka",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await api.crop.predict({
        soil: { ph: data.ph, n: data.n, p: data.p, k: data.k, organic_matter: data.organic_matter, moisture: data.moisture },
        season: data.season,
        region: data.region,
      });
      setResult(response);
      toast.success("AI prediction generated successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("timed out") || msg.includes("fetch") || msg.includes("Failed to fetch")) {
        setResult(MOCK_RESULT);
        toast.warning("Backend offline — showing demo prediction", { duration: 4000 });
      } else {
        toast.error(msg || "Failed to generate prediction");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crop Prediction</h1>
        <p className="text-muted-foreground mt-1">Get AI-powered crop recommendations based on your soil profile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Soil Profile</CardTitle>
            <CardDescription>Enter your latest soil test results for the most accurate prediction.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="ph" render={({ field }) => (
                    <FormItem><FormLabel>pH Level</FormLabel><FormControl><Input type="number" step="0.1" {...field} data-testid="input-ph" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="moisture" render={({ field }) => (
                    <FormItem><FormLabel>Moisture (%)</FormLabel><FormControl><Input type="number" {...field} data-testid="input-moisture" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="n" render={({ field }) => (
                    <FormItem><FormLabel>Nitrogen (N) mg/kg</FormLabel><FormControl><Input type="number" {...field} data-testid="input-n" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="p" render={({ field }) => (
                    <FormItem><FormLabel>Phosphorus (P) mg/kg</FormLabel><FormControl><Input type="number" {...field} data-testid="input-p" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="k" render={({ field }) => (
                    <FormItem><FormLabel>Potassium (K) mg/kg</FormLabel><FormControl><Input type="number" {...field} data-testid="input-k" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="organic_matter" render={({ field }) => (
                    <FormItem><FormLabel>Organic Matter (%)</FormLabel><FormControl><Input type="number" step="0.1" {...field} data-testid="input-om" /></FormControl><FormMessage /></FormItem>
                  )} />

                  <FormField control={form.control} name="season" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Season</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-season"><SelectValue placeholder="Select season" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SEASONS.map(s => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="region" render={({ field }) => (
                    <FormItem><FormLabel>Region</FormLabel><FormControl><Input placeholder="e.g. Karnataka" {...field} data-testid="input-region" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <Button type="submit" className="w-full mt-6" disabled={loading} data-testid="button-predict">
                  {loading
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing soil data…</>
                    : <><Sparkles className="mr-2 h-4 w-4" /> Get AI Prediction</>}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div>
          {result ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="text-primary" />
                    Best Pick: {result.best_pick}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{result.explanation}</p>
                  {result.next_steps && result.next_steps.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {result.next_steps.map((step, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ranked Candidates</h3>
                {result.candidates.map((c, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">{c.crop}</span>
                        <span className="font-mono font-medium">{c.confidence}%</span>
                      </div>
                      <Progress value={c.confidence} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-2">{c.reasoning}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-border rounded-xl p-8 text-center text-muted-foreground min-h-[300px]">
              Submit your soil profile to see AI-driven crop recommendations and confidence scores.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
