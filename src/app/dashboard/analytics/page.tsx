import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import DashboardNavbar from "@/components/dashboard-navbar";
import AnalyticsDashboard from "@/components/analytics-dashboard";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

  const { data: meals } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user.id)
    .gte("meal_date", thirtyDaysAgoStr)
    .order("meal_date", { ascending: true });

  const { data: workouts } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user.id)
    .gte("workout_date", thirtyDaysAgoStr)
    .order("workout_date", { ascending: true });

  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return (
    <>
      <DashboardNavbar />
      <main className="w-full min-h-screen noise-texture">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <AnalyticsDashboard 
            meals={meals || []} 
            workouts={workouts || []}
            goals={goals || []}
          />
        </div>
      </main>
    </>
  );
}
