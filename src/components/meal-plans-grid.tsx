"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock } from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MealPlan {
  id: string;
  name: string;
  description: string;
  dietary_category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  duration_days: number;
  image_url: string;
}

interface MealPlansGridProps {
  mealPlans: MealPlan[];
  favoriteIds: string[];
  userId: string;
}

export default function MealPlansGrid({ mealPlans, favoriteIds, userId }: MealPlansGridProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [favorites, setFavorites] = useState<string[]>(favoriteIds);
  const [loading, setLoading] = useState<string | null>(null);

  const categories = ["All", "Vegetarian", "Vegan", "Non-Veg", "Pescatarian", "Eggetarian"];

  const filteredPlans = selectedCategory === "All" 
    ? mealPlans 
    : mealPlans.filter(plan => plan.dietary_category === selectedCategory);

  const toggleFavorite = async (planId: string) => {
    setLoading(planId);
    const supabase = createClient();

    try {
      if (favorites.includes(planId)) {
        await supabase
          .from("user_favorite_plans")
          .delete()
          .eq("user_id", userId)
          .eq("meal_plan_id", planId);
        setFavorites(favorites.filter(id => id !== planId));
      } else {
        await supabase
          .from("user_favorite_plans")
          .insert({ user_id: userId, meal_plan_id: planId });
        setFavorites([...favorites, planId]);
      }
      router.refresh();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 fade-up">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="h-10"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan, idx) => (
          <Card 
            key={plan.id} 
            className="border-primary/20 shadow-md hover:shadow-lg transition-all overflow-hidden fade-up group"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={plan.image_url}
                alt={plan.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <Button
                  size="icon"
                  variant={favorites.includes(plan.id) ? "default" : "secondary"}
                  className="rounded-full shadow-lg"
                  onClick={() => toggleFavorite(plan.id)}
                  disabled={loading === plan.id}
                >
                  <Heart 
                    className={`h-4 w-4 ${favorites.includes(plan.id) ? 'fill-current' : ''}`} 
                  />
                </Button>
              </div>
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary/90 backdrop-blur-sm">
                  {plan.dietary_category}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="line-clamp-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{plan.duration_days} days plan</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-muted/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Cal</p>
                  <p className="text-sm font-bold font-mono">{plan.calories}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Protein</p>
                  <p className="text-sm font-bold font-mono">{plan.protein}g</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                  <p className="text-sm font-bold font-mono">{plan.carbs}g</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Fat</p>
                  <p className="text-sm font-bold font-mono">{plan.fat}g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <Card className="border-primary/20 shadow-md">
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">No meal plans found for this category</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
