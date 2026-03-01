"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Activity, Target } from "lucide-react";

interface Meal {
  id: string;
  meal_date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Workout {
  id: string;
  workout_date: string;
  duration_minutes: number;
  calories_burned: number;
}

interface Goal {
  id: string;
  title: string;
  target_value: number;
  current_value: number;
  status: string;
}

interface AnalyticsDashboardProps {
  meals: Meal[];
  workouts: Workout[];
  goals: Goal[];
}

export default function AnalyticsDashboard({ meals, workouts, goals }: AnalyticsDashboardProps) {
  const nutritionData = meals.reduce((acc, meal) => {
    const date = meal.meal_date;
    if (!acc[date]) {
      acc[date] = { date, calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    acc[date].calories += parseFloat(meal.calories?.toString() || "0");
    acc[date].protein += parseFloat(meal.protein?.toString() || "0");
    acc[date].carbs += parseFloat(meal.carbs?.toString() || "0");
    acc[date].fat += parseFloat(meal.fat?.toString() || "0");
    return acc;
  }, {} as Record<string, any>);

  const nutritionChartData = Object.values(nutritionData)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14)
    .map((item: any) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));

  const workoutData = workouts.reduce((acc, workout) => {
    const date = workout.workout_date;
    if (!acc[date]) {
      acc[date] = { date, duration: 0, calories: 0, count: 0 };
    }
    acc[date].duration += workout.duration_minutes;
    acc[date].calories += parseFloat(workout.calories_burned?.toString() || "0");
    acc[date].count += 1;
    return acc;
  }, {} as Record<string, any>);

  const workoutChartData = Object.values(workoutData)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14)
    .map((item: any) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));

  const goalsData = goals.map(goal => ({
    name: goal.title.length > 20 ? goal.title.substring(0, 20) + '...' : goal.title,
    progress: goal.target_value ? (parseFloat(goal.current_value?.toString() || "0") / parseFloat(goal.target_value?.toString() || "1")) * 100 : 0,
    status: goal.status,
  }));

  const totalMeals = meals.length;
  const totalWorkouts = workouts.length;
  const avgCalories = meals.length > 0 
    ? meals.reduce((sum, m) => sum + parseFloat(m.calories?.toString() || "0"), 0) / meals.length 
    : 0;
  const totalWorkoutMinutes = workouts.reduce((sum, w) => sum + w.duration_minutes, 0);

  return (
    <div className="space-y-6">
      <div className="fade-up">
        <h1 className="text-4xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground text-lg">Track your progress over time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 fade-up" style={{ animationDelay: '80ms' }}>
        <Card className="border-primary/20 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Meals</p>
                <p className="text-3xl font-bold font-mono">{totalMeals}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Calories</p>
                <p className="text-3xl font-bold font-mono">{avgCalories.toFixed(0)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Workouts</p>
                <p className="text-3xl font-bold font-mono">{totalWorkouts}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Workout Time</p>
                <p className="text-3xl font-bold font-mono">{totalWorkoutMinutes}</p>
                <p className="text-xs text-muted-foreground">minutes</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary/20 shadow-md fade-up" style={{ animationDelay: '160ms' }}>
          <CardHeader>
            <CardTitle className="text-2xl">Nutrition Trends</CardTitle>
            <CardDescription>Daily calorie intake over the last 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            {nutritionChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={nutritionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No nutrition data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-md fade-up" style={{ animationDelay: '240ms' }}>
          <CardHeader>
            <CardTitle className="text-2xl">Macronutrients</CardTitle>
            <CardDescription>Protein, carbs, and fat intake trends</CardDescription>
          </CardHeader>
          <CardContent>
            {nutritionChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={nutritionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="protein" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="Protein (g)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="carbs" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="Carbs (g)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fat" 
                    stroke="hsl(var(--chart-4))" 
                    strokeWidth={2}
                    name="Fat (g)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No nutrition data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary/20 shadow-md fade-up" style={{ animationDelay: '320ms' }}>
          <CardHeader>
            <CardTitle className="text-2xl">Workout Frequency</CardTitle>
            <CardDescription>Daily workout duration over the last 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            {workoutChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workoutChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar 
                    dataKey="duration" 
                    fill="hsl(var(--primary))" 
                    radius={[8, 8, 0, 0]}
                    name="Duration (min)"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No workout data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-md fade-up" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="text-2xl">Goal Progress</CardTitle>
            <CardDescription>Achievement status of your goals</CardDescription>
          </CardHeader>
          <CardContent>
            {goalsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={goalsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={120}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: any) => `${value.toFixed(0)}%`}
                  />
                  <Bar 
                    dataKey="progress" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 8, 8, 0]}
                    name="Progress"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No goals created yet</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
