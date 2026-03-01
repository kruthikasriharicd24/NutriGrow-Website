CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    age integer,
    gender text,
    height numeric(5,2),
    weight numeric(5,2),
    bmi numeric(5,2),
    dietary_preference text,
    onboarding_completed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.meals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    meal_type text NOT NULL,
    meal_name text NOT NULL,
    description text,
    calories numeric(8,2),
    protein numeric(8,2),
    carbs numeric(8,2),
    fat numeric(8,2),
    vitamins text,
    meal_date date NOT NULL,
    meal_time timestamp with time zone DEFAULT timezone('utc'::text, now()),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.meal_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    dietary_category text NOT NULL,
    calories numeric(8,2),
    protein numeric(8,2),
    carbs numeric(8,2),
    fat numeric(8,2),
    duration_days integer,
    image_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.user_favorite_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    meal_plan_id uuid REFERENCES public.meal_plans(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, meal_plan_id)
);

CREATE TABLE IF NOT EXISTS public.goals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    target_value numeric(8,2),
    current_value numeric(8,2) DEFAULT 0,
    unit text,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status text DEFAULT 'active',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.workouts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    workout_type text NOT NULL,
    duration_minutes integer NOT NULL,
    calories_burned numeric(8,2),
    workout_date date NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.exercises (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id uuid REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
    exercise_name text NOT NULL,
    sets integer,
    reps integer,
    weight numeric(8,2),
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.goal_workouts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id uuid REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
    workout_id uuid REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(goal_id, workout_id)
);

CREATE INDEX IF NOT EXISTS idx_meals_user_date ON public.meals(user_id, meal_date);
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON public.workouts(user_id, workout_date);
CREATE INDEX IF NOT EXISTS idx_goals_user_status ON public.goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

INSERT INTO public.meal_plans (name, description, dietary_category, calories, protein, carbs, fat, duration_days, image_url) VALUES
('Mediterranean Delight', 'Heart-healthy plan rich in olive oil, fish, and fresh vegetables', 'Pescatarian', 1800, 85, 180, 70, 7, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80'),
('Plant Power', 'Complete vegan nutrition with diverse plant-based proteins', 'Vegan', 1600, 70, 200, 55, 7, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80'),
('Balanced Omnivore', 'Well-rounded meals with lean meats and vegetables', 'Non-Veg', 2000, 120, 180, 75, 7, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'),
('Veggie Vitality', 'Nutrient-dense vegetarian meals for sustained energy', 'Vegetarian', 1700, 75, 190, 60, 7, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80'),
('Egg Excellence', 'High-protein plan centered around eggs and dairy', 'Eggetarian', 1900, 95, 170, 70, 7, 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80'),
('Ocean Harvest', 'Seafood-focused nutrition with omega-3 benefits', 'Pescatarian', 1850, 90, 175, 68, 7, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80')
ON CONFLICT DO NOTHING;
