import { WorkersPageContent } from '@/components/features/workers/workers-page-content';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    site?: string;
    page?: string;
  }>;
}

export default async function AdminWorkersPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  return (
    <WorkersPageContent
      searchParams={resolvedParams}
      readOnly={false}
    />
  );
}

