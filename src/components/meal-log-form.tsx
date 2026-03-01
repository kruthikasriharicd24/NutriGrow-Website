"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { createClient } from "../../supabase/client";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

interface MealLogFormProps {
  userId: string;
}

export default function MealLogForm({ userId }: MealLogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    meal_type: "",
    meal_name: "",
    description: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    vitamins: "",
    meal_date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.from("meals").insert({
        user_id: userId,
        meal_type: formData.meal_type,
        meal_name: formData.meal_name,
        description: formData.description,
        calories: parseFloat(formData.calories) || 0,
        protein: parseFloat(formData.protein) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fat: parseFloat(formData.fat) || 0,
        vitamins: formData.vitamins,
        meal_date: formData.meal_date,
      });

      if (error) throw error;

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error logging meal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-up">
      <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">Log Your Meal</CardTitle>
          <CardDescription className="text-base">Track your nutrition for today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="meal_type" className="text-base">Meal Type</Label>
                <Select value={formData.meal_type} onValueChange={(value) => setFormData({ ...formData, meal_type: value })}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Breakfast">Breakfast</SelectItem>
                    <SelectItem value="Lunch">Lunch</SelectItem>
                    <SelectItem value="Dinner">Dinner</SelectItem>
                    <SelectItem value="Snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meal_date" className="text-base">Date</Label>
                <Input
                  id="meal_date"
                  type="date"
                  value={formData.meal_date}
                  onChange={(e) => setFormData({ ...formData, meal_date: e.target.value })}
                  required
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meal_name" className="text-base">Meal Name</Label>
              <Input
                id="meal_name"
                type="text"
                placeholder="e.g., Grilled Chicken Salad"
                value={formData.meal_name}
                onChange={(e) => setFormData({ ...formData, meal_name: e.target.value })}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add any notes about your meal..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div className="bg-muted/30 rounded-lg p-6 space-y-4 border">
              <h3 className="font-semibold text-lg">Nutritional Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories" className="text-sm">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein" className="text-sm">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs" className="text-sm">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat" className="text-sm">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={formData.fat}
                    onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vitamins" className="text-sm">Vitamins (Optional)</Label>
                <Input
                  id="vitamins"
                  type="text"
                  placeholder="e.g., Vitamin C, Vitamin D"
                  value={formData.vitamins}
                  onChange={(e) => setFormData({ ...formData, vitamins: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Link href="/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full h-12">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading || !formData.meal_type || !formData.meal_name}
                className="flex-1 h-12 text-base"
              >
                {loading ? "Saving..." : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Log Meal
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
