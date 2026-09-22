"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Inbox,
  Search,
} from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';

type Application = {
  id: string;
  referenceNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  status: string;
  annualIncome: string;
  createdAt: string;
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [error, setError] = useState('');

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/admin/applications?${params}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.data);
        setMeta(data.meta);
      } else {
        setError('Could not load applications. Please try again.');
      }
    } catch {
      setError('Could not reach the server. Please try again.');
    }
    setLoading(false);
  }, [page, statusFilter, search]);

  useEffect(() => {
    const timer = setTimeout(() => fetchApplications(), 300);
    return () => clearTimeout(timer);
  }, [fetchApplications]);

  const handleExport = async () => {
    setExporting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/applications/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters: { status: statusFilter !== 'all' ? statusFilter : undefined, search: search || undefined },
          options: { includeSummary: true, includeDetails: true, maskSensitive: true, watermark: 'CONFIDENTIAL', generatedBy: '' },
        }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `acrp-applications-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        setError('Failed to generate the PDF report.');
      }
    } catch {
      setError('Error exporting PDF.');
    }
    setExporting(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#162e51] font-serif">Applications</h1>
          <p className="mt-1 text-sm text-[#454545]">
            Every submitted grant application. Open one to see the full form.
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-md bg-[#d83933] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#b50909] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={15} />
          {exporting ? 'Generating…' : 'Export PDF Report'}
        </button>
      </header>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-[#d83933] bg-[#fde0de] px-4 py-3 text-sm text-[#8b0000]">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-md border border-[#e6e6e6] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#757575]" />
          <input
            type="text"
            placeholder="Search by name, email or reference…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-md border border-[#adadad] bg-white py-2.5 pl-10 pr-3 text-sm text-[#1b1b1b] placeholder:text-[#757575] outline-none transition-colors focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480]"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map(option => {
            const active = statusFilter === option.value;
            return (
              <button
                key={option.value}
                onClick={() => { setStatusFilter(option.value); setPage(1); }}
                className={`rounded-md px-3 py-2 text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#1a4480] text-white'
                    : 'text-[#454545] hover:bg-[#f0f0f0] hover:text-[#1b1b1b]'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-[#e6e6e6] bg-white shadow-sm">
        {loading ? (
          <div className="px-6 py-16 text-center text-sm text-[#757575]">Loading applications…</div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-md border border-[#e6e6e6] bg-[#f0f0f0] text-[#757575]">
              <Inbox size={22} />
            </span>
            <p className="text-sm font-bold text-[#162e51]">No applications found</p>
            <p className="max-w-sm text-xs text-[#757575]">
              {search || statusFilter !== 'all'
                ? 'Try clearing your search or filters.'
                : 'Submissions from the public form will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#162e51] text-white">
                <tr className="border-b border-[#e6e6e6] text-[0.7rem] uppercase tracking-wider">
                  <th className="px-5 py-3 font-bold font-serif">Reference</th>
                  <th className="px-5 py-3 font-bold font-serif">Applicant</th>
                  <th className="px-5 py-3 font-bold font-serif">Email</th>
                  <th className="px-5 py-3 font-bold font-serif">State</th>
                  <th className="px-5 py-3 font-bold font-serif">Status</th>
                  <th className="px-5 py-3 font-bold font-serif">Submitted</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e6e6] bg-white">
                {applications.map(app => (
                  <tr key={app.id} className="transition-colors hover:bg-[#f0f0f0]">
                    <td className="px-5 py-3.5 font-mono text-xs text-[#454545]">{app.referenceNumber}</td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="font-bold text-[#162e51] transition-colors hover:text-[#1a4480] hover:underline"
                      >
                        {app.firstName} {app.lastName}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-[#454545]">{app.email}</td>
                    <td className="px-5 py-3.5 text-[#454545]">{app.state}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 text-[#454545]">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="text-xs font-bold text-[#1a4480] transition-colors hover:text-[#162e51]"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-bold text-[#454545]">
            Page {page} of {meta.totalPages} · {meta.total} total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-md border border-[#adadad] px-3 py-1.5 text-xs font-bold text-[#1b1b1b] bg-white transition-colors hover:bg-[#f0f0f0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={13} />
              Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="inline-flex items-center gap-1 rounded-md border border-[#adadad] px-3 py-1.5 text-xs font-bold text-[#1b1b1b] bg-white transition-colors hover:bg-[#f0f0f0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
