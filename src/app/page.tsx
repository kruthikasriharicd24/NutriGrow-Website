import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { ArrowUpRight, Apple, Activity, Target, TrendingUp, Heart, Utensils } from 'lucide-react';
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen noise-texture">
      <Navbar />
      <Hero />
      
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-4xl font-bold mb-4">Your Complete Wellness Platform</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Track nutrition, log workouts, set goals, and visualize your progress—all in one beautiful, intuitive platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: <Apple className="w-8 h-8" />, 
                title: "Meal Tracking", 
                description: "Log your meals with detailed macro breakdowns and nutrition insights" 
              },
              { 
                icon: <Utensils className="w-8 h-8" />, 
                title: "Curated Meal Plans", 
                description: "Browse personalized plans tailored to your dietary preferences" 
              },
              { 
                icon: <Activity className="w-8 h-8" />, 
                title: "Workout Logging", 
                description: "Record your fitness activities with exercise details and duration" 
              },
              { 
                icon: <Target className="w-8 h-8" />, 
                title: "Goal Setting", 
                description: "Set wellness targets and track your progress with visual timelines" 
              },
              { 
                icon: <TrendingUp className="w-8 h-8" />, 
                title: "Progress Analytics", 
                description: "Visualize your journey with beautiful charts and data insights" 
              },
              { 
                icon: <Heart className="w-8 h-8" />, 
                title: "BMI Tracking", 
                description: "Monitor your body metrics and see how they change over time" 
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="p-8 bg-card rounded-xl border border-primary/20 shadow-md hover:shadow-lg transition-all hover:border-primary/40 fade-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="fade-up">
              <div className="text-5xl font-bold mb-2 font-mono">5+</div>
              <div className="text-primary-foreground/80 text-lg">Dietary Categories</div>
            </div>
            <div className="fade-up" style={{ animationDelay: '80ms' }}>
              <div className="text-5xl font-bold mb-2 font-mono">100%</div>
              <div className="text-primary-foreground/80 text-lg">Personalized Experience</div>
            </div>
            <div className="fade-up" style={{ animationDelay: '160ms' }}>
              <div className="text-5xl font-bold mb-2 font-mono">24/7</div>
              <div className="text-primary-foreground/80 text-lg">Access Your Data</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="fade-up">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Wellness?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join NutriGrow today and take control of your nutrition and fitness journey with data-driven insights.
            </p>
            <a 
              href={user ? "/dashboard" : "/sign-up"} 
              className="inline-flex items-center px-8 py-4 text-white bg-accent rounded-xl hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl text-lg font-semibold"
            >
              {user ? "Go to Dashboard" : "Get Started Free"}
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
