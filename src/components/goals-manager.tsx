"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, CheckCircle2, Calendar } from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

interface Goal {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface GoalsManagerProps {
  goals: Goal[];
  userId: string;
}

export default function GoalsManager({ goals, userId }: GoalsManagerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target_value: "",
    unit: "",
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.from("goals").insert({
        user_id: userId,
        title: formData.title,
        description: formData.description,
        target_value: parseFloat(formData.target_value),
        current_value: 0,
        unit: formData.unit,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: "active",
      });

      if (error) throw error;

      setOpen(false);
      setFormData({
        title: "",
        description: "",
        target_value: "",
        unit: "",
        start_date: new Date().toISOString().split('T')[0],
        end_date: "",
      });
      router.refresh();
    } catch (error) {
      console.error("Error creating goal:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateGoalProgress = async (goalId: string, newValue: number) => {
    const supabase = createClient();
    await supabase
      .from("goals")
      .update({ current_value: newValue })
      .eq("id", goalId);
    router.refresh();
  };

  const completeGoal = async (goalId: string) => {
    const supabase = createClient();
    await supabase
      .from("goals")
      .update({ status: "completed" })
      .eq("id", goalId);
    router.refresh();
  };

  const activeGoals = goals.filter(g => g.status === "active");
  const completedGoals = goals.filter(g => g.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between fade-up">
        <div>
          <h1 className="text-4xl font-bold mb-2">Goals</h1>
          <p className="text-muted-foreground text-lg">Set and track your wellness objectives</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="h-12">
              <Plus className="mr-2 h-5 w-5" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create New Goal</DialogTitle>
              <DialogDescription>Set a new wellness target to track your progress</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Lose 10kg"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add details about your goal..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target_value">Target Value</Label>
                  <Input
                    id="target_value"
                    type="number"
                    step="0.01"
                    placeholder="10"
                    value={formData.target_value}
                    onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    placeholder="kg, workouts, etc."
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Goal"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {activeGoals.length > 0 && (
        <div className="space-y-4 fade-up" style={{ animationDelay: '80ms' }}>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Active Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.map((goal) => {
              const progress = (goal.current_value / goal.target_value) * 100;
              const daysLeft = Math.ceil((new Date(goal.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={goal.id} className="border-primary/20 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{goal.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{goal.description}</CardDescription>
                      </div>
                      <Badge variant={daysLeft > 7 ? "default" : "destructive"}>
                        {daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-lg font-bold font-mono text-primary">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-primary h-3 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {goal.current_value} / {goal.target_value} {goal.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(goal.start_date).toLocaleDateString()} - {new Date(goal.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Update progress"
                        className="h-9"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const value = parseFloat((e.target as HTMLInputElement).value);
                            if (!isNaN(value)) {
                              updateGoalProgress(goal.id, value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => completeGoal(goal.id)}
                        className="whitespace-nowrap"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {completedGoals.length > 0 && (
        <div className="space-y-4 fade-up" style={{ animationDelay: '160ms' }}>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            Completed Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="border-primary/20 shadow-md opacity-75">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1">{goal.title}</CardTitle>
                      <CardDescription>{goal.description}</CardDescription>
                    </div>
                    <Badge className="bg-primary">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Achieved: {goal.target_value} {goal.unit}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <Card className="border-primary/20 shadow-md fade-up">
          <CardContent className="py-16 text-center">
            <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-6">Create your first wellness goal to start tracking progress</p>
            <Button size="lg" onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
