import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { readApplications } from '@/lib/storage';
import { decrypt } from '@/lib/encryption';
import { renderToStream } from '@react-pdf/renderer';
import { applicationReportElement } from '@/lib/pdf/ApplicationReport';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { filters = {}, options = {} } = body;

    let apps = readApplications();

    // Apply filters
    if (filters.status) apps = apps.filter(a => a.status === filters.status);
    if (filters.state) apps = apps.filter(a => a.state === filters.state);
    if (filters.income) apps = apps.filter(a => a.annualIncome === filters.income);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      apps = apps.filter(a =>
        a.firstName.toLowerCase().includes(s) ||
        a.lastName.toLowerCase().includes(s) ||
        a.referenceNumber.toLowerCase().includes(s)
      );
    }
    if (filters.dateFrom) apps = apps.filter(a => new Date(a.createdAt) >= new Date(filters.dateFrom));
    if (filters.dateTo) apps = apps.filter(a => new Date(a.createdAt) <= new Date(filters.dateTo));

    const isSuperAdmin = (session.user as any).role === 'superadmin';
    const maskSensitive = options.maskSensitive !== false || !isSuperAdmin;

    const appsForReport = apps.map(app => {
      let ssn = app.ssnEncrypted;
      let routing = app.routingEncrypted;
      let account = app.accountEncrypted;
      if (!maskSensitive) {
        try { ssn = decrypt(app.ssnEncrypted); routing = decrypt(app.routingEncrypted); account = decrypt(app.accountEncrypted); } catch { }
      }
      return { ...app, ssnEncrypted: ssn, routingEncrypted: routing, accountEncrypted: account };
    });

    const summary = {
      pending: appsForReport.filter(a => a.status === 'pending').length,
      approved: appsForReport.filter(a => a.status === 'approved').length,
      rejected: appsForReport.filter(a => a.status === 'rejected').length,
    };

    const stream = await renderToStream(
      applicationReportElement({
        applications: appsForReport,
        summary,
        filters,
        options: {
          includeSummary: options.includeSummary ?? true,
          includeDetails: options.includeDetails ?? true,
          maskSensitive,
          watermark: options.watermark || 'CONFIDENTIAL',
          generatedBy: session.user?.email || options.generatedBy || 'Admin',
        }
      })
    );

    return new Response(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="acrp-applications-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF Error:', error);
    return NextResponse.json({ error: 'Failed to generate bulk PDF' }, { status: 500 });
  }
}
