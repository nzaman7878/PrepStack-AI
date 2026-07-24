import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Clock, Target, Code2 } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">Welcome back, Developer! 👋</h1>
        <p className="text-muted-foreground text-lg">Here's your progress and recommended tracks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full text-orange-500">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">3 Days</p>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full text-blue-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">12h 45m</p>
              <p className="text-sm text-muted-foreground">Learning Time</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full text-green-500">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">78%</p>
              <p className="text-sm text-muted-foreground">Frontend Readiness</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full text-purple-500">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">42</p>
              <p className="text-sm text-muted-foreground">Problems Solved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Continue Learning</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>React Performance Optimization</CardTitle>
              <CardDescription>Advanced Frontend Track</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">
                Learn about useMemo, useCallback, React.memo, and virtualization techniques.
              </p>
              <div className="w-full bg-secondary h-2 rounded-full mb-4">
                <div className="bg-primary h-2 rounded-full w-[60%]"></div>
              </div>
              <Button className="w-full">Resume Topic</Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>RAG Architecture Overview</CardTitle>
              <CardDescription>Generative AI Track</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">
                Understanding Retrieval-Augmented Generation, vector embeddings, and semantic search.
              </p>
              <div className="w-full bg-secondary h-2 rounded-full mb-4">
                <div className="bg-primary h-2 rounded-full w-[15%]"></div>
              </div>
              <Button className="w-full">Resume Topic</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
