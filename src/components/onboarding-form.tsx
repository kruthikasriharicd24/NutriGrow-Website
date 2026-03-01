"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { createClient } from "../../supabase/client";

export default function OnboardingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    dietary_preference: "",
  });

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No user found");
      }

      const bmi = calculateBMI(parseFloat(formData.weight), parseFloat(formData.height));

      const { error } = await supabase.from("user_profiles").upsert({
        user_id: user.id,
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        bmi: parseFloat(bmi),
        dietary_preference: formData.dietary_preference,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && formData.age && formData.gender && formData.height && formData.weight) {
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 noise-texture">
      <Card className="w-full max-w-2xl shadow-lg border-primary/20 fade-up">
        <CardHeader className="space-y-2 pb-8">
          <CardTitle className="text-4xl text-center">Welcome to NutriGrow</CardTitle>
          <CardDescription className="text-center text-base">
            Let's personalize your wellness journey
          </CardDescription>
          <div className="flex justify-center gap-2 pt-4">
            <div className={`h-2 w-16 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-2 w-16 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 fade-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-base">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-base">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-base">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.01"
                      placeholder="170"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-base">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.01"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                {formData.height && formData.weight && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Your BMI</p>
                    <p className="text-3xl font-bold text-primary font-mono">
                      {calculateBMI(parseFloat(formData.weight), parseFloat(formData.height))}
                    </p>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full h-12 text-base"
                  disabled={!formData.age || !formData.gender || !formData.height || !formData.weight}
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 fade-up">
                <div className="space-y-2">
                  <Label htmlFor="dietary_preference" className="text-base">Dietary Preference</Label>
                  <Select value={formData.dietary_preference} onValueChange={(value) => setFormData({ ...formData, dietary_preference: value })}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select your dietary preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="Vegan">Vegan</SelectItem>
                      <SelectItem value="Non-Veg">Non-Vegetarian</SelectItem>
                      <SelectItem value="Pescatarian">Pescatarian</SelectItem>
                      <SelectItem value="Eggetarian">Eggetarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-lg">Your Profile Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Age</p>
                      <p className="font-semibold">{formData.age} years</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Gender</p>
                      <p className="font-semibold capitalize">{formData.gender}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Height</p>
                      <p className="font-semibold">{formData.height} cm</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Weight</p>
                      <p className="font-semibold">{formData.weight} kg</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.dietary_preference}
                    className="flex-1 h-12 text-base"
                  >
                    {loading ? "Saving..." : "Complete Setup"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
