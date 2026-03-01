"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Activity, Calendar, Dumbbell } from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

interface Exercise {
  id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
  notes: string;
}

interface Workout {
  id: string;
  workout_type: string;
  duration_minutes: number;
  calories_burned: number;
  workout_date: string;
  notes: string;
  exercises: Exercise[];
}

interface Goal {
  id: string;
  title: string;
}

interface WorkoutsManagerProps {
  workouts: Workout[];
  activeGoals: Goal[];
  userId: string;
}

export default function WorkoutsManager({ workouts, activeGoals, userId }: WorkoutsManagerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    workout_type: "",
    duration_minutes: "",
    calories_burned: "",
    workout_date: new Date().toISOString().split('T')[0],
    notes: "",
  });
  const [exercises, setExercises] = useState<Array<{
    exercise_name: string;
    sets: string;
    reps: string;
    weight: string;
    notes: string;
  }>>([]);

  const addExercise = () => {
    setExercises([...exercises, { exercise_name: "", sets: "", reps: "", weight: "", notes: "" }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      const { data: workout, error: workoutError } = await supabase
        .from("workouts")
        .insert({
          user_id: userId,
          workout_type: formData.workout_type,
          duration_minutes: parseInt(formData.duration_minutes),
          calories_burned: parseFloat(formData.calories_burned) || null,
          workout_date: formData.workout_date,
          notes: formData.notes,
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      if (exercises.length > 0 && workout) {
        const exerciseData = exercises.map(ex => ({
          workout_id: workout.id,
          exercise_name: ex.exercise_name,
          sets: parseInt(ex.sets) || null,
          reps: parseInt(ex.reps) || null,
          weight: parseFloat(ex.weight) || null,
          notes: ex.notes,
        }));

        const { error: exerciseError } = await supabase
          .from("exercises")
          .insert(exerciseData);

        if (exerciseError) throw exerciseError;
      }

      setOpen(false);
      setFormData({
        workout_type: "",
        duration_minutes: "",
        calories_burned: "",
        workout_date: new Date().toISOString().split('T')[0],
        notes: "",
      });
      setExercises([]);
      router.refresh();
    } catch (error) {
      console.error("Error logging workout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between fade-up">
        <div>
          <h1 className="text-4xl font-bold mb-2">Workouts</h1>
          <p className="text-muted-foreground text-lg">Track your fitness activities</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="h-12">
              <Plus className="mr-2 h-5 w-5" />
              Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Log Workout</DialogTitle>
              <DialogDescription>Record your fitness activity</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workout_type">Workout Type</Label>
                  <Select value={formData.workout_type} onValueChange={(value) => setFormData({ ...formData, workout_type: value })}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardio">Cardio</SelectItem>
                      <SelectItem value="Strength">Strength Training</SelectItem>
                      <SelectItem value="Yoga">Yoga</SelectItem>
                      <SelectItem value="HIIT">HIIT</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workout_date">Date</Label>
                  <Input
                    id="workout_date"
                    type="date"
                    value={formData.workout_date}
                    onChange={(e) => setFormData({ ...formData, workout_date: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    placeholder="30"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calories_burned">Calories Burned (optional)</Label>
                  <Input
                    id="calories_burned"
                    type="number"
                    step="0.01"
                    placeholder="200"
                    value={formData.calories_burned}
                    onChange={(e) => setFormData({ ...formData, calories_burned: e.target.value })}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="How did you feel? Any observations..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base">Exercises (optional)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addExercise}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Exercise
                  </Button>
                </div>
                {exercises.map((exercise, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-4 mb-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Exercise {index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExercise(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <Input
                      placeholder="Exercise name"
                      value={exercise.exercise_name}
                      onChange={(e) => updateExercise(index, "exercise_name", e.target.value)}
                      className="h-10"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        placeholder="Sets"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, "sets", e.target.value)}
                        className="h-10"
                      />
                      <Input
                        type="number"
                        placeholder="Reps"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, "reps", e.target.value)}
                        className="h-10"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Weight (kg)"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(index, "weight", e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Saving..." : "Log Workout"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {workouts.length > 0 ? (
        <div className="space-y-4 fade-up" style={{ animationDelay: '80ms' }}>
          {workouts.map((workout, idx) => (
            <Card key={workout.id} className="border-primary/20 shadow-md hover:shadow-lg transition-shadow fade-up" style={{ animationDelay: `${idx * 80}ms` }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl capitalize">{workout.workout_type}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(workout.workout_date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold font-mono text-primary">{workout.duration_minutes}</p>
                    <p className="text-xs text-muted-foreground">minutes</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {workout.calories_burned && (
                  <div className="bg-muted/30 rounded-lg p-3 inline-block">
                    <p className="text-sm text-muted-foreground">Calories Burned</p>
                    <p className="text-xl font-bold font-mono">{workout.calories_burned}</p>
                  </div>
                )}
                {workout.notes && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{workout.notes}</p>
                  </div>
                )}
                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Dumbbell className="h-4 w-4 text-primary" />
                      Exercises
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {workout.exercises.map((exercise) => (
                        <div key={exercise.id} className="bg-muted/30 rounded-lg p-3 border">
                          <p className="font-semibold text-sm mb-1">{exercise.exercise_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {exercise.sets && `${exercise.sets} sets`}
                            {exercise.reps && ` × ${exercise.reps} reps`}
                            {exercise.weight && ` @ ${exercise.weight}kg`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-primary/20 shadow-md fade-up">
          <CardContent className="py-16 text-center">
            <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No workouts logged yet</h3>
            <p className="text-muted-foreground mb-6">Start tracking your fitness activities</p>
            <Button size="lg" onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-5 w-5" />
              Log Your First Workout
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
