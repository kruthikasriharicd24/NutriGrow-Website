"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { createClient } from "../../supabase/client";
import { ArrowLeft, User, Save } from "lucide-react";
import Link from "next/link";

interface Profile {
  id: string;
  user_id: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  dietary_preference: string;
}

interface ProfileEditorProps {
  profile: Profile;
  userEmail: string;
}

export default function ProfileEditor({ profile, userEmail }: ProfileEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: profile.age.toString(),
    gender: profile.gender,
    height: profile.height.toString(),
    weight: profile.weight.toString(),
    dietary_preference: profile.dietary_preference,
  });

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const currentBMI = calculateBMI(parseFloat(formData.weight), parseFloat(formData.height));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const bmi = calculateBMI(parseFloat(formData.weight), parseFloat(formData.height));

      const { error } = await supabase
        .from("user_profiles")
        .update({
          age: parseInt(formData.age),
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          bmi: parseFloat(bmi),
          dietary_preference: formData.dietary_preference,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", profile.user_id);

      if (error) throw error;

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-up">
      <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl">Your Profile</CardTitle>
              <CardDescription className="text-base">{userEmail}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-6 space-y-6 border">
              <h3 className="font-semibold text-lg">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-base">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-base">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-6 space-y-6 border">
              <h3 className="font-semibold text-lg">Body Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-base">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.01"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    required
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-base">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current BMI</p>
                    <p className="text-4xl font-bold text-primary font-mono">{currentBMI}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Previous BMI</p>
                    <p className="text-2xl font-bold font-mono">{profile.bmi}</p>
                  </div>
                </div>
                {parseFloat(currentBMI) !== profile.bmi && (
                  <p className="text-xs text-muted-foreground mt-3">
                    {parseFloat(currentBMI) < profile.bmi ? '↓' : '↑'} 
                    {' '}Change: {Math.abs(parseFloat(currentBMI) - profile.bmi).toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-6 space-y-4 border">
              <h3 className="font-semibold text-lg">Dietary Preferences</h3>
              
              <div className="space-y-2">
                <Label htmlFor="dietary_preference" className="text-base">Dietary Preference</Label>
                <Select value={formData.dietary_preference} onValueChange={(value) => setFormData({ ...formData, dietary_preference: value })}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="Vegan">Vegan</SelectItem>
                    <SelectItem value="Non-Veg">Non-Vegetarian</SelectItem>
                    <SelectItem value="Pescatarian">Pescatarian</SelectItem>
                    <SelectItem value="Eggetarian">Eggetarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Link href="/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full h-12">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 text-base"
              >
                {loading ? "Saving..." : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
