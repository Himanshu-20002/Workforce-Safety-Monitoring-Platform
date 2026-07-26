import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import { AnimatedCounter } from '@/components/animated-counter';

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const role = (user as any)?.role || 'worker';

  // Dashboard URL based on user role
  const dashboardUrl = role === 'admin' ? '/admin/dashboard' : '/supervisor/dashboard';

  return (
    <>
      {/* Load Material Icons */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        {/* Top Header */}
        <header className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
          <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-16">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">security</span>
              <span className="text-xl font-bold tracking-tight text-foreground">GuardOps</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a className="text-sm font-semibold text-primary transition-colors" href="#features">Features</a>
              <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#workflow">Workflow</a>
              <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#control">Control</a>
            </nav>

            <div className="flex items-center gap-4">
              {user ? (
                <Link
                  href={dashboardUrl}
                  className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/sign-in"
                    className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="pt-16">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span className="text-xs font-semibold uppercase tracking-wider">Enterprise Ready</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
                  Monitor Workforce Safety <br />{' '}
                  <span className="text-primary">with Confidence</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  A vigilant command center for high-stakes environments. Real-time telemetry, automated incident
                  detection, and compliance reporting—all in one streamlined interface.
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    href={user ? dashboardUrl : '/sign-in'}
                    className="bg-primary text-primary-foreground font-semibold text-sm px-6 py-3 rounded-lg shadow-lg shadow-primary/10 hover:scale-[1.02] transition-transform"
                  >
                    Get Started
                  </Link>
                  <Link
                    href={user ? dashboardUrl : '/sign-in'}
                    className="bg-muted text-muted-foreground font-semibold text-sm px-6 py-3 rounded-lg border border-border/40 hover:bg-muted/80 transition-colors"
                  >
                    View Dashboard
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full"></div>
                {/* Mockup Frame */}
                <div className="relative border border-border bg-card rounded-xl shadow-xl overflow-hidden aspect-[4/3] flex flex-col">
                  <div className="h-10 bg-muted/65 flex items-center px-4 gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="flex-1 bg-card flex flex-col p-6 gap-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 rounded-lg bg-muted/30 border border-border/40 p-4 flex flex-col justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Live Workers</span>
                        <span className="text-2xl font-bold text-primary">1,248</span>
                      </div>
                      <div className="h-24 rounded-lg bg-muted/30 border border-border/40 p-4 flex flex-col justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Active Hazards</span>
                        <span className="text-2xl font-bold text-rose-500">02</span>
                      </div>
                      <div className="h-24 rounded-lg bg-muted/30 border border-border/40 p-4 flex flex-col justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Safety Rating</span>
                        <span className="text-2xl font-bold text-emerald-500">98.2%</span>
                      </div>
                    </div>
                    <div className="flex-1 rounded-lg bg-muted/40 border border-border/40 p-5 space-y-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold text-foreground">Recent Safety Events</span>
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[9px] font-extrabold rounded-full">Live Feed</span>
                      </div>
                      <div className="space-y-2">
                        {/* Mock Item 1 */}
                        <div className="p-3 bg-card border border-border/40 rounded-lg flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                            <div className="text-left">
                              <p className="font-bold text-foreground">John Doe • Zone A</p>
                              <p className="text-[9px] text-muted-foreground font-semibold">Missing Helmet Violation</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-semibold text-rose-500">2m ago</span>
                        </div>
                        {/* Mock Item 2 */}
                        <div className="p-3 bg-card border border-border/40 rounded-lg flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            <div className="text-left">
                              <p className="font-bold text-foreground">Sarah Connor • Zone B</p>
                              <p className="text-[9px] text-muted-foreground font-semibold">Unanchored Safety Harness</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-semibold text-amber-500">12m ago</span>
                        </div>
                        {/* Mock Item 3 */}
                        <div className="p-3 bg-card border border-border/40 rounded-lg flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            <div className="text-left">
                              <p className="font-bold text-foreground">Alex Mercer • Zone C</p>
                              <p className="text-[9px] text-muted-foreground font-semibold">Missing Safety Shoes</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-semibold text-blue-500">24m ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-muted/30 py-16 px-6 border-y border-border/50">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-4xl font-extrabold text-primary mb-1">
                  <AnimatedCounter target={15} suffix="+" />
                </p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Monitoring Sites</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-primary mb-1">
                  <AnimatedCounter target={98} suffix="%" />
                </p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Compliance Rating</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-primary mb-1">
                  <AnimatedCounter target={12} suffix="+" />
                </p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Registered Officers</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-primary mb-1">
                  <AnimatedCounter target={120} suffix="+" />
                </p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Workers Monitored</p>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section id="features" className="py-24 px-6 bg-card">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Engineered for Workforce Safety</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
                  Critical features designed to empower safety officers with real-time PPE tracking and automated response capabilities.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature Card 1 */}
                <div className="p-6 bg-card border border-border/55 rounded-xl hover:shadow-md transition-shadow space-y-4">
                  <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
                  <h3 className="text-lg font-bold text-foreground">Real-time PPE Detection</h3>
                  <p className="text-xs text-muted-foreground">
                    Instantly flags workers entering hazardous zones missing helmets, vests, safety harnesses, or protective gloves.
                  </p>
                </div>
                {/* Feature Card 2 */}
                <div className="p-6 bg-card border border-border/55 rounded-xl hover:shadow-md transition-shadow space-y-4">
                  <span className="material-symbols-outlined text-primary text-3xl">auto_mode</span>
                  <h3 className="text-lg font-bold text-foreground">Auto-Escalation Engine</h3>
                  <p className="text-xs text-muted-foreground">
                    Automatically escalates safety breaches to high-priority alerts if left unacknowledged by supervisors for 10 minutes.
                  </p>
                </div>
                {/* Feature Card 3 */}
                <div className="p-6 bg-card border border-border/55 rounded-xl hover:shadow-md transition-shadow space-y-4">
                  <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
                  <h3 className="text-lg font-bold text-foreground">Compliance Analytics</h3>
                  <p className="text-xs text-muted-foreground">
                    Generates interactive analytics for site safety ratings and item-by-item PPE violation breakdowns.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Workflow Section */}
          <section id="workflow" className="py-24 px-6 bg-muted/20 overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">The Safety Alert Workflow</h2>
                <p className="text-muted-foreground text-sm">Seamless alert tracking from the field camera to supervisor resolution.</p>
              </div>
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-border/40 -z-10"></div>
                <div className="flex-1 text-center bg-card p-6 rounded-xl border border-border/55 z-10 w-full space-y-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold mx-auto shadow-md shadow-primary/20">
                    1
                  </div>
                  <h4 className="text-sm font-semibold">Detection</h4>
                  <p className="text-xs text-muted-foreground">Automated cameras scan workers and flag missing safety gear.</p>
                </div>
                <div className="flex-1 text-center bg-card p-6 rounded-xl border border-border/55 z-10 w-full space-y-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold mx-auto shadow-md shadow-primary/20">
                    2
                  </div>
                  <h4 className="text-sm font-semibold">Violation Logged</h4>
                  <p className="text-xs text-muted-foreground">The system writes a new Pending violation entry to the database.</p>
                </div>
                <div className="flex-1 text-center bg-card p-6 rounded-xl border border-border/55 z-10 w-full space-y-3">
                  <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold mx-auto shadow-md shadow-rose-500/20">
                    3
                  </div>
                  <h4 className="text-sm font-semibold text-rose-500">Escalation Timer</h4>
                  <p className="text-xs text-muted-foreground">A 10-minute timer ticks down for supervisors to review the case.</p>
                </div>
                <div className="flex-1 text-center bg-card p-6 rounded-xl border border-border/55 z-10 w-full space-y-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold mx-auto shadow-md shadow-primary/20">
                    4
                  </div>
                  <h4 className="text-sm font-semibold">Resolution</h4>
                  <p className="text-xs text-muted-foreground">Officer acknowledges or resolves the alert to secure compliance.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Central Control Preview */}
          <section id="control" className="py-24 px-6 bg-slate-950 text-slate-100 overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Central Operations Control</h2>
                  <p className="text-slate-400 text-sm">Real-time situational compliance and alert status at any scale.</p>
                </div>
                <Link
                  href={user ? dashboardUrl : '/sign-in'}
                  className="px-4 py-2 border border-slate-800 rounded-lg text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  Launch Operations View
                </Link>
              </div>

              <div className="grid grid-cols-12 gap-8">
                {/* Global Safety Feed */}
                <div className="col-span-12 lg:col-span-4 bg-white/5 border border-white/10 rounded-xl p-6 h-[400px] flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Violations Feed</span>
                  </div>
                  <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-lg space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-rose-400 font-bold">HAZARD</span>
                        <span className="text-[10px] text-slate-500">14:02:11</span>
                      </div>
                      <p className="text-sm text-slate-300">Refinery East: Missing helmet detected on worker John Doe.</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-lg opacity-60 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-rose-400 font-bold">HAZARD</span>
                        <span className="text-[10px] text-slate-500">14:00:05</span>
                      </div>
                      <p className="text-sm text-slate-300">Storage Site A: Unanchored safety harness detected on worker Sarah Connor.</p>
                    </div>
                  </div>
                </div>

                {/* KPI Cards & Table */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-blue-600 p-6 rounded-xl border border-white/10">
                      <span className="text-xs text-blue-100 uppercase tracking-widest opacity-85 mb-1 block">Monitored Workers</span>
                      <span className="text-3xl font-extrabold text-white">120</span>
                    </div>
                    <div className="bg-rose-600 p-6 rounded-xl border border-white/10">
                      <span className="text-xs text-rose-100 uppercase tracking-widest opacity-85 mb-1 block">Active Violations</span>
                      <span className="text-3xl font-extrabold text-white">4</span>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/10 text-slate-300">
                        <tr className="text-xs uppercase font-semibold">
                          <th className="p-4">Worker ID</th>
                          <th className="p-4">Zone</th>
                          <th className="p-4">PPE Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300 divide-y divide-white/5">
                        <tr>
                          <td className="p-4 font-mono text-xs">ID-99238</td>
                          <td className="p-4">Refinery East</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs font-semibold">COMPLIANT</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-4 font-mono text-xs">ID-99241</td>
                          <td className="p-4">Deep Core 2</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded text-xs font-semibold">HELMET MISSING</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="py-24 px-6 bg-card">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg text-primary">
                  <span className="material-symbols-outlined">policy</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Regulatory Compliance</h3>
                <p className="text-xs text-muted-foreground">
                  Built-in frameworks for OSHA, ISO 45001, and local safety mandates across major industrial sites.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg text-primary">
                  <span className="material-symbols-outlined">speed</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Computer Vision Integration</h3>
                <p className="text-xs text-muted-foreground">
                  Compatible with standard site safety security cameras and video streams.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg text-primary">
                  <span className="material-symbols-outlined">lan</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Role-Based Workflows</h3>
                <p className="text-xs text-muted-foreground">
                  Streamlined, real-time alert acknowledging interfaces for both Administrators and Supervisors.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-[#2563eb] py-20 px-6 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
            <div className="max-w-4xl mx-auto relative z-10 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to monitor and protect your workforce?</h2>
              <p className="text-base text-blue-100 max-w-xl mx-auto">
                Secure your field compliance standing. Log in to start monitoring active zones.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={user ? dashboardUrl : '/sign-in'}
                  className="bg-white text-blue-600 font-bold px-8 py-3 rounded-lg shadow-lg hover:scale-[1.03] transition-transform"
                >
                  Request a Demo
                </Link>
                <Link
                  href={user ? dashboardUrl : '/sign-in'}
                  className="bg-blue-700/30 text-white border border-white/20 font-bold px-8 py-3 rounded-lg hover:bg-blue-700/50 transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border/50 py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-xl">security</span>
                <span className="text-base font-bold text-foreground">GuardOps</span>
              </div>
              <p className="text-xs text-muted-foreground max-w-xs">
                Engineering safer workplaces through advanced telemetry and automated vigilance.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2 text-xs">
                <li><a className="text-muted-foreground hover:text-primary transition-colors" href="#">Features</a></li>
                <li><a className="text-muted-foreground hover:text-primary transition-colors" href="#">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li><a className="text-muted-foreground hover:text-primary transition-colors" href="#">API Docs</a></li>
                <li><a className="text-muted-foreground hover:text-primary transition-colors" href="#">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2 text-xs">
                <li><a className="text-muted-foreground hover:text-primary transition-colors" href="#">About Us</a></li>
                <li><a className="text-muted-foreground hover:text-primary transition-colors" href="#">Safety Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto border-t border-border/50 mt-12 pt-6 text-center text-xs text-muted-foreground">
            © 2026 GuardOps. All rights reserved. Built for high-stakes workforce safety.
          </div>
        </footer>
      </div>
    </>
  );
}
