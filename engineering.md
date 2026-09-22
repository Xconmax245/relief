# Engineering Overview: American Citizen Relief Program

This document outlines the current state of the front-end application and provides the necessary details to build a proper, secure backend for it.

## Overview
The current build is a **Next.js 16 (React 19)** application using **Tailwind CSS** and **Framer Motion** for animations. It serves as a portal for the "American Citizen Relief Program" where users can learn about the program and apply for a $5,000 grant.

Currently, the front-end is entirely static and mock-driven. When a user submits an application, the `GrantForm.tsx` component validates the input and simulates a 2.2-second network request before displaying a success message with a generated reference number. **No data is currently being saved.**

## The Goal
The backend needs to securely receive, validate, store, and process the application data submitted by users. Given the sensitive nature of the data (PII, SSN, and banking information), the backend must prioritize strict security and encryption protocols.

---

## Data Model Requirements

The backend needs to handle the following application data structure:

### 1. Personal Information
- `firstName` (String, required)
- `lastName` (String, required)
- `dateOfBirth` (Date/String, required) - Must be validated for 18+ years of age.
- `ssn` (String, required) - Last 4 digits only (length: 4).

### 2. Contact Information
- `email` (String, required) - Must be a valid email format.
- `phone` (String, required) - Valid phone number.

### 3. Home Address
- `address` (String, required)
- `city` (String, required)
- `state` (String, required) - 2-letter US state code.
- `zipCode` (String, required)
- `annualIncome` (String, required) - Enum/String (e.g., 'under-25k', '25k-50k', '50k-75k', '75k-100k', 'over-100k').

### 4. Bank Account Information (HIGH SENSITIVITY)
- `accountType` (String, required) - 'checking' or 'savings'.
- `routingNumber` (String, required) - 9-digit routing number.
- `accountNumber` (String, required) - Bank account number.

### 5. Meta Information
- `consent` (Boolean, required) - User agreement to terms.
- `referenceNumber` (String, auto-generated) - e.g., `WH-GRANT-XXXXX-XXXX`.
- `status` (String) - e.g., 'pending', 'approved', 'rejected'.
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

---

## Backend Architectural Recommendations

### 1. Framework
Since the project is already using Next.js, the simplest approach is to use **Next.js Route Handlers (API Routes)**. This keeps the codebase unified. Alternatively, a separate **Node.js (Express/NestJS)**, **Python (FastAPI/Django)**, or **Go** backend could be used if preferred.

### 2. Database
A robust relational database like **PostgreSQL** or a NoSQL database like **MongoDB** is recommended. You will need an ORM/ODM like **Prisma** or **Mongoose** to interact with the database safely.

### 3. Security & Compliance (CRITICAL)
This application handles highly sensitive PII and financial data. The backend MUST implement the following:
- **Encryption at Rest:** Ensure the database encrypts data, particularly `ssn`, `routingNumber`, and `accountNumber`. Consider field-level encryption for these specific columns.
- **Data Hashing:** If bank accounts aren't needed in plaintext for automated ACH, consider hashing or tokenizing them through a 3rd party like Stripe or Plaid.
- **Validation:** Never trust the front-end. Re-validate all fields on the backend using libraries like `zod` or `yup` before inserting into the database.
- **Rate Limiting & DDoS Protection:** Implement strict rate limiting to prevent spam submissions and brute-force attacks.
- **CORS & CSRF:** Secure your API endpoints to only accept requests from your authorized frontend domain.

### 4. Integration Points Needed in Frontend
Once the backend is built, the `handleSubmit` function in `src/components/GrantForm.tsx` needs to be updated. Replace the simulated `setTimeout` delay with a real `fetch` or `axios` POST request to the new backend API endpoint (e.g., `POST /api/applications`).

```javascript
// Example future integration in GrantForm.tsx
const response = await fetch('/api/applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

if (!response.ok) {
  // Handle server errors
}
const result = await response.json();
// Show success with result.referenceNumber
```
