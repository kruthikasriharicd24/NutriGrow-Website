import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import DashboardNavbar from "@/components/dashboard-navbar";
import MealPlansGrid from "@/components/meal-plans-grid";

export default async function MealPlansPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: mealPlans } = await supabase
    .from("meal_plans")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: favoritePlans } = await supabase
    .from("user_favorite_plans")
    .select("meal_plan_id")
    .eq("user_id", user.id);

  const favoriteIds = favoritePlans?.map(f => f.meal_plan_id) || [];

  return (
    <>
      <DashboardNavbar />
      <main className="w-full min-h-screen noise-texture">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8 fade-up">
            <h1 className="text-4xl font-bold mb-2">Meal Plans</h1>
            <p className="text-muted-foreground text-lg">Discover curated nutrition plans tailored to your dietary preferences</p>
          </div>

          <MealPlansGrid 
            mealPlans={mealPlans || []} 
            favoriteIds={favoriteIds}
            userId={user.id}
          />
        </div>
      </main>
    </>
  );
}
