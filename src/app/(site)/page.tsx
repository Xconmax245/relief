"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  ShieldCheck, Users, DollarSign, Star,
  CheckCircle, Lock
} from "lucide-react";
import Image from "next/image";
import Hero from "@/components/Hero";
import GrantForm from "@/components/GrantForm";

const HOW_STEPS = [
  {
    num: 1,
    title: "Verify Your Eligibility",
    desc: "Confirm you are a U.S. citizen or lawful permanent resident, at least 18 years of age, with a valid Social Security Number.",
  },
  {
    num: 2,
    title: "Complete the Secure Application",
    desc: "Fill out the official grant form with your personal details, home address, and banking information for direct deposit.",
  },
  {
    num: 3,
    title: "Receive Your $5,000 Grant",
    desc: "Upon approval, your $5,000 will be deposited directly into your bank account within 7–14 business days. No repayment required.",
  },
];

const ELIGIBILITY = [
  "U.S. Citizen or lawful permanent resident",
  "18 years of age or older",
  "Valid Social Security Number (SSN)",
  "Active U.S. bank account for direct deposit",
  "Provide accurate personal & financial information",
  "One application per household",
];

const TRUST_ITEMS = [
  { icon: <ShieldCheck size={16} />, text: "256-bit SSL Encrypted" },
  { icon: <ShieldCheck size={16} />, text: "Official .gov Program" },
  { icon: <ShieldCheck size={16} />, text: "WCAG 2.1 AA Compliant" },
  { icon: <CheckCircle size={16} />, text: "No Repayment Required" },
  { icon: <CheckCircle size={16} />, text: "Direct Bank Deposit" },
];

export default function HomePage() {
  useEffect(() => {
    AOS.init({ once: true, duration: 650, easing: "ease-out-cubic", offset: 60 });
  }, []);

  return (
    <main id="main-content">

      {/* ── HERO ── */}
      <Hero />

      {/* ── TRUST BAR ── */}
      <div className="trust-bar">
        <div className="trust-bar-inner">
          {TRUST_ITEMS.map(({ icon, text }) => (
            <div className="trust-item" key={text}>
              {icon}
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="how-it-works" aria-labelledby="how-heading">
        <div className="section-inner">
          <p className="section-eyebrow text-center">Step-by-step</p>
          <h2 className="section-title text-center" id="how-heading" data-aos="fade-up">
            How to Claim Your Grant
          </h2>
          <p
            className="section-sub text-center"
            data-aos="fade-up"
            data-aos-delay="100"
            style={{ margin: "0 auto" }}
          >
            The process is simple, secure, and takes less than 5 minutes to complete.
          </p>

          <div className="steps-grid">
            {HOW_STEPS.map((step, i) => (
              <div
                className="step-card"
                key={step.num}
                data-aos="fade-up"
                data-aos-delay={i * 120}
              >
                <div className="step-number">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRESIDENT SPOTLIGHT ── */}
      <section
        className="president-section"
        aria-labelledby="president-heading"
        data-aos="fade-up"
      >
        <div className="president-section-inner">
          {/* Left: Quote / Text */}
          <div className="president-quote-col">
            <p className="section-eyebrow" style={{ justifyContent: "flex-start" }}>
              A Message from the President
            </p>
            <h2 id="president-heading">
              "America&apos;s best days are ahead of us."
            </h2>
            <p className="president-quote-body">
              President Trump has made it his mission to put hardworking
              Americans first. Through the America First Economic Relief Program,
              every eligible U.S. citizen has the opportunity to claim a
              direct{" "}
              <strong style={{ color: "var(--red-secondary)" }}>$5,000 grant</strong>{" "}
              with no strings attached, no repayment required.
            </p>
            <p className="president-quote-body">
              This administration believes in you: the American worker,
              entrepreneur, veteran, and family. These funds are yours.
              Apply today and receive your grant within 7–14 business days.
            </p>
            <div className="president-signature">
              <span className="president-sig-name">Donald J. Trump</span>
              <span className="president-sig-title">47th President of the United States</span>
            </div>
            <button
              className="btn btn-primary"
              style={{ marginTop: "1.5rem" }}
              onClick={() =>
                document.getElementById("claim-form")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Claim Your $5,000 Now <Star size={14} />
            </button>
          </div>

          {/* Right: Both president photos */}
          <div className="president-photos-col">
            <div className="president-photo-stack">
              <div
                className="president-photo-card president-photo-card--main"
                data-aos="fade-left"
                data-aos-delay="100"
              >
                <Image
                  src="/images (1).jpg"
                  alt="President Donald J. Trump — official portrait"
                  width={320}
                  height={360}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              <div
                className="president-photo-card president-photo-card--secondary"
                data-aos="fade-left"
                data-aos-delay="200"
              >
                <Image
                  src="/images (2).jpg"
                  alt="President Donald J. Trump — official presidential portrait"
                  width={220}
                  height={240}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ANNOUNCEMENT CALLOUT ── */}
      <section
        className="section"
        style={{ paddingTop: 0 }}
        aria-labelledby="announcement-heading"
      >
        <div className="section-inner">
          <div className="announcement-box" data-aos="fade-up">
            <div className="announcement-icon">
              <Users size={36} color="#f0c169" />
            </div>
            <div className="announcement-text">
              <h2 id="announcement-heading">Presidential Grant Initiative</h2>
              <p>
                President Trump has authorized a direct $5,000 relief grant to eligible American
                citizens as part of the America First Economic Relief Program. This program is
                administered by the Executive Office of the President and funded by the federal
                Economic Relief Act. Applications are processed on a first-come, first-served basis.
                <strong style={{ color: "#f0c169" }}> Limited enrollment period. Apply today.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORM SECTION ── */}
      <section className="form-section" id="claim-form" aria-labelledby="form-section-heading">
        <div className="form-container">
          {/* Left info */}
          <div data-aos="fade-right">
            <p className="section-eyebrow" style={{ justifyContent: "flex-start" }}>Official Application</p>
            <h2 id="form-section-heading">Apply for Your $5,000 American Citizen Grant</h2>
            <p>
              Complete the secure application below. All fields are required. Your information is
              protected by 256-bit SSL encryption and will never be sold or shared with third parties.
            </p>

            <ul className="requirement-list">
              {ELIGIBILITY.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="secure-badge">
              <Lock size={14} />
              Secured by 256-bit SSL Encryption. Official Program
            </div>

            {/* Mini stats */}
            <div className="mini-stats-grid">
              {[
                { label: "Grant Amount", val: "$5,000" },
                { label: "Processing Time", val: "7–14 Days" },
                { label: "Applications Open", val: "Today" },
                { label: "Repayment", val: "None" },
              ].map(({ label, val }) => (
                <div className="mini-stat-card" key={label}>
                  <div className="mini-stat-val">{val}</div>
                  <div className="mini-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – form */}
          <div data-aos="fade-left" data-aos-delay="100">
            <GrantForm />
          </div>
        </div>
      </section>
    </main>
  );
}
