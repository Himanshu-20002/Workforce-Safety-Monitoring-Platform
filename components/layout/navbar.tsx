'use client';

import { useRouter, usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useSession } from '@/lib/auth-client';
import { useState, useEffect } from 'react';
import { Sun, Moon, LogOut, ChevronDown } from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClose = () => setDropdownOpen(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [dropdownOpen]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
      router.push('/sign-in');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) return null;

  const role = (session.user as any).role || 'worker';

  const linkClass = (path: string) =>
    `text-sm font-semibold transition-colors hover:text-primary ${
      pathname === path ? 'text-primary' : 'text-muted-foreground'
    }`;

  return (
    <nav className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold">Workforce Safety</h1>
        
        {/* Navigation links based on role */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {role === 'admin' && (
            <>
              <a href="/admin/dashboard" className={linkClass('/admin/dashboard')}>
                Dashboard
              </a>
              <a href="/admin/workers" className={linkClass('/admin/workers')}>
                Workers
              </a>
              <a href="/admin/supervisors" className={linkClass('/admin/supervisors')}>
                Supervisors
              </a>
              <a href="/admin/alerts" className={linkClass('/admin/alerts')}>
                Alerts
              </a>
            </>
          )}
          {role === 'supervisor' && (
            <>
              <a href="/supervisor/dashboard" className={linkClass('/supervisor/dashboard')}>
                Dashboard
              </a>
              <a href="/supervisor/violations" className={linkClass('/supervisor/violations')}>
                Violations
              </a>
              <a href="/supervisor/reports" className={linkClass('/supervisor/reports')}>
                Reports
              </a>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-1.5 p-1 rounded-full hover:bg-muted/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none border border-transparent hover:border-border"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs tracking-wider border border-primary/20">
              {session.user.name ? session.user.name.substring(0, 2).toUpperCase() : 'US'}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl border border-border bg-card p-1.5 shadow-md z-50 animate-in fade-in slide-in-from-top-2 duration-100">
              <div className="px-3 py-2.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                  Account Details
                </p>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground leading-none">
                    {session.user.name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user.email}
                  </p>
                </div>
                <div className="mt-2">
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold border ${
                    role === 'admin' 
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50'
                      : role === 'supervisor'
                        ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/50'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50'
                  }`}>
                    {role}
                  </span>
                </div>
              </div>
              
              <div className="h-px bg-border my-1.5" />

              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors font-medium disabled:opacity-50 text-left"
              >
                <LogOut className="h-4 w-4" />
                {loading ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
