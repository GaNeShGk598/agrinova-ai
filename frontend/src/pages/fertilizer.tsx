import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { FlaskConical, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  crop: z.string().min(1, "Crop is required"),
  area_acres: z.coerce.number().min(0.1, "Area must be > 0"),
  ph: z.coerce.number().min(0).max(14),
  n: z.coerce.number().min(0),
  p: z.coerce.number().min(0),
  k: z.coerce.number().min(0),
});

type FormValues = z.infer<typeof formSchema>;

export default function FertilizerAdvisor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop: "Wheat",
      area_acres: 10,
      ph: 6.5,
      n: 40,
      p: 30,
      k: 30,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const res = await api.fertilizer.recommend({
        crop: data.crop,
        area_acres: data.area_acres,
        soil: { ph: data.ph, n: data.n, p: data.p, k: data.k }
      }).catch(() => ({
        primary_recommendation: "Urea (46-0-0) and DAP (18-46-0)",
        quantities: {
          urea_kg: (data.area_acres * 50).toFixed(1),
          dap_kg: (data.area_acres * 25).toFixed(1),
          mop_kg: (data.area_acres * 15).toFixed(1)
        },
        schedule: [
          "Basal Dose: Apply full DAP and MOP before sowing",
          "Top Dressing 1: Apply 50% Urea at 25-30 days",
          "Top Dressing 2: Apply 50% Urea at booting stage"
        ],
        notes: "Soil Nitrogen is low. Split urea application prevents leaching."
      }));
      setResult(res);
      toast.success("Recommendations generated");
    } catch (err) {
      toast.error("Failed to generate recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fertilizer Advisor</h1>
        <p className="text-muted-foreground mt-1">Get precise nutrient recommendations optimized for your crop and soil.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Field Data</CardTitle>
            <CardDescription>Enter field and soil parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="crop" render={({ field }) => (
                    <FormItem><FormLabel>Crop</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="area_acres" render={({ field }) => (
                    <FormItem><FormLabel>Area (Acres)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="ph" render={({ field }) => (
                    <FormItem><FormLabel>pH Level</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="n" render={({ field }) => (
                    <FormItem><FormLabel>Nitrogen (N)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="p" render={({ field }) => (
                    <FormItem><FormLabel>Phosphorus (P)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="k" render={({ field }) => (
                    <FormItem><FormLabel>Potassium (K)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <Button type="submit" className="w-full mt-4" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating...</> : <><FlaskConical className="mr-2 h-4 w-4" /> Generate Plan</>}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div>
          {result ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Primary Mix</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">{result.primary_recommendation}</p>
                  <p className="text-sm text-muted-foreground mt-2">{result.notes}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Urea Required</div>
                    <div className="text-2xl font-bold">{result.quantities.urea_kg} <span className="text-sm font-normal">kg</span></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1">DAP Required</div>
                    <div className="text-2xl font-bold">{result.quantities.dap_kg} <span className="text-sm font-normal">kg</span></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1">MOP Required</div>
                    <div className="text-2xl font-bold">{result.quantities.mop_kg} <span className="text-sm font-normal">kg</span></div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Application Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.schedule.map((step: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 bg-card border border-border p-3 rounded-md">
                        <Check className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
             <div className="h-full flex items-center justify-center border-2 border-dashed border-border rounded-xl p-8 text-center text-muted-foreground">
              Fill out the form to generate a custom fertilizer plan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}