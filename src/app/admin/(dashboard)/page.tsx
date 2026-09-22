import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { readApplications } from '@/lib/storage';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, FileText, Inbox, XCircle } from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const apps = readApplications();

  const total = apps.length;
  const pending = apps.filter(a => a.status === 'pending').length;
  const approved = apps.filter(a => a.status === 'approved').length;
  const rejected = apps.filter(a => a.status === 'rejected').length;

  const recent = apps.slice(0, 5);

  const stats = [
    { label: 'Total Applications', value: total, Icon: FileText, icon: 'text-[#1a4480]', border: 'border-t-[#1a4480]' },
    { label: 'Pending Review', value: pending, Icon: Clock, icon: 'text-[#c2850c]', border: 'border-t-[#c2850c]' },
    { label: 'Approved', value: approved, Icon: CheckCircle2, icon: 'text-[#2e8540]', border: 'border-t-[#2e8540]' },
    { label: 'Rejected', value: rejected, Icon: XCircle, icon: 'text-[#d83933]', border: 'border-t-[#d83933]' },
  ];

  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-2xl font-bold text-[#162e51] font-serif">Overview</h1>
        <p className="mt-1 text-sm text-[#454545]">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ''} — here is where every submitted
          application stands.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, Icon, icon, border }) => (
          <div
            key={label}
            className={`relative overflow-hidden rounded-md border border-[#e6e6e6] bg-white p-5 shadow-sm border-t-4 ${border}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-wider text-[#454545]">{label}</p>
                <p className="mt-1.5 text-3xl font-bold tabular-nums text-[#162e51] font-serif">{value}</p>
              </div>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f0f0] ${icon}`}>
                <Icon size={18} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-md border border-[#e6e6e6] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-[#e6e6e6] px-5 py-4 bg-[#f0f0f0]">
          <h2 className="text-sm font-bold text-[#162e51]">Recent Applications</h2>
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a4480] transition-colors hover:text-[#162e51]"
          >
            View all
            <ArrowRight size={13} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e6e6e6] bg-[#f0f0f0] text-[#757575]">
              <Inbox size={22} />
            </span>
            <p className="text-sm font-bold text-[#162e51]">No applications yet</p>
            <p className="max-w-sm text-xs text-[#757575]">
              Submissions from the public form will appear here as soon as someone applies.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-[#162e51] text-white">
                <tr className="border-b border-[#e6e6e6] text-[0.7rem] uppercase tracking-wider">
                  <th className="px-5 py-3 font-bold font-serif">Reference</th>
                  <th className="px-5 py-3 font-bold font-serif">Applicant</th>
                  <th className="px-5 py-3 font-bold font-serif">Email</th>
                  <th className="px-5 py-3 font-bold font-serif">Status</th>
                  <th className="px-5 py-3 font-bold font-serif">Submitted</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e6e6] bg-white">
                {recent.map(app => (
                  <tr key={app.id} className="transition-colors hover:bg-[#f0f0f0]">
                    <td className="px-5 py-3.5 font-mono text-xs text-[#454545]">{app.referenceNumber}</td>
                    <td className="px-5 py-3.5 font-bold text-[#162e51]">
                      {app.firstName} {app.lastName}
                    </td>
                    <td className="px-5 py-3.5 text-[#454545]">{app.email}</td>
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
      </section>
    </div>
  );
}
