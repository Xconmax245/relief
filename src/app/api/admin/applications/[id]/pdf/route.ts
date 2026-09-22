import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getApplicationById } from '@/lib/storage';
import { decrypt } from '@/lib/encryption';
import { renderToStream } from '@react-pdf/renderer';
import { applicationReportElement } from '@/lib/pdf/ApplicationReport';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const application = getApplicationById(id);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const url = new URL(req.url);
    const reveal = url.searchParams.get('reveal') === 'true';
    const isSuperAdmin = (session.user as any).role === 'superadmin';
    const maskSensitive = !(reveal && isSuperAdmin);

    let ssn = application.ssnEncrypted;
    let routing = application.routingEncrypted;
    let account = application.accountEncrypted;

    if (!maskSensitive) {
      try {
        ssn = decrypt(application.ssnEncrypted);
        routing = decrypt(application.routingEncrypted);
        account = decrypt(application.accountEncrypted);
      } catch (e) {
        console.error('Decryption failed', e);
      }
    }

    const appForReport = { ...application, ssnEncrypted: ssn, routingEncrypted: routing, accountEncrypted: account };

    const stream = await renderToStream(
      applicationReportElement({
        applications: [appForReport],
        options: {
          includeSummary: false,
          includeDetails: true,
          maskSensitive,
          watermark: '',
          generatedBy: session.user?.email || 'Admin',
        }
      })
    );

    return new Response(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="acrp-${application.referenceNumber}.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
