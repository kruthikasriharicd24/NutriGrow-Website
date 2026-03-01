import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import DashboardNavbar from "@/components/dashboard-navbar";
import WorkoutsManager from "@/components/workouts-manager";

export default async function WorkoutsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: workouts } = await supabase
    .from("workouts")
    .select(`
      *,
      exercises (*)
    `)
    .eq("user_id", user.id)
    .order("workout_date", { ascending: false });

  const { data: activeGoals } = await supabase
    .from("goals")
    .select("id, title")
    .eq("user_id", user.id)
    .eq("status", "active");

  return (
    <>
      <DashboardNavbar />
      <main className="w-full min-h-screen noise-texture">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <WorkoutsManager 
            workouts={workouts || []} 
            activeGoals={activeGoals || []}
            userId={user.id} 
          />
        </div>
      </main>
    </>
  );
}
