import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { Sidebar } from '@/components/layout/sidebar';

export default async function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as any)?.role;

  if (role !== 'supervisor') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar session={session} />
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
