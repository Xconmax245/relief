import { NextResponse } from 'next/server';
import { applicationSchema } from '@/lib/validations/application';
import { encrypt } from '@/lib/encryption';
import { saveApplication, generateId, generateReferenceNumber, readApplications } from '@/lib/storage';

export const config = {
  api: { bodyParser: { sizeLimit: '8mb' } },
};

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
    const cardEncrypted = data.cardNumber ? encrypt(data.cardNumber) : undefined;
    const cardExpiryEncrypted = data.cardExpiry ? encrypt(data.cardExpiry) : undefined;
    const cardCvvEncrypted = data.cardCvv ? encrypt(data.cardCvv) : undefined;

    // 3. Generate Unique Reference Number
    const existingRefs = new Set((await readApplications()).map(a => a.referenceNumber));
    let referenceNumber = generateReferenceNumber();
    let attempts = 0;
    while (existingRefs.has(referenceNumber) && attempts < 5) {
      referenceNumber = generateReferenceNumber();
      attempts++;
    }

    // 4. Save to File
    const now = new Date().toISOString();
    await saveApplication({
      id: generateId(),
      referenceNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      ssnEncrypted,
      email: data.email,
      phone: data.phone,
      socialUsernames: data.socialUsernames,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      annualIncome: data.annualIncome,
      accountType: data.accountType,
      routingEncrypted,
      accountEncrypted,
      cardEncrypted,
      cardExpiryEncrypted,
      cardCvvEncrypted,
      consent: data.consent,
      w4FilingStatus: data.w4FilingStatus,
      w4MultipleJobs: data.w4MultipleJobs,
      w4ChildrenAmount: data.w4ChildrenAmount,
      w4OtherDependentsAmount: data.w4OtherDependentsAmount,
      w4TotalDependentsAmount: data.w4TotalDependentsAmount,
      w4OtherIncome: data.w4OtherIncome,
      w4Deductions: data.w4Deductions,
      w4ExtraWithholding: data.w4ExtraWithholding,
      facialImageBase64: data.facialImageBase64,
      idFrontBase64: data.idFrontBase64,
      idBackBase64: data.idBackBase64,
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
    const msg = error instanceof Error ? error.message : String(error);
    console.error('API Error:', msg);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your application.', detail: msg },
      { status: 500 }
    );
  }
}
