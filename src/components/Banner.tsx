"use client";
import { useState } from "react";
import { ChevronDown, Lock, Building2 } from "lucide-react";

export default function Banner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div role="banner" className="usa-banner">
      <div className="usa-banner__inner">
        <div className="usa-banner__text">
          <Building2 size={14} aria-hidden="true" style={{ flexShrink: 0 }} />
          <span>An official website of the United States government</span>
        </div>
        <button
          className="usa-banner__action"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          Here&apos;s how you know
          <ChevronDown
            size={14}
            aria-hidden="true"
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </button>
      </div>

      <div className={`usa-banner__content${expanded ? " open" : ""}`}>
        <div className="usa-banner__content-inner">
          <div className="icon-block">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d9e8f6" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <div>
              <strong style={{ color: "white", display: "block", marginBottom: "0.25rem" }}>
                Official websites use .gov
              </strong>
              A <strong>.gov</strong> website belongs to an official government organization
              in the United States.
            </div>
          </div>
          <div className="icon-block">
            <Lock size={22} color="#d9e8f6" aria-hidden="true" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: "white", display: "block", marginBottom: "0.25rem" }}>
                Secure .gov websites use HTTPS
              </strong>
              A <strong>lock</strong> or <strong>https://</strong> means you&apos;ve safely
              connected to the .gov website.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
