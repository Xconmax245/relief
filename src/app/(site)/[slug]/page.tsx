import { notFound } from "next/navigation";
import { PAGES } from "@/data/pages";
import { Metadata } from "next";
import { ShieldCheck, Calendar } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return { title: "Page Not Found" };

  return {
    title: `${page.title} | WhiteHouse.gov`,
    description: `Official ${page.title} for the American Citizen Grant Program.`,
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = PAGES[slug];

  if (!page) {
    notFound();
  }

  return (
    <main id="main-content" className="page-container">
      {/* Premium Page Header */}
      <div className="page-header">
        <div className="page-header-inner">
          <div className="page-badge">
            <ShieldCheck size={14} />
            <span>Official Policy & Information</span>
          </div>
          <h1>{page.title}</h1>
          <div className="page-meta">
            <Calendar size={14} />
            <span>Last Updated: {page.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="prose-container">
        {page.content}
      </div>
    </main>
  );
}
