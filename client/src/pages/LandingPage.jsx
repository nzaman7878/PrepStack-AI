import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Code, Target } from 'lucide-react';

import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

export default function LandingPage() {
  useDocumentTitle('The Ultimate Full Stack Interview Prep');
  const { user, isLoading } = useContext(AuthContext);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* TopNav */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold font-headline">PS</span>
            </div>
            <span className="font-headline font-bold text-xl tracking-tight">PrepStack AI </span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link to="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">Features</Link>
            <Link to="#solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground">Solutions</Link>
            <Link to="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            {!isLoading && user ? (
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container py-24 md:py-32 flex flex-col items-center text-center">
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-foreground max-w-4xl mb-6 leading-tight">
            Master Your Next Interview with <span className="text-primary">AI-Powered Precision</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10 font-body">
            Everything you need for full-stack interview prep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full">Get Started</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full">Explore Tracks</Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-muted/50 py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Everything you need to succeed</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our platform combines structured learning with adaptive AI to give you the most effective preparation possible.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">AI Generated Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Tailored explanations, analogies, and questions generated on-demand by advanced AI to match your exact skill level.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">Mock Interviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Realistic simulations with an AI interviewer. Get real-time coaching, follow-ups, and actionable feedback.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">Interactive Practice</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Skill-building exercises including code completion, bug fixing, and guess-the-output for every major tech stack.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">PS</span>
            </div>
            <span className="font-headline font-bold">PrepStack AI </span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PrepStack AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
