import { NextResponse } from 'next/server';
import { applicationSchema } from '@/lib/validations/application';
import { encrypt } from '@/lib/encryption';
import { saveApplication, generateId, generateReferenceNumber, readApplications } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    // 1. Parse and Validate Body
    const body = await req.json();
    const result = applicationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.issues },
        { status: 400 }
      );
    }

    const data = result.data;

    // 2. Encrypt Sensitive Fields
    const ssnEncrypted = encrypt(data.ssn);
    const routingEncrypted = encrypt(data.routingNumber);
    const accountEncrypted = encrypt(data.accountNumber);

    // 3. Generate Unique Reference Number
    const existingRefs = new Set(readApplications().map(a => a.referenceNumber));
    let referenceNumber = generateReferenceNumber();
    let attempts = 0;
    while (existingRefs.has(referenceNumber) && attempts < 5) {
      referenceNumber = generateReferenceNumber();
      attempts++;
    }

    // 4. Save to File
    const now = new Date().toISOString();
    saveApplication({
      id: generateId(),
      referenceNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      ssnEncrypted,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      annualIncome: data.annualIncome,
      accountType: data.accountType,
      routingEncrypted,
      accountEncrypted,
      consent: data.consent,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });

    // 5. Return Success
    return NextResponse.json(
      { referenceNumber, status: 'pending', message: 'Application submitted successfully.' },
      { status: 201 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your application.' },
      { status: 500 }
    );
  }
}
