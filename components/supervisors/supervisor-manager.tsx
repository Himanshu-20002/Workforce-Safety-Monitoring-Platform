'use client';

import { useState } from 'react';
import { createSupervisor, deleteSupervisor } from '@/actions/supervisors';
import { UserCheck, Trash2, X, Plus, AlertTriangle, ShieldCheck } from 'lucide-react';
import { z } from 'zod';

const supervisorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

interface Supervisor {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  status: string | null;
}

interface SupervisorManagerProps {
  initialSupervisors: Supervisor[];
}

export function SupervisorManager({ initialSupervisors }: SupervisorManagerProps) {
  const [supervisors, setSupervisors] = useState<Supervisor[]>(initialSupervisors);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const parsed = supervisorSchema.safeParse({ name, email, password });
      if (!parsed.success) {
        setError(parsed.error.errors[0].message);
        setLoading(false);
        return;
      }

      const res = await createSupervisor(parsed.data);
      if (res.success) {
        setIsAddOpen(false);
        // Reset fields
        setName('');
        setEmail('');
        setPassword('');
        window.location.reload();
      } else {
        setError(res.error || 'Failed to create supervisor');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSupervisor) return;
    setError('');
    setLoading(true);

    try {
      const res = await deleteSupervisor(selectedSupervisor.id);
      if (res.success) {
        setIsDeleteOpen(false);
        setSelectedSupervisor(null);
        window.location.reload();
      } else {
        setError(res.error || 'Failed to delete supervisor');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Supervisors Management</h1>
          <p className="text-muted-foreground text-sm">
            Configure safety officers, site managers, and oversee workspace administrative rights.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity self-start sm:self-auto shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Supervisor
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/80 font-semibold text-muted-foreground text-left">
              <tr>
                <th className="px-6 py-4">Supervisor Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Role Privileges</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {supervisors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="p-3 rounded-full bg-muted text-muted-foreground">
                        <UserCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">No supervisors registered</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Get started by registering a new safety supervisor for your sites.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                supervisors.map((sup) => (
                  <tr key={sup.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">{sup.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{sup.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/10 dark:bg-blue-950/40 dark:text-blue-400">
                        <ShieldCheck className="h-3 w-3" />
                        Supervisor
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedSupervisor(sup);
                          setIsDeleteOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 transition-colors"
                        title="Delete Supervisor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supervisor Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-card rounded-xl border border-border p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Register New Supervisor</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/10 p-3 rounded-lg border border-rose-200 dark:border-rose-900/50">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="supervisor@guardops.com"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Access Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-sm font-semibold border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && selectedSupervisor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-card rounded-xl border border-border p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 bg-rose-50 dark:bg-rose-950/20 rounded-lg">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Revoke Supervisor Access?</h3>
            </div>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete supervisor <span className="font-bold text-foreground">{selectedSupervisor.name}</span>? They will immediately lose access to safety reports and violations registry.
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
    </div>
  );
}
