'use client';

import { useState } from 'react';
import { deleteWorker, updateWorker } from '@/actions/workers';
import { Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { z } from 'zod';

const workerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  site: z.string().min(2, 'Site must be specified'),
  status: z.enum(['Active', 'Pending', 'Escalated']),
  jobProfile: z.string().optional(),
});

interface WorkerRowActionsProps {
  worker: {
    id: string;
    name: string;
    site: string | null;
    status: string | null;
    jobProfile: string | null;
  };
}

export function WorkerRowActions({ worker }: WorkerRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState(worker.name);
  const [site, setSite] = useState(worker.site || '');
  const [status, setStatus] = useState<any>(worker.status || 'Active');
  const [jobProfile, setJobProfile] = useState(worker.jobProfile || '');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const parsed = workerSchema.safeParse({
        name,
        site,
        status,
        jobProfile,
      });

      if (!parsed.success) {
        setError(parsed.error.errors[0].message);
        setLoading(false);
        return;
      }

      const res = await updateWorker(worker.id, parsed.data);
      if (res.success) {
        setIsEditOpen(false);
        window.location.reload();
      } else {
        setError(res.error || 'Failed to update');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await deleteWorker(worker.id);
      if (res.success) {
        setIsDeleteOpen(false);
        window.location.reload();
      } else {
        setError(res.error || 'Failed to delete');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsEditOpen(true)}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Edit Worker"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => setIsDeleteOpen(true)}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 transition-colors"
          title="Delete Worker"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-card rounded-xl border border-border p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Update Worker Profile</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/10 dark:text-rose-400 p-3 rounded-lg border border-rose-200 dark:border-rose-900/50">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Assigned Site
                </label>
                <input
                  type="text"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Job Profile
                </label>
                <input
                  type="text"
                  value={jobProfile}
                  onChange={(e) => setJobProfile(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Escalated">Escalated</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 text-sm font-semibold border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-card rounded-xl border border-border p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 bg-rose-50 dark:bg-rose-950/20 rounded-lg">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Remove Worker?</h3>
            </div>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete worker <span className="font-bold text-foreground">{worker.name}</span>? This action is permanent.
            </p>

            {error && (
              <div className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/10 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 text-sm font-semibold border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
