'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  AlertTriangle,
  ShieldAlert,
  Shield,
  FileText,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  session: any;
}

export function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Resolve links based on user role
  const links =
    role === 'admin'
      ? [
          { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Workers', href: '/admin/workers', icon: Users },
          { name: 'Supervisors', href: '/admin/supervisors', icon: UserCheck },
          { name: 'Alerts', href: '/admin/alerts', icon: AlertTriangle },
        ]
      : [
          { name: 'Dashboard', href: '/supervisor/dashboard', icon: LayoutDashboard },
          { name: 'Workers', href: '/supervisor/workers', icon: Users },
          { name: 'Violations', href: '/supervisor/violations', icon: ShieldAlert },
          { name: 'Analytics', href: '/supervisor/analytics', icon: BarChart3 },
          { name: 'Reports', href: '/supervisor/reports', icon: FileText },
        ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 w-full z-45 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="font-bold text-lg text-foreground">GuardOps</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme toggler */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          {/* Hamburger toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-50/90 dark:bg-zinc-950/95 backdrop-blur-md border-r border-border/80 shadow-[1px_0_12px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 p-6 space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary shadow-sm">
                <Shield className="h-5 w-5 fill-primary/20 text-primary" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-foreground block leading-tight">GuardOps</span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">Safety Ops</span>
              </div>
            </div>
            {/* Mobile close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu Links */}
          <nav className="flex-1 space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info (Theme Toggle + User Menu stacked vertically) */}
        <div className="p-4 border-t border-border/60 bg-slate-100/50 dark:bg-zinc-900/30 space-y-3">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <>
                <Moon className="h-4 w-4 text-muted-foreground" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="h-4 w-4 text-muted-foreground" />
                <span>Light Mode</span>
              </>
            )}
          </button>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
              className="w-full flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-muted/80 transition-colors border border-transparent hover:border-border"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shrink-0">
                  {session.user.name ? session.user.name.substring(0, 2).toUpperCase() : 'US'}
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {session.user.name || 'User'}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </button>

            {dropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-border bg-card p-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-100">
                <div className="px-3 py-2.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                    Account Details
                  </p>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">
                      {session.user.name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-md bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50 capitalize">
                      {session.user.role || 'User'}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-border my-1.5" />

                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors font-medium disabled:opacity-50 text-left"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  {loading ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs md:hidden"
        />
      )}
    </>
  );
}
