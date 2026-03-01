import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Calendar, Apple } from "lucide-react";

export default async function MealsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: meals } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user.id)
    .order("meal_date", { ascending: false })
    .order("meal_time", { ascending: false })
    .limit(50);

  const groupedMeals = meals?.reduce((acc, meal) => {
    const date = meal.meal_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meal);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      <DashboardNavbar />
      <main className="w-full min-h-screen noise-texture">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex items-center justify-between mb-8 fade-up">
            <div>
              <h1 className="text-4xl font-bold mb-2">Meal History</h1>
              <p className="text-muted-foreground text-lg">Track your nutrition journey</p>
            </div>
            <Link href="/dashboard/meals/log">
              <Button size="lg" className="h-12">
                <Plus className="mr-2 h-5 w-5" />
                Log Meal
              </Button>
            </Link>
          </div>

          {meals && meals.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedMeals || {}).map(([date, dateMeals], idx) => {
                const mealsArray = dateMeals as any[];
                return (
                  <Card key={date} className="border-primary/20 shadow-md fade-up" style={{ animationDelay: `${idx * 80}ms` }}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl">
                          {new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </CardTitle>
                      </div>
                      <CardDescription>
                        {mealsArray.length} meal{mealsArray.length !== 1 ? 's' : ''} logged
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mealsArray.map((meal) => (
                          <div key={meal.id} className="bg-muted/30 rounded-lg p-4 border">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold px-2 py-1 bg-primary/20 text-primary rounded">
                                    {meal.meal_type}
                                  </span>
                                  <h3 className="font-semibold text-lg">{meal.meal_name}</h3>
                                </div>
                                {meal.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{meal.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                              <div className="bg-background rounded-lg p-3 text-center">
                                <p className="text-xs text-muted-foreground mb-1">Calories</p>
                                <p className="text-lg font-bold font-mono text-primary">{meal.calories || 0}</p>
                              </div>
                              <div className="bg-background rounded-lg p-3 text-center">
                                <p className="text-xs text-muted-foreground mb-1">Protein</p>
                                <p className="text-lg font-bold font-mono">{meal.protein || 0}g</p>
                              </div>
                              <div className="bg-background rounded-lg p-3 text-center">
                                <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                                <p className="text-lg font-bold font-mono">{meal.carbs || 0}g</p>
                              </div>
                              <div className="bg-background rounded-lg p-3 text-center">
                                <p className="text-xs text-muted-foreground mb-1">Fat</p>
                                <p className="text-lg font-mono font-bold">{meal.fat || 0}g</p>
                              </div>
                            </div>
                            {meal.vitamins && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-xs text-muted-foreground">Vitamins: {meal.vitamins}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-primary/20 shadow-md fade-up">
              <CardContent className="py-16 text-center">
                <Apple className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No meals logged yet</h3>
                <p className="text-muted-foreground mb-6">Start tracking your nutrition today</p>
                <Link href="/dashboard/meals/log">
                  <Button size="lg" className="h-12">
                    <Plus className="mr-2 h-5 w-5" />
                    Log Your First Meal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
