"use client";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle, ArrowRight, Star } from "lucide-react";

export default function Hero() {
  const scrollToForm = () => {
    document.getElementById("claim-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── Announcement ticker ── */}
      <div className="eligibility-strip" aria-live="polite" aria-label="Important announcement">
        <div className="ticker-track">
          <span className="ticker-content">
            <Star size={11} aria-hidden="true" style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
            OFFICIAL NOTICE: The Trump Administration American Citizen Grant Program is now accepting applications
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Star size={11} aria-hidden="true" style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
            Deadline: Limited enrollment period. Apply today
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Star size={11} aria-hidden="true" style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
            $5,000 direct payment to eligible U.S. adult citizens
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Star size={11} aria-hidden="true" style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
            256-bit SSL encrypted. Your data is safe
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Star size={11} aria-hidden="true" style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
            OFFICIAL NOTICE: The Trump Administration American Citizen Grant Program is now accepting applications
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Star size={11} aria-hidden="true" style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
            Deadline: Limited enrollment period. Apply today
            &nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <section className="hero" id="top" aria-labelledby="hero-heading">
        {/* Capitol building background */}
        <div className="hero-bg-img" aria-hidden="true" />
        {/* Dark overlay for readability */}
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-stripe-red" aria-hidden="true" />
        <div className="hero-stripe-gold" aria-hidden="true" />

        <div className="hero-inner hero-inner--centered">
          <motion.div
            className="hero-content-box"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 id="hero-heading">
              Claim Your <span className="accent">$5,000</span><br />
              American Citizen<br />
              Relief Grant
            </h1>

            <p className="hero-sub">
              The Trump Administration is putting money directly back into the
              hands of hard-working Americans. Eligible U.S. citizens may
              receive a one-time{" "}
              <strong style={{ color: "#f0c169" }}>$5,000 grant</strong>{" "}
              deposited directly to their bank account. No repayment required.
            </p>

            {/* Stats row */}
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>$5,000</strong>
                <span>Grant Amount</span>
              </div>
              <div className="hero-stat hero-stat--divider">
                <strong>18+</strong>
                <span>Age Requirement</span>
              </div>
              <div className="hero-stat hero-stat--divider">
                <strong>U.S.</strong>
                <span>Citizens Only</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="hero-cta-row">
              <button
                className="btn btn-primary btn-lg"
                onClick={scrollToForm}
                id="hero-cta-btn"
              >
                Claim Your Grant <ArrowRight size={18} aria-hidden="true" />
              </button>
              <a href="#how-it-works" className="btn btn-outline">
                Learn More
              </a>
            </div>

            {/* Trust signals */}
            <div className="hero-trust-row">
              <div className="hero-trust-item">
                <ShieldCheck size={14} style={{ color: "#86efac" }} aria-hidden="true" />
                <span>SSL Encrypted</span>
              </div>
              <div className="hero-trust-item">
                <CheckCircle size={14} style={{ color: "#86efac" }} aria-hidden="true" />
                <span>Official .gov Program</span>
              </div>
              <div className="hero-trust-item">
                <CheckCircle size={14} style={{ color: "#86efac" }} aria-hidden="true" />
                <span>No Repayment Required</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
