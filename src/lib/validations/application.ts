import { z } from 'zod';

const usStateCodes = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
] as const;

export const applicationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  dateOfBirth: z.string().refine((dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return false;
    const age = (new Date().getTime() - date.getTime()) / (365.25 * 24 * 3600 * 1000);
    return age >= 18;
  }, 'You must be 18 or older to apply.'),
  ssn: z.string().regex(/^\d{9}$/, 'Enter a valid 9-digit SSN.'),
  email: z.string().email('Enter a valid email address.'),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,}$/, 'Enter a valid phone number.'),
  address: z.string().min(1, 'Address is required.'),
  city: z.string().min(1, 'City is required.'),
  state: z.enum(usStateCodes, { error: 'Select a valid US state.' }),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Enter a valid ZIP code.'),
  annualIncome: z.enum(['under-25k', '25k-50k', '50k-75k', '75k-100k', 'over-100k'], {
    error: 'Annual income is required.',
  }),
  accountType: z.enum(['checking', 'savings'], { error: 'Account type is required.' }),
  routingNumber: z.string().regex(/^\d{9}$/, 'Enter a valid 9-digit routing number.'),
  accountNumber: z.string().min(4, 'Account number must be at least 4 digits.').max(17, 'Account number is too long.'),
  consent: z.literal(true, {
    error: 'You must agree to continue.',
  }),
  w4FilingStatus: z.enum(['single_or_married_separately', 'married_jointly_or_widow', 'head_of_household'], { error: 'Filing status is required.' }),
  w4MultipleJobs: z.boolean().optional(),
  w4ChildrenAmount: z.number().nonnegative().optional(),
  w4OtherDependentsAmount: z.number().nonnegative().optional(),
  w4TotalDependentsAmount: z.number().nonnegative().optional(),
  w4OtherIncome: z.number().nonnegative().optional(),
  w4Deductions: z.number().nonnegative().optional(),
  w4ExtraWithholding: z.number().nonnegative().optional(),
  facialImageBase64: z.string().min(1, 'Facial verification is required.'),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
