import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import DashboardNavbar from "@/components/dashboard-navbar";
import ProfileEditor from "@/components/profile-editor";

export default async function ProfilePage() {
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

  if (!profile) {
    return redirect("/onboarding");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full min-h-screen noise-texture">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <ProfileEditor profile={profile} userEmail={user.email || ""} />
        </div>
      </main>
    </>
  );
}
