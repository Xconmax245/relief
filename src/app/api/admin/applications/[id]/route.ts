import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getApplicationById, updateApplication } from '@/lib/storage';
import { decrypt } from '@/lib/encryption';

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

    let ssn = '***-**-****';
    let routing = '*****' + application.routingEncrypted.slice(-4);
    let account = '****' + application.accountEncrypted.slice(-4);

    if (reveal && isSuperAdmin) {
      try {
        ssn = decrypt(application.ssnEncrypted);
        routing = decrypt(application.routingEncrypted);
        account = decrypt(application.accountEncrypted);
      } catch (e) {
        console.error('Decryption failed', e);
      }
    }

    return NextResponse.json({
      ...application,
      ssnEncrypted: ssn,
      routingEncrypted: routing,
      accountEncrypted: account,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes } = body;

    const updated = updateApplication(id, { status, adminNotes });
    if (!updated) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...updated,
      ssnEncrypted: '***-**-****',
      routingEncrypted: '*****' + updated.routingEncrypted.slice(-4),
      accountEncrypted: '****' + updated.accountEncrypted.slice(-4),
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
