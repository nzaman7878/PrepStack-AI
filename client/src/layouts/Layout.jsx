import { Outlet, Link } from 'react-router';
import { Home, Compass, Bookmark, Settings, LogOut, Menu } from 'lucide-react';
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
        <header className="h-16 border-b bg-background flex items-center px-6 md:hidden">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="ml-4 font-headline font-bold">PrepStack AI ⭐⭐⭐⭐⭐</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
