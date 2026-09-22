import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "American Citizen Grant Program | $5,000 Relief Grant | WhiteHouse.gov",
  description:
    "The Trump Administration's official $5,000 American Citizen Relief Grant. Eligible U.S. adults can claim a one-time $5,000 direct deposit grant. Apply securely online today.",
  keywords: ["american grant", "5000 dollar grant", "trump administration grant", "citizen relief fund", "whitehouse grant"],
  icons: {
    icon: [
      { url: "/WhiteHouse_Logo-removebg-preview.png", type: "image/png" },
    ],
    shortcut: "/WhiteHouse_Logo-removebg-preview.png",
    apple: "/WhiteHouse_Logo-removebg-preview.png",
  },
  openGraph: {
    title: "Claim Your $5,000 American Citizen Grant",
    description: "Official Trump Administration grant program for eligible U.S. citizens. Apply now.",
    type: "website",
    images: [{ url: "/WhiteHouse_Logo-removebg-preview.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,400&family=Public+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Favicon — explicit link tags override Next.js metadata for browser tab */}
        <link rel="icon" href="/WhiteHouse_Logo-removebg-preview.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/WhiteHouse_Logo-removebg-preview.png" type="image/png" />
        <link rel="apple-touch-icon" href="/WhiteHouse_Logo-removebg-preview.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
