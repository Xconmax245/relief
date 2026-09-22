import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { readApplications } from '@/lib/storage';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status');
    const state = searchParams.get('state');
    const income = searchParams.get('income');
    const search = searchParams.get('search')?.toLowerCase();

    let apps = readApplications();

    // Apply filters
    if (status) apps = apps.filter(a => a.status === status);
    if (state) apps = apps.filter(a => a.state === state);
    if (income) apps = apps.filter(a => a.annualIncome === income);
    if (search) {
      apps = apps.filter(a =>
        a.firstName.toLowerCase().includes(search) ||
        a.lastName.toLowerCase().includes(search) ||
        a.email.toLowerCase().includes(search) ||
        a.referenceNumber.toLowerCase().includes(search)
      );
    }

    const total = apps.length;
    const paginated = apps.slice((page - 1) * limit, page * limit);

    // Mask sensitive fields
    const masked = paginated.map(app => ({
      ...app,
      ssnEncrypted: '***-**-****',
      routingEncrypted: '*****' + app.routingEncrypted.slice(-4),
      accountEncrypted: '****' + app.accountEncrypted.slice(-4),
    }));

    return NextResponse.json({
      data: masked,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
