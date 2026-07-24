import { Outlet, Link } from 'react-router';
import { Home, Compass, Bookmark, Settings, LogOut, Menu, Map, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Layout() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">PS</span>
            </div>
            <span className="font-headline font-bold">PrepStack AI ⭐⭐⭐⭐⭐</span>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md bg-secondary text-secondary-foreground font-medium">
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link to="/tracks" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-medium transition-colors">
            <Compass className="h-4 w-4" />
            Explore Tracks
          </Link>
          <Link to="/roadmap" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-medium transition-colors">
            <Map className="h-4 w-4" />
            Roadmap
          </Link>
          <Link to="/bookmarks" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-medium transition-colors">
            <Bookmark className="h-4 w-4" />
            Bookmarks
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-medium transition-colors">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-background flex items-center justify-between px-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-4">
              <Menu className="h-5 w-5" />
            </Button>
            <span className="md:hidden font-headline font-bold text-lg">PrepStack AI</span>
          </div>
          
          <div className="flex-1 flex justify-end md:justify-start md:ml-4 max-w-md hidden md:flex relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search topics, questions, cheat sheets... (Cmd+K)" 
                className="w-full h-10 bg-secondary/50 border border-transparent rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
