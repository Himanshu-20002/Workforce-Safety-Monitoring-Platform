'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Input } from '@/components/ui/input';

interface WorkersFilterProps {
  sites: string[];
  currentSearch?: string;
  currentSite?: string;
}

export function WorkersFilter({ sites, currentSearch = '', currentSite = 'all' }: WorkersFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset to first page
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSiteChange = (site: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset to first page
    if (site && site !== 'all') {
      params.set('site', site);
    } else {
      params.delete('site');
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search workers by name..."
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full sm:w-48">
        <select
          value={currentSite}
          onChange={(e) => handleSiteChange(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          <option value="all">All Sites</option>
          {sites.map((site) => (
            <option key={site} value={site}>
              {site}
            </option>
          ))}
        </select>
      </div>
      {isPending && (
        <span className="text-sm text-muted-foreground self-center animate-pulse">
          Updating...
        </span>
      )}
    </div>
  );
}
