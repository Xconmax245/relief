"use client";

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ClipboardCopy,
  Download,
  Eye,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldAlert,
  User,
} from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';

type Application = {
  id: string;
  referenceNumber: string;
  status: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssnEncrypted: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  annualIncome: string;
  accountType: string;
  routingEncrypted: string;
  accountEncrypted: string;
  consent: boolean;
  adminNotes?: string;
  w4FilingStatus?: string;
  w4MultipleJobs?: boolean;
  w4ChildrenAmount?: number;
  w4OtherDependentsAmount?: number;
  w4TotalDependentsAmount?: number;
  w4OtherIncome?: number;
  w4Deductions?: number;
  w4ExtraWithholding?: number;
  facialImageBase64?: string;
  createdAt: string;
  updatedAt: string;
};

const INCOME_LABELS: Record<string, string> = {
  'under-25k': 'Under $25,000',
  '25k-50k': '$25,000 – $50,000',
  '50k-75k': '$50,000 – $75,000',
  '75k-100k': '$75,000 – $100,000',
  'over-100k': 'Over $100,000',
};

function Section({
  title,
  Icon,
  children,
}: {
  title: string;
  Icon: React.ComponentType<{ size?: number | string; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-md border border-[#e6e6e6] bg-white shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-[#e6e6e6] px-5 py-3.5 bg-[#f0f0f0]">
        <Icon size={15} className="text-[#1a4480]" />
        <h2 className="text-sm font-bold text-[#162e51]">{title}</h2>
      </div>
      <dl className="divide-y divide-[#e6e6e6] bg-white">{children}</dl>
    </section>
  );
}

function Field({ label, value, sensitive }: { label: string; value: string; sensitive?: boolean }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-full shrink-0 text-[0.72rem] font-bold uppercase tracking-wider text-[#454545] sm:w-40">
        {label}
      </dt>
      <dd
        className={
          sensitive
            ? 'rounded-sm bg-[#fef0d8] px-2 py-0.5 font-mono text-sm text-[#855b06]'
            : 'break-words text-sm text-[#1b1b1b]'
        }
      >
        {value}
      </dd>
    </div>
  );
}

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState('');
  const router = useRouter();

  const fetchApp = async (reveal = false) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/applications/${id}${reveal ? '?reveal=true' : ''}`);
      if (res.ok) {
        const data = await res.json();
        setApp(data);
        setStatus(data.status);
        setAdminNotes(data.adminNotes || '');
      } else {
        setError('Could not load this application.');
      }
    } catch {
      setError('Could not reach the server.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReveal = async () => {
    if (confirm('Revealing sensitive data will be logged. Continue?')) {
      await fetchApp(true);
      setRevealed(true);
    }
  };

  const handleSaveStatus = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      });
      if (res.ok) {
        const updated = await res.json();
        setApp(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError('Failed to save changes.');
      }
    } catch {
      setError('Could not reach the server.');
    }
    setSaving(false);
  };

  const handleDownloadPDF = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}/pdf`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `acrp-${app?.referenceNumber ?? id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        setError('Failed to generate PDF.');
      }
    } catch {
      setError('Error generating PDF.');
    }
    setGenerating(false);
  };

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      setError('Could not copy to clipboard.');
    }
  };

  const asPlainText = () =>
    app
      ? [
          `Reference: ${app.referenceNumber}`,
          `Status: ${app.status}`,
          '',
          `Name: ${app.firstName} ${app.lastName}`,
          `Date of birth: ${new Date(app.dateOfBirth).toLocaleDateString()}`,
          `SSN: ${app.ssnEncrypted}`,
          `Email: ${app.email}`,
          `Phone: ${app.phone}`,
          '',
          `Address: ${app.address}`,
          `City: ${app.city}`,
          `State: ${app.state}`,
          `ZIP: ${app.zipCode}`,
          `Annual income: ${INCOME_LABELS[app.annualIncome] ?? app.annualIncome}`,
          '',
          `Account type: ${app.accountType}`,
          `Routing number: ${app.routingEncrypted}`,
          `Account number: ${app.accountEncrypted}`,
          '',
          `Consent: ${app.consent ? 'Yes' : 'No'}`,
          `Submitted: ${new Date(app.createdAt).toLocaleString()}`,
          `Last updated: ${new Date(app.updatedAt).toLocaleString()}`,
          app.adminNotes ? `Admin notes: ${app.adminNotes}` : '',
        ]
          .filter(Boolean)
          .join('\n')
      : '';

  if (loading) {
    return <div className="px-2 py-16 text-center text-sm text-[#757575]">Loading application…</div>;
  }

  if (!app) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-md border border-[#d83933] bg-[#fde0de] px-4 py-3 text-sm text-[#8b0000]">
          <AlertCircle size={15} />
          {error || 'Application not found.'}
        </div>
        <Link href="/admin/applications" className="text-sm font-bold text-[#1a4480] hover:text-[#162e51]">
          ← Back to applications
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#454545] transition-colors hover:text-[#1b1b1b]"
      >
        <ArrowLeft size={13} />
        Back to applications
      </button>

      {/* Header */}
      <header className="rounded-md border border-[#e6e6e6] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold text-[#162e51]" font-serif>
                {app.firstName} {app.lastName}
              </h1>
              <StatusBadge status={app.status} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-[#454545]">{app.referenceNumber}</span>
              <button
                onClick={() => copy('ref', app.referenceNumber)}
                className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-[#757575] transition-colors hover:text-[#1a4480]"
              >
                {copied === 'ref' ? <Check size={12} /> : <ClipboardCopy size={12} />}
                {copied === 'ref' ? 'Copied' : 'Copy'}
              </button>
              <span className="text-[0.7rem] text-[#757575]">
                Submitted {new Date(app.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                copy('all', asPlainText());
              }}
              className="inline-flex items-center gap-2 rounded-md border border-[#adadad] bg-white px-3.5 py-2 text-xs font-bold text-[#454545] transition-colors hover:bg-[#f0f0f0] hover:text-[#1b1b1b] shadow-sm"
            >
              {copied === 'all' ? <Check size={14} /> : <ClipboardCopy size={14} />}
              {copied === 'all' ? 'Copied' : 'Copy details'}
            </button>
            {!revealed && (
              <button
                onClick={handleReveal}
                className="inline-flex items-center gap-2 rounded-md border border-[#c2850c] bg-[#fef0d8] px-3.5 py-2 text-xs font-bold text-[#855b06] transition-colors hover:bg-[#fce5c0] shadow-sm"
              >
                <Eye size={14} />
                Reveal sensitive
              </button>
            )}
            <button
              onClick={handleDownloadPDF}
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-md bg-[#1a4480] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#162e51] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={14} />
              {generating ? 'Generating…' : 'Download PDF'}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-[#d83933] bg-[#fde0de] px-4 py-3 text-sm text-[#8b0000]">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Status & notes */}
      <section className="rounded-md border border-[#e6e6e6] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-[#162e51]">Status &amp; Notes</h2>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-wider text-[#454545]">
              Status
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="rounded-md border border-[#adadad] bg-white px-3 py-2 text-sm text-[#1b1b1b] outline-none transition-colors focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480]"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="min-w-[220px] flex-1">
            <label className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-wider text-[#454545]">
              Admin notes
            </label>
            <input
              type="text"
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              placeholder="Add a note about this application…"
              className="w-full rounded-md border border-[#adadad] bg-white px-3 py-2 text-sm text-[#1b1b1b] placeholder:text-[#757575] outline-none transition-colors focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480]"
            />
          </div>
          <button
            onClick={handleSaveStatus}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-[#2e8540] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#256832] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2e8540]">
              <Check size={13} />
              Saved
            </span>
          )}
        </div>
      </section>

      {/* Form data */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section title="Personal Information" Icon={User}>
          <Field label="First name" value={app.firstName} />
          <Field label="Last name" value={app.lastName} />
          <Field label="Date of birth" value={new Date(app.dateOfBirth).toLocaleDateString()} />
          <Field label="SSN" value={app.ssnEncrypted} sensitive />
        </Section>

        <Section title="Contact Information" Icon={Phone}>
          <Field label="Email" value={app.email} />
          <Field label="Phone" value={app.phone} />
          <Field label="Consent given" value={app.consent ? 'Yes' : 'No'} />
        </Section>

        <Section title="Home Address" Icon={MapPin}>
          <Field label="Street" value={app.address} />
          <Field label="City" value={app.city} />
          <Field label="State" value={app.state} />
          <Field label="ZIP code" value={app.zipCode} />
          <Field label="Annual income" value={INCOME_LABELS[app.annualIncome] ?? app.annualIncome} />
        </Section>

        <Section title="Bank Account" Icon={Landmark}>
          <Field label="Account type" value={app.accountType} />
          <Field label="Routing number" value={app.routingEncrypted} sensitive />
          <Field label="Account number" value={app.accountEncrypted} sensitive />
        </Section>
        
        <Section title="W-4 Withholding" Icon={FileText}>
          <Field label="Filing Status" value={app.w4FilingStatus === 'single_or_married_separately' ? 'Single/Married filing sep.' : app.w4FilingStatus === 'married_jointly_or_widow' ? 'Married jointly/Widow' : app.w4FilingStatus === 'head_of_household' ? 'Head of household' : 'N/A'} />
          <Field label="Multiple Jobs" value={app.w4MultipleJobs ? 'Yes' : 'No'} />
          <Field label="Children Amount" value={app.w4ChildrenAmount !== undefined && app.w4ChildrenAmount !== null && app.w4ChildrenAmount !== '' as any ? `$${app.w4ChildrenAmount}` : 'N/A'} />
          <Field label="Other Dependents Amount" value={app.w4OtherDependentsAmount !== undefined && app.w4OtherDependentsAmount !== null && app.w4OtherDependentsAmount !== '' as any ? `$${app.w4OtherDependentsAmount}` : 'N/A'} />
          <Field label="Total Dependents Amount" value={app.w4TotalDependentsAmount !== undefined && app.w4TotalDependentsAmount !== null && app.w4TotalDependentsAmount !== '' as any ? `$${app.w4TotalDependentsAmount}` : 'N/A'} />
          <Field label="Other Income" value={app.w4OtherIncome !== undefined && app.w4OtherIncome !== null && app.w4OtherIncome !== '' as any ? `$${app.w4OtherIncome}` : 'N/A'} />
          <Field label="Deductions" value={app.w4Deductions !== undefined && app.w4Deductions !== null && app.w4Deductions !== '' as any ? `$${app.w4Deductions}` : 'N/A'} />
          <Field label="Extra Withholding" value={app.w4ExtraWithholding !== undefined && app.w4ExtraWithholding !== null && app.w4ExtraWithholding !== '' as any ? `$${app.w4ExtraWithholding}` : 'N/A'} />
        </Section>
        
        <Section title="Facial Verification" Icon={User}>
          {app.facialImageBase64 ? (
            <div className="p-5 flex justify-center bg-[#f0f0f0]">
              <img src={app.facialImageBase64} alt="Applicant Facial Verification" className="max-w-full h-auto rounded shadow-sm border border-[#adadad]" style={{ maxHeight: '200px' }} />
            </div>
          ) : (
            <Field label="Photo" value="No verification photo provided." />
          )}
        </Section>
      </div>

      {!revealed ? (
        <p className="flex items-center gap-2 text-xs text-[#454545]">
          <ShieldAlert size={13} />
          Sensitive fields are masked. Use “Reveal sensitive” above to view the full values — this access is logged.
        </p>
      ) : (
        <p className="flex items-center gap-2 text-xs text-[#855b06]">
          <ShieldAlert size={13} />
          Full sensitive data is currently visible.
        </p>
      )}

      <Section title="Submission" Icon={Mail}>
        <Field label="Reference" value={app.referenceNumber} />
        <Field label="Submitted" value={new Date(app.createdAt).toLocaleString()} />
        <Field label="Last updated" value={new Date(app.updatedAt).toLocaleString()} />
        <Field label="Admin notes" value={app.adminNotes || '—'} />
      </Section>
    </div>
  );
}
