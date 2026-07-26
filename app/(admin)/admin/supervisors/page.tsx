import { getSupervisors } from '@/actions/supervisors';
import { SupervisorManager } from '@/components/features/supervisors/supervisor-manager';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export default async function SupervisorsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect('/sign-in');
  }

  const { supervisors = [] } = await getSupervisors();

  return <SupervisorManager initialSupervisors={supervisors as any} />;
}
