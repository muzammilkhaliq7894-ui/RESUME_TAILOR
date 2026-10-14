"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Library } from "lucide-react";
import { Card } from "@/components/ui/card";

type TailoredVersion = {
  id: string;
  title: string;
  company: string;
  savedAt: string;
  jobDescription?: string;
  analysisJobId?: string | null;
  contentFile?: string;
};

function formatSavedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleString([], { month: "short", day: "numeric", year: "numeric" });
}

export default function ResumeLibraryPage() {
  const [versions, setVersions] = useState<TailoredVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/tailored-resumes");
        const data = await response.json();
        setVersions(Array.isArray(data.versions) ? data.versions : []);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-text">Saved versions</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Resume Library</h1>
        </div>
        <Link href="/tailor" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-200">
          Tailor a Resume
        </Link>
      </div>

      {loading ? (
        <Card className="mt-8 p-6 text-sm text-muted">Loading saved tailored resumes…</Card>
      ) : versions.length === 0 ? (
        <Card className="mt-8 flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand-text">
            <Library className="size-5" aria-hidden />
          </span>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">No saved versions yet</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted">
            Tailored versions are saved separately from the master resume. Open the editor to create and approve a job-specific copy.
          </p>
          <Link href="/tailor" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-200">
            Create a tailored resume
          </Link>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {versions.map((version) => {
            const editorUrl = `/tailor?versionId=${encodeURIComponent(version.id)}`;
            return (
              <Card key={version.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{version.title || "Untitled role"}</p>
                    <p className="mt-1 text-xs text-muted">{version.company || "Unknown company"}</p>
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.08em] text-faint">{formatSavedAt(version.savedAt)}</span>
                </div>

                <div className="mt-5 space-y-2 text-sm text-muted">
                  {version.jobDescription?.trim() ? (
                    <p className="line-clamp-3">{version.jobDescription.slice(0, 120)}{version.jobDescription.length > 120 ? "…" : ""}</p>
                  ) : (
                    <p className="text-faint">No saved job description attached.</p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <Link href={editorUrl} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-text hover:underline">
                    Open in editor
                    <ExternalLink className="size-3.5" />
                  </Link>
                  <Link href="/tailor" className="text-sm text-muted hover:text-foreground">New version</Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
