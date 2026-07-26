'use client';

import { useState } from 'react';
import { downloadCSV } from '@/lib/csv';
import { FileDown, FileSpreadsheet, ShieldCheck, AlertCircle } from 'lucide-react';

interface ViolationData {
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

interface ReportsDashboardProps {
  violations: ViolationData[];
}

export function ReportsDashboard({ violations }: ReportsDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExport = () => {
    setError('');
    setLoading(true);

    try {
      if (violations.length === 0) {
        setError('No safety violations available to export.');
        setLoading(false);
        return;
      }

      // Map safety violations to exact requested CSV format:
      // Worker, Site, Violation, Time, Status
      const csvData = violations.map((v) => ({
        Worker: v.workerName,
        Site: v.locationName || v.workerSite || 'General Zone',
        Violation: v.type.replace('_', ' ').toUpperCase(),
        Time: new Date(v.createdAt).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        Status: v.status,
      }));

      const timestamp = new Date().toISOString().split('T')[0];
      downloadCSV(csvData, `safety-violations-report-${timestamp}.csv`);
      setLoading(false);
    } catch (err) {
      setError('An error occurred while generating the CSV report.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/10 p-3 rounded-lg border border-rose-200 dark:border-rose-900/50">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Export Configuration Card */}
        <div className="md:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">Safety Violations Report</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Export the current list of recorded PPE safety violations across all operating zones. 
              The generated report compiles worker identities, employee IDs, locations, violation categories, timestamps, and active status tags.
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/40 text-xs text-muted-foreground font-medium">
            <FileSpreadsheet className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="font-bold text-foreground">Report Format: CSV (Comma Separated Values)</p>
              <p className="mt-0.5">Compatible with spreadsheet software (Excel, Numbers, Sheets) for auditing compliance logs.</p>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={loading || violations.length === 0}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm"
          >
            <FileDown className="h-4 w-4" />
            {loading ? 'Generating Report...' : 'Export Violations to CSV'}
          </button>
        </div>

        {/* Overview Stats Card */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Report Metadata</h3>
            <p className="text-xs text-muted-foreground">Scope: All recorded PPE alerts</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border/45">
              <span className="text-xs text-muted-foreground font-medium">Available Records</span>
              <span className="text-sm font-bold text-foreground">{violations.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/45">
              <span className="text-xs text-muted-foreground font-medium">Export Type</span>
              <span className="text-xs font-bold text-foreground capitalize">CSV Export Only</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-muted-foreground font-medium">Compliance Check</span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                <ShieldCheck className="h-3.5 w-3.5" /> Database Synced
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
