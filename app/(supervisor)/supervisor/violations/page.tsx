import { getViolations } from '@/actions/violations';
import { ViolationsList } from '@/components/features/violations/violations-list';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export default async function ViolationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect('/sign-in');
  }

  const { violations = [] } = await getViolations();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Safety Violations</h1>
        <p className="text-muted-foreground text-sm">
          Review, acknowledge, and resolve active PPE safety violations reported from site monitors.
        </p>
      </div>

      <ViolationsList initialViolations={violations as any} />
    </main>
  );
}
