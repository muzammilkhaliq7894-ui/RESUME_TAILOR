"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  FolderOpen,
  History,
  Library,
  ScanSearch,
  Sparkles,
  WandSparkles,
} from "lucide-react";
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

const quickActions = [
  { href: "/cv", label: "Manage Master Resume", detail: "Add or update your source resume", icon: FileText },
  { href: "/tailor", label: "Tailor for a Job", detail: "Create a role-specific version", icon: WandSparkles },
  { href: "/analyzer", label: "Analyze a Job", detail: "Compare a posting with your master resume", icon: ScanSearch },
  { href: "/resume-library", label: "Browse Resume Library", detail: "Review saved versions", icon: Library },
];

function formatSavedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleString([], { month: "short", day: "numeric", year: "numeric" });
}

export function ResumeDashboard() {
  const [versions, setVersions] = useState<TailoredVersion[]>([]);
  const [hasMasterResume, setHasMasterResume] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cvResponse, versionsResponse] = await Promise.all([
          fetch("/api/cv"),
          fetch("/api/tailored-resumes"),
        ]);

        let masterExists = false;
        if (cvResponse.ok) {
          const data = await cvResponse.json();
          masterExists = Boolean(data.exists && typeof data.content === "string" && data.content.trim());
        }

        let savedVersions: TailoredVersion[] = [];
        if (versionsResponse.ok) {
          const data = await versionsResponse.json();
          savedVersions = Array.isArray(data.versions) ? data.versions : [];
        }

        setHasMasterResume(masterExists);
        setVersions(savedVersions);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const summaryCards = useMemo(
    () => [
      {
        label: "Master Resume",
        value: hasMasterResume ? "Ready" : "Not added",
        detail: hasMasterResume ? "Source resume is on file" : "Set up your foundation",
        icon: FileText,
      },
      {
        label: "Tailored Resumes",
        value: String(versions.length),
        detail: versions.length ? "Saved versions ready" : "No versions created",
        icon: WandSparkles,
      },
      {
        label: "Saved Job Descriptions",
        value: String(versions.filter((version) => version.jobDescription?.trim()).length),
        detail: versions.some((version) => version.jobDescription?.trim()) ? "Linked to saved drafts" : "Nothing saved yet",
        icon: BriefcaseBusiness,
      },
      {
        label: "Recent Activity",
        value: versions[0] ? formatSavedAt(versions[0].savedAt) : "None",
        detail: versions[0] ? `${versions[0].company || "Latest draft"}` : "Your activity will appear here",
        icon: History,
      },
    ],
    [hasMasterResume, versions],
  );

  const recent = versions.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-text">Resume workspace</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Dashboard</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Manage your master resume and create job-specific versions.
            </p>
          </div>
          <Link
            href="/tailor"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
          >
            Tailor a Resume
            <ArrowRight className="size-4" />
          </Link>
        </header>

        <section aria-labelledby="summary-heading" className="mt-8">
          <h2 id="summary-heading" className="sr-only">Resume summary</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map(({ label, value, detail, icon: Icon }) => (
              <Card key={label} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-muted">{label}</p>
                  <Icon className="size-4 text-brand-text" aria-hidden />
                </div>
                <p className="mt-5 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
                <p className="mt-1 text-xs text-faint">{detail}</p>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="quick-actions-heading" className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="quick-actions-heading" className="text-lg font-semibold tracking-tight text-foreground">Quick actions</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {quickActions.map(({ href, label, detail, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-brand/40 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-text">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">{label}</span>
                  <span className="mt-1 block text-xs text-muted">{detail}</span>
                </span>
                <ArrowRight className="ml-auto size-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
          <section aria-labelledby="recent-resumes-heading">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="recent-resumes-heading" className="text-lg font-semibold tracking-tight text-foreground">Recent resumes</h2>
              <Link href="/resume-library" className="text-sm font-medium text-brand-text hover:underline">View library</Link>
            </div>

            {!loading && recent.length === 0 ? (
              <Card className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-surface-hover text-faint">
                  <FolderOpen className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-foreground">No tailored resumes yet</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                  Add your master resume and tailor your first version for a specific role.
                </p>
                <Link href="/tailor" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-text hover:underline">
                  Create your first tailored resume
                  <ArrowRight className="size-4" />
                </Link>
              </Card>
            ) : (
              <div className="space-y-3">
                {recent.map((version) => {
                  const link = version.analysisJobId ? `/tailor?analysisJob=${encodeURIComponent(version.analysisJobId)}` : "/tailor";
                  return (
                    <Card key={version.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{version.title || "Untitled role"}</p>
                          <p className="mt-1 text-xs text-muted">{version.company || "Unknown company"}</p>
                        </div>
                        <span className="text-[11px] uppercase tracking-[0.08em] text-faint">{formatSavedAt(version.savedAt)}</span>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-xs text-faint">Saved draft</span>
                        <Link href={link} className="text-sm font-medium text-brand-text hover:underline">
                          Open in editor
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          <section aria-labelledby="getting-started-heading">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="getting-started-heading" className="text-lg font-semibold tracking-tight text-foreground">Getting started</h2>
              <Sparkles className="size-4 text-brand-text" aria-hidden />
            </div>
            <Card className="p-6">
              <ol className="space-y-5">
                {[
                  "Add your master resume.",
                  "Paste a job description.",
                  "Review the comparison and tailor your draft.",
                  "Save and revisit the project from the library.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand-soft text-xs font-semibold text-brand-text">{index + 1}</span>
                    <span className="pt-0.5 text-sm text-muted">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
