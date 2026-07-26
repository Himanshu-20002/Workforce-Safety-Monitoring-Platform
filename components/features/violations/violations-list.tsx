'use client';

import { useState } from 'react';
import { acknowledgeViolation } from '@/actions/violations';
import { ShieldCheck, AlertCircle, Clock, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface ViolationRow {
  id: string;
  type: string;
  description: string;
  severity: string;
  status: string;
  createdAt: Date;
  acknowledgedAt: Date | null;
  workerName: string;
  workerSite: string | null;
  locationName: string | null;
}

interface ViolationsListProps {
  initialViolations: ViolationRow[];
}

export function ViolationsList({ initialViolations }: ViolationsListProps) {
  const [violations, setViolations] = useState<ViolationRow[]>(initialViolations);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Confirmation modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<ViolationRow | null>(null);

  const triggerAcknowledgeConfirm = (violation: ViolationRow) => {
    setSelectedViolation(violation);
    setIsConfirmOpen(true);
  };

  const handleAcknowledge = async () => {
    if (!selectedViolation) return;
    const id = selectedViolation.id;
    setError('');
    setLoadingId(id);
    setIsConfirmOpen(false);

    try {
      const res = await acknowledgeViolation(id);
      if (res.success) {
        toast(`Acknowledge logged for ${selectedViolation.workerName}'s violation.`, 'success');
        setSelectedViolation(null);
        // Refresh violations list locally or refresh router
        window.location.reload();
      } else {
        const errMsg = res.error || 'Failed to acknowledge';
        setError(errMsg);
        toast(errMsg, 'error');
        setLoadingId(null);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      toast('An unexpected error occurred', 'error');
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/10 p-3 rounded-lg border border-rose-200 dark:border-rose-900/50 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/80 font-semibold text-muted-foreground text-left">
              <tr>
                <th className="px-6 py-4">Worker</th>
                <th className="px-6 py-4">Site</th>
                <th className="px-6 py-4">Violation Type</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {violations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="p-3 rounded-full bg-muted text-muted-foreground">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">No violations recorded</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Excellent safety compliance! No PPE violations exist in the database.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                violations.map((v) => {
                  const isPending =
                    v.status.toLowerCase() === 'open' ||
                    v.status.toLowerCase() === 'pending';

                  const dateString = new Date(v.createdAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  });

                  const ackString = v.acknowledgedAt
                    ? new Date(v.acknowledgedAt).toLocaleString('en-US', {
                        timeStyle: 'short',
                      })
                    : '';

                  let statusBadgeClass = '';
                  if (isPending) {
                    statusBadgeClass =
                      'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400';
                  } else {
                    statusBadgeClass =
                      'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400';
                  }

                  return (
                    <tr key={v.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {v.workerName}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-medium">
                        {v.locationName || v.workerSite || 'General Zone'}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                        <span className="font-semibold text-foreground block capitalize">
                          {v.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs">{v.description}</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground flex items-center gap-1.5 pt-6">
                        <Clock className="h-3.5 w-3.5" />
                        {dateString}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${statusBadgeClass}`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isPending ? (
                          <button
                            onClick={() => triggerAcknowledgeConfirm(v)}
                            disabled={loadingId !== null}
                            className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm"
                          >
                            {loadingId === v.id ? 'Acknowledging...' : 'Acknowledge'}
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-muted-foreground flex items-center justify-end gap-1">
                            <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                            Ack at {ackString}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && selectedViolation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-card rounded-xl border border-border p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-3 text-amber-500">
              <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Acknowledge Violation?</h3>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Confirm safety incident acknowledgment for worker <span className="font-bold text-foreground">{selectedViolation.workerName}</span> regarding <span className="font-bold text-foreground capitalize">{selectedViolation.type.replace('_', ' ')}</span>.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsConfirmOpen(false);
                  setSelectedViolation(null);
                }}
                className="px-4 py-2 text-sm font-semibold border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAcknowledge}
                className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Confirm Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
