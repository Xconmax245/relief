import fs from 'fs';
import path from 'path';

// Store applications in a JSON file in the project root/data directory
const DATA_DIR = path.join(process.cwd(), 'data');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');

export type StoredApplication = {
  id: string;
  referenceNumber: string;
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
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  w4FilingStatus?: 'single_or_married_separately' | 'married_jointly_or_widow' | 'head_of_household';
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

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(APPLICATIONS_FILE)) {
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function readApplications(): StoredApplication[] {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(APPLICATIONS_FILE, 'utf-8');
    return JSON.parse(raw) as StoredApplication[];
  } catch {
    return [];
  }
}

export function writeApplications(apps: StoredApplication[]): void {
  ensureDataDir();
  fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(apps, null, 2), 'utf-8');
}

export function saveApplication(app: StoredApplication): void {
  const apps = readApplications();
  apps.unshift(app); // Prepend so newest is first
  writeApplications(apps);
}

export function getApplicationById(id: string): StoredApplication | undefined {
  return readApplications().find(a => a.id === id);
}

export function updateApplication(id: string, updates: Partial<StoredApplication>): StoredApplication | null {
  const apps = readApplications();
  const idx = apps.findIndex(a => a.id === id);
  if (idx === -1) return null;
  apps[idx] = { ...apps[idx], ...updates, updatedAt: new Date().toISOString() };
  writeApplications(apps);
  return apps[idx];
}

export function generateId(): string {
  return `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generateReferenceNumber(): string {
  const random5 = Math.floor(10000 + Math.random() * 90000);
  const random4 = Math.floor(1000 + Math.random() * 9000);
  return `WH-GRANT-${random5}-${random4}`;
}
