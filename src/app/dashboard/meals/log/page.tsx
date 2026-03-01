import { redirect } from "next/navigation";
import { createClient } from "../../../../../supabase/server";
import MealLogForm from "@/components/meal-log-form";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function LogMealPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full min-h-screen noise-texture">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <MealLogForm userId={user.id} />
        </div>
      </main>
    </>
  );
}
