import React from "react";
import { CheckCircle, ShieldCheck } from "lucide-react";

export type PageData = {
  title: string;
  lastUpdated: string;
  content: React.ReactNode;
};

export const PAGES: Record<string, PageData> = {
  "accessibility": {
    title: "Accessibility Statement",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          The Trump Administration is committed to making its digital services accessible to all Americans, including those with disabilities.
        </p>
        <h2>Commitment to Accessibility</h2>
        <p>
          We are continuously working to ensure that this website conforms to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA and Section 508 of the Rehabilitation Act of 1973. 
        </p>
        <h2>Reporting an Issue</h2>
        <p>
          If you encounter any barriers while accessing this grant application portal, please contact us immediately so we can provide you with alternative methods for claiming your American Citizen Relief Grant.
        </p>
      </>
    )
  },
  "privacy-policy": {
    title: "Privacy Policy",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          Your privacy and the security of your data are our highest priorities. This grant portal utilizes state-of-the-art encryption to protect your information.
        </p>
        <div className="secure-callout">
          <ShieldCheck size={20} className="secure-callout-icon" />
          <div>
            <strong>256-bit SSL Encryption Active</strong>
            <p>All data transmitted on this site is secured using military-grade encryption protocols.</p>
          </div>
        </div>
        <h2>Information We Collect</h2>
        <p>To process your $5,000 grant, we collect:</p>
        <ul>
          <li><strong>Personally Identifiable Information (PII):</strong> Full name, Date of Birth, and the last 4 digits of your Social Security Number (SSN) to verify citizenship and eligibility.</li>
          <li><strong>Banking Information:</strong> Account and Routing numbers to facilitate the secure ACH direct deposit of your grant funds.</li>
        </ul>
        <h2>How Your Information is Used</h2>
        <p>
          Your data is used <strong>strictly and solely</strong> for verifying your identity and distributing your grant funds. The Trump Administration will never sell, lease, or share your data with third-party marketers.
        </p>
        <h2>Data Retention</h2>
        <p>
          Once your grant has been disbursed, your banking information is purged from our active processing servers in accordance with federal data security guidelines.
        </p>
      </>
    )
  },
  "foia": {
    title: "Freedom of Information Act (FOIA)",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          The Freedom of Information Act (FOIA) provides the public the right to request access to records from any federal agency.
        </p>
        <h2>Making a Request</h2>
        <p>
          As an initiative of the Executive Office of the President, the American Citizen Grant Program adheres strictly to transparency. While personal grant applications remain highly confidential and exempt from FOIA to protect citizen privacy, aggregate program data and administrative records are available upon request.
        </p>
        <p>
          Please submit all FOIA inquiries through the official <a href="https://www.foia.gov" target="_blank" rel="noreferrer">FOIA.gov</a> portal.
        </p>
      </>
    )
  },
  "no-fear-act": {
    title: "No Fear Act",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          The Notification and Federal Employee Antidiscrimination and Retaliation (No FEAR) Act of 2002 protects federal employees and applicants from discrimination and retaliation.
        </p>
        <p>
          The Trump Administration stands firmly against discrimination in the federal workplace. This program and its administrative bodies comply fully with all equal employment opportunity and whistleblower protection laws.
        </p>
      </>
    )
  },
  "disclaimer": {
    title: "Legal Disclaimer",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          The information provided on this website does not constitute official legal or tax advice.
        </p>
        <h2>Grant Eligibility</h2>
        <p>
          Submission of an application does not guarantee approval. All applicants must pass identity verification, citizenship checks, and fraud-prevention screening before the $5,000 grant is disbursed.
        </p>
        <h2>Tax Implications</h2>
        <p>
          Under the America First Economic Relief Program, this grant is designed as a non-taxable federal relief payment. However, applicants should consult with a certified tax professional regarding their specific financial circumstances.
        </p>
      </>
    )
  },
  "vulnerability-disclosure-policy": {
    title: "Vulnerability Disclosure Policy",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          The security of the American Citizen Grant Program is critical. We encourage security researchers to discover and report vulnerabilities in our digital infrastructure.
        </p>
        <p>
          If you believe you have discovered a vulnerability on this portal, please submit a report immediately through our secure cybersecurity disclosure channel. Do not attempt to exploit or publicly disclose the vulnerability prior to resolution.
        </p>
      </>
    )
  },
  "office-of-civil-rights": {
    title: "Office of Civil Rights",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          The Office of Civil Rights ensures equal access to federal programs and activities.
        </p>
        <p>
          The American Citizen Relief Grant is available to all eligible U.S. citizens regardless of race, color, national origin, sex, age, or disability. If you feel you have been unfairly denied access to this program, you have the right to file a formal complaint with the Office of Civil Rights.
        </p>
      </>
    )
  },
  "contact-us": {
    title: "Contact Us",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          We are here to assist you with your American Citizen Relief Grant application.
        </p>
        <h2>Support Channels</h2>
        <ul>
          <li><strong>Application Status:</strong> Once you apply, you will receive a tracking number. Please use the "Check Status" page (coming soon) before contacting support.</li>
          <li><strong>Technical Support:</strong> If you are experiencing issues submitting your form, ensure you are using a modern, updated web browser.</li>
        </ul>
        <p>
          Due to the high volume of applications, we prioritize processing grant payments over individual email inquiries. Your $5,000 payment will be automatically processed once approved.
        </p>
      </>
    )
  },
  "media-inquiries": {
    title: "Media Inquiries",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          For press and media inquiries regarding the Trump Administration's American Citizen Grant Program.
        </p>
        <p>
          All official statements, press releases, and media briefings regarding this economic relief initiative are handled directly by the White House Press Office. 
        </p>
        <p>
          Credentialed media representatives may submit inquiries through the official White House press portal.
        </p>
      </>
    )
  },
  "find-your-representative": {
    title: "Find Your Representative",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          Connect with your local elected officials to learn more about how federal policies impact your community.
        </p>
        <p>
          While this grant is distributed directly by the Executive Office of the President, your local Representatives and Senators are available to assist you with other federal agencies and services.
        </p>
        <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
          Visit House.gov Search Portal
        </a>
      </>
    )
  },
  "economy-and-jobs": {
    title: "Economy & Jobs",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          Putting the American worker first and restoring the strength of our national economy.
        </p>
        <h2>America First Economic Policy</h2>
        <p>
          The Trump Administration is dedicated to bringing manufacturing jobs back to American soil, reducing unnecessary regulations, and lowering taxes for hard-working families. 
        </p>
        <h2>The Relief Grant Impact</h2>
        <p>
          By injecting $5,000 directly into the hands of American citizens, this grant program is designed to stimulate local economies, help families combat inflation, and reward the true engine of our country: the American worker.
        </p>
      </>
    )
  },
  "national-security": {
    title: "National Security",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          Peace through strength. Protecting the homeland and our citizens is the most fundamental duty of the federal government.
        </p>
        <p>
          The Administration is committed to rebuilding our military, standing with our allies, and ensuring that the United States remains the preeminent superpower in the world. A strong nation begins with a secure and prosperous citizenry, which is why economic relief programs are intrinsically linked to our national resilience.
        </p>
      </>
    )
  },
  "energy-dominance": {
    title: "Energy Dominance",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          Unleashing America's vast energy resources to lower costs for consumers and ensure global independence.
        </p>
        <h2>Drill, Baby, Drill</h2>
        <p>
          We are ending the war on American energy. By maximizing domestic oil and natural gas production, we are lowering gas prices, reducing inflation, and ensuring that American families can afford to heat their homes and drive their cars without relying on foreign nations.
        </p>
      </>
    )
  },
  "border-security": {
    title: "Border Security",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          A nation without borders is not a nation. We are securing our homeland and enforcing the rule of law.
        </p>
        <p>
          The Trump Administration is committed to halting illegal immigration, completing the border wall, and dismantling transnational cartels. The American Citizen Grant Program is strictly reserved for lawful U.S. citizens and permanent residents. Thorough identity verification is conducted to ensure no funds are distributed to undocumented individuals.
        </p>
      </>
    )
  },
  "american-families": {
    title: "American Families",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          The family is the bedrock of our great nation. We are enacting policies that support parents, children, and communities.
        </p>
        <p>
          From the expanded child tax credit to school choice initiatives, the Administration is fighting for the American family. The $5,000 Relief Grant provides immediate, tangible support to households across the country, empowering parents to provide for their children and invest in their futures.
        </p>
      </>
    )
  },
  "about": {
    title: "About the Program",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          The American Citizen Grant Program is a historic initiative by the Trump Administration to provide direct economic relief to the American people.
        </p>
        <h2>How It Works</h2>
        <p>
          Under the authority of the America First Economic Relief Program, eligible adult citizens can claim a one-time, non-repayable grant of $5,000. These funds are distributed via secure ACH direct deposit directly to your U.S. bank account.
        </p>
        <div className="steps-grid" style={{ marginTop: '2rem' }}>
           <div className="step-card">
              <CheckCircle size={24} style={{ color: 'var(--gold-accent)' }} />
              <h3 style={{ marginTop: '1rem' }}>No Middlemen</h3>
              <p>Funds go directly from the Treasury to your personal account.</p>
           </div>
           <div className="step-card">
              <ShieldCheck size={24} style={{ color: 'var(--gold-accent)' }} />
              <h3 style={{ marginTop: '1rem' }}>Fully Secure</h3>
              <p>Your application is protected by advanced 256-bit encryption.</p>
           </div>
        </div>
      </>
    )
  },
  "eligibility-requirements": {
    title: "Eligibility Requirements",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          Review the strict criteria required to claim the $5,000 American Citizen Relief Grant.
        </p>
        <h2>Mandatory Criteria</h2>
        <ul>
          <li><strong>Citizenship:</strong> Must be a U.S. citizen or lawful permanent resident.</li>
          <li><strong>Age:</strong> Must be 18 years of age or older at the time of application.</li>
          <li><strong>Identity:</strong> Must possess a valid Social Security Number (SSN).</li>
          <li><strong>Banking:</strong> Must have an active U.S. bank account capable of receiving ACH transfers.</li>
        </ul>
        <p>
          Only one application per household will be approved. Any attempts to submit fraudulent applications will be prosecuted to the fullest extent of federal law.
        </p>
      </>
    )
  },
  "application-process": {
    title: "Application Process",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          A step-by-step guide to securely claiming your $5,000 federal grant.
        </p>
        <h2>How to Apply</h2>
        <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: 1.8 }}>
          <li><strong>Complete the Secure Form:</strong> Fill out the official form on the homepage with your personal details and encrypted banking information.</li>
          <li><strong>Identity Verification:</strong> Our automated system cross-references your details with federal databases to confirm citizenship and prevent fraud.</li>
          <li><strong>Direct Deposit:</strong> Upon approval, the $5,000 grant is routed directly to your bank account via ACH transfer within 7-14 business days.</li>
        </ol>
      </>
    )
  },
  "check-application-status": {
    title: "Check Application Status",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          The application status portal is currently undergoing scheduled maintenance to accommodate high traffic volume.
        </p>
        <div className="secure-callout">
          <CheckCircle size={20} className="secure-callout-icon" />
          <div>
            <strong>Processing Continues Uninterrupted</strong>
            <p>If you have already submitted your application, your grant is currently in the verification queue. Payments are being disbursed daily.</p>
          </div>
        </div>
        <p>
          Please check back on this page in 24-48 hours to enter your Application ID and view your real-time approval status.
        </p>
      </>
    )
  },
  "faqs": {
    title: "Frequently Asked Questions",
    lastUpdated: "January 20, 2025",
    content: (
      <>
        <p className="usa-intro">
          Answers to the most common questions regarding the American Citizen Grant Program.
        </p>
        <h2>Do I have to pay this grant back?</h2>
        <p>No. This is a one-time federal relief grant, not a loan. No repayment is required.</p>
        
        <h2>Is this grant taxable?</h2>
        <p>Under the America First Economic Relief Program, this grant is classified as a non-taxable federal disaster/economic relief payment.</p>

        <h2>Why do you need my bank account information?</h2>
        <p>To ensure funds are distributed quickly, safely, and without the risk of mail fraud or lost checks, all grants are disbursed exclusively via secure ACH direct deposit.</p>

        <h2>How long does it take to receive the funds?</h2>
        <p>Most approved applicants will see the $5,000 deposited into their checking or savings account within 7 to 14 business days of application submission.</p>
      </>
    )
  }
};
