import Link from "next/link";
import { ArrowUpRight, Check } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 opacity-70" />
      
      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto fade-up">
            <h1 className="text-5xl sm:text-7xl font-bold mb-8 tracking-tight">
              Your Wellness,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Simplified
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Track nutrition, log workouts, and achieve your health goals with NutriGrow—your personalized wellness companion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-8 py-4 text-white bg-accent rounded-xl hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl text-lg font-semibold"
              >
                Start Your Journey
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>
              
              <Link
                href="/sign-in"
                className="inline-flex items-center px-8 py-4 text-foreground bg-muted rounded-xl hover:bg-muted/80 transition-colors text-lg font-semibold"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Personalized plans</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Track your progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
