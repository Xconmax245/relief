import { ReactNode } from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="admin-shell relative min-h-screen">
      {/* USWDS Banner */}
      <div className="usa-banner">
        <div className="usa-banner__inner">
          <div className="usa-banner__text">
            <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="U.S. flag" className="usa-banner__flag" />
            <span>An official website of the United States government</span>
          </div>
        </div>
      </div>

      <div className="relative flex min-h-screen">
        <AdminSidebar email={session.user?.email ?? ''} name={session.user?.name} />

        <main className="min-w-0 flex-1 p-5 sm:p-7 lg:p-9">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
