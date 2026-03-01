import DashboardNavbar from "@/components/dashboard-navbar";
import { Activity, Apple, Target, TrendingUp, Plus, Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile?.onboarding_completed) {
    return redirect("/onboarding");
  }

  const today = new Date().toISOString().split('T')[0];

  const { data: todayMeals } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user.id)
    .eq("meal_date", today);

  const { data: activeGoals } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: recentWorkouts } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user.id)
    .order("workout_date", { ascending: false })
    .limit(3);

  const totalCalories = todayMeals?.reduce((sum, meal) => sum + (parseFloat(meal.calories?.toString() || "0")), 0) || 0;
  const totalProtein = todayMeals?.reduce((sum, meal) => sum + (parseFloat(meal.protein?.toString() || "0")), 0) || 0;
  const totalCarbs = todayMeals?.reduce((sum, meal) => sum + (parseFloat(meal.carbs?.toString() || "0")), 0) || 0;
  const totalFat = todayMeals?.reduce((sum, meal) => sum + (parseFloat(meal.fat?.toString() || "0")), 0) || 0;

  return (
    <>
      <DashboardNavbar />
      <main className="w-full min-h-screen noise-texture">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8 fade-up">
            <h1 className="text-5xl font-bold mb-2">Welcome back, {profile.gender === 'male' ? 'Sir' : profile.gender === 'female' ? 'Ma\'am' : 'Friend'}</h1>
            <p className="text-muted-foreground text-lg">Here's your wellness overview for today</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 border-primary/20 shadow-md hover:shadow-lg transition-shadow fade-up">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Today's Nutrition</CardTitle>
                    <CardDescription>Daily macro breakdown</CardDescription>
                  </div>
                  <Apple className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Calories</p>
                    <p className="text-3xl font-bold font-mono text-primary">{totalCalories.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground mt-1">kcal</p>
                  </div>
                  <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-4 border border-accent/20">
                    <p className="text-sm text-muted-foreground mb-1">Protein</p>
                    <p className="text-3xl font-bold font-mono text-accent">{totalProtein.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground mt-1">grams</p>
                  </div>
                  <div className="bg-gradient-to-br from-chart-2/10 to-chart-2/5 rounded-xl p-4 border border-chart-2/20">
                    <p className="text-sm text-muted-foreground mb-1">Carbs</p>
                    <p className="text-3xl font-bold font-mono" style={{ color: 'hsl(var(--chart-2))' }}>{totalCarbs.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground mt-1">grams</p>
                  </div>
                  <div className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 rounded-xl p-4 border border-chart-4/20">
                    <p className="text-sm text-muted-foreground mb-1">Fat</p>
                    <p className="text-3xl font-bold font-mono" style={{ color: 'hsl(var(--chart-4))' }}>{totalFat.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground mt-1">grams</p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <Link href="/dashboard/meals/log" className="flex-1">
                    <Button className="w-full h-12" size="lg">
                      <Plus className="mr-2 h-5 w-5" />
                      Log Meal
                    </Button>
                  </Link>
                  <Link href="/dashboard/meals" className="flex-1">
                    <Button variant="outline" className="w-full h-12" size="lg">
                      View All Meals
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-md hover:shadow-lg transition-shadow fade-up" style={{ animationDelay: '80ms' }}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Your Profile</CardTitle>
                    <CardDescription>Health metrics</CardDescription>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">BMI</p>
                    <p className="text-2xl font-bold font-mono text-primary">{profile.bmi}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="text-2xl font-bold font-mono">{profile.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="text-2xl font-bold font-mono">{profile.height} cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="text-2xl font-bold font-mono">{profile.age} yrs</p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-2">Diet Preference</p>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-2 text-center">
                    <p className="font-semibold text-primary">{profile.dietary_preference}</p>
                  </div>
                </div>
                <Link href="/dashboard/profile">
                  <Button variant="outline" className="w-full h-11 mt-2">
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="border-primary/20 shadow-md hover:shadow-lg transition-shadow fade-up" style={{ animationDelay: '160ms' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Active Goals</CardTitle>
                    <CardDescription>Track your progress</CardDescription>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                {activeGoals && activeGoals.length > 0 ? (
                  <div className="space-y-4">
                    {activeGoals.map((goal) => {
                      const progress = goal.target_value ? (parseFloat(goal.current_value?.toString() || "0") / parseFloat(goal.target_value?.toString() || "1")) * 100 : 0;
                      return (
                        <div key={goal.id} className="bg-muted/30 rounded-lg p-4 border">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{goal.title}</h3>
                            <span className="text-sm font-mono text-primary">{progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mb-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {goal.current_value} / {goal.target_value} {goal.unit}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No active goals yet</p>
                  </div>
                )}
                <Link href="/dashboard/goals">
                  <Button className="w-full mt-4 h-11">
                    <Plus className="mr-2 h-4 w-4" />
                    Manage Goals
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-md hover:shadow-lg transition-shadow fade-up" style={{ animationDelay: '240ms' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Recent Workouts</CardTitle>
                    <CardDescription>Your fitness activity</CardDescription>
                  </div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                {recentWorkouts && recentWorkouts.length > 0 ? (
                  <div className="space-y-3">
                    {recentWorkouts.map((workout) => (
                      <div key={workout.id} className="bg-muted/30 rounded-lg p-4 border flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold capitalize">{workout.workout_type}</h3>
                          <p className="text-sm text-muted-foreground">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {new Date(workout.workout_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold font-mono text-primary">{workout.duration_minutes}</p>
                          <p className="text-xs text-muted-foreground">minutes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No workouts logged yet</p>
                  </div>
                )}
                <Link href="/dashboard/workouts">
                  <Button className="w-full mt-4 h-11">
                    <Plus className="mr-2 h-4 w-4" />
                    Log Workout
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-up" style={{ animationDelay: '320ms' }}>
            <Link href="/dashboard/meal-plans">
              <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <Apple className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold text-lg mb-1">Meal Plans</h3>
                  <p className="text-sm text-muted-foreground">Browse curated plans</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/analytics">
              <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold text-lg mb-1">Analytics</h3>
                  <p className="text-sm text-muted-foreground">View your progress</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/profile">
              <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <Target className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold text-lg mb-1">Profile</h3>
                  <p className="text-sm text-muted-foreground">Update your info</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
