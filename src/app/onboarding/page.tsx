import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import OnboardingForm from "@/components/onboarding-form";

export default async function OnboardingPage() {
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

  if (profile?.onboarding_completed) {
    return redirect("/dashboard");
  }

  return <OnboardingForm />;
}
