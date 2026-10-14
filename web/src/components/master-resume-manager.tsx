"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp, FileUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type Experience = { company: string; title: string; dates: string; description: string; achievements: string };
export type Education = { institution: string; degree: string; dates: string; details: string };
export type SkillGroup = { category: string; skills: string };
export type Project = { name: string; description: string; technologies: string; link: string };
export type Certification = { name: string; issuer: string; date: string };

export type Resume = {
  personal: { name: string; headline: string; email: string; phone: string; location: string; linkedin: string; github: string; portfolio: string };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
  projects: Project[];
  certifications: Certification[];
};

export const emptyResume = (): Resume => ({
  personal: { name: "", headline: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
});

const splitLines = (value: string) => value.split(/\r?\n/).map((line) => line.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
const clean = (value: string) => value.replace(/\*\*/g, "").replace(/^\*|\*$/g, "").trim();

export function parseMarkdown(markdown: string): Resume {
  const resume = emptyResume();
  const lines = markdown.split(/\r?\n/);
  const title = lines.find((line) => /^#\s+/.test(line));
  if (title) resume.personal.name = title.replace(/^#\s+/, "").replace(/^CV\s*[-—:]\s*/i, "").trim();

  const contact = lines.find((line) => /@/.test(line) && /\|/.test(line));
  if (contact) {
    const parts = contact.split("|").map(clean);
    for (const part of parts) {
      const lower = part.toLowerCase();
      if (lower.includes("@")) resume.personal.email = part.match(/[\w.+-]+@[\w.-]+\.\w+/)?.[0] || part;
      else if (/linkedin/i.test(part)) resume.personal.linkedin = part.replace(/^linkedin\s*:?\s*/i, "");
      else if (/github/i.test(part)) resume.personal.github = part.replace(/^github\s*:?\s*/i, "");
      else if (/portfolio/i.test(part)) resume.personal.portfolio = part.replace(/^portfolio\s*:?\s*/i, "");
      else if (/\+?\d[\d\s().-]{6,}/.test(part)) resume.personal.phone = part;
      else if (!resume.personal.location) resume.personal.location = part;
    }
  }
  const headline = lines.find((line) => /^\*\*Headline:\*\*/i.test(line));
  if (headline) resume.personal.headline = clean(headline.replace(/^\*\*Headline:\*\*/i, ""));

  const sectionAt = (name: string) => {
    const index = lines.findIndex((line) => new RegExp(`^##\\s+${name}\\s*$`, "i").test(line.trim()));
    if (index < 0) return [];
    const next = lines.findIndex((line, i) => i > index && /^##\s+/.test(line.trim()));
    return lines.slice(index + 1, next < 0 ? lines.length : next);
  };
  resume.summary = sectionAt("Professional Summary").filter((line) => line.trim()).join("\n").trim();

  const experienceLines = sectionAt("Work Experience");
  for (let i = 0; i < experienceLines.length; i++) {
    const heading = experienceLines[i].match(/^###\s+(.+)/);
    if (!heading) continue;
    const item: Experience = { company: "", title: "", dates: "", description: "", achievements: "" };
    const headingText = clean(heading[1]);
    const separator = headingText.match(/\s+(?:--|—|-)\s+/);
    if (separator) {
      const [left, right] = headingText.split(separator[0]);
      item.title = left.trim();
      item.company = right.trim();
    } else item.company = headingText;
    const block: string[] = [];
    for (i++; i < experienceLines.length && !/^###\s+/.test(experienceLines[i]); i++) block.push(experienceLines[i]);
    const meta = block.find((line) => /^\*.*\*$/.test(line.trim()));
    if (meta) item.dates = clean(meta);
    const titleLine = block.find((line) => /^\*\*.+\*\*$/.test(line.trim()));
    if (titleLine) item.title = clean(titleLine);
    const bullets = block.filter((line) => /^\s*[-*]\s+/.test(line)).map((line) => line.replace(/^\s*[-*]\s+/, "").trim());
    const prose = block.filter((line) => line.trim() && line !== meta && line !== titleLine && !/^\s*[-*]\s+/.test(line)).map(clean);
    item.description = prose.join("\n");
    item.achievements = bullets.join("\n");
    resume.experience.push(item);
    i--;
  }

  const educationLines = sectionAt("Education");
  for (const line of educationLines.filter((entry) => entry.trim() && !/^relevant coursework:/i.test(entry.trim()))) {
    const text = line.replace(/^\s*[-*]\s+/, "").trim();
    const dash = text.split(/\s+--\s+|\s+—\s+/);
    const item: Education = { institution: dash[1]?.replace(/\s*\(.+\)\s*$/, "").trim() || "", degree: dash[0]?.trim() || text, dates: text.match(/\b(19|20)\d{2}(?:\s*[-–]\s*(?:\w+|\d{4}))?/)?.[0] || "", details: "" };
    const details = text.match(/\(([^)]+)\)/);
    if (details && !/^\d{4}/.test(details[1])) item.details = details[1];
    resume.education.push(item);
  }

  for (const line of sectionAt("Technical Skills").concat(sectionAt("Skills")).filter((entry) => /^\s*[-*]\s+/.test(entry))) {
    const text = line.replace(/^\s*[-*]\s+/, "").trim();
    const match = text.match(/^\*\*([^:]+):\*\*\s*(.*)$/);
    resume.skills.push({ category: match?.[1] || "Skills", skills: match?.[2] || clean(text) });
  }

  const projectLines = sectionAt("Projects");
  for (let i = 0; i < projectLines.length; i++) {
    const heading = projectLines[i].match(/^###\s+(.+)/);
    if (!heading) continue;
    const item: Project = { name: clean(heading[1]), description: "", technologies: "", link: "" };
    const block: string[] = [];
    for (i++; i < projectLines.length && !/^###\s+/.test(projectLines[i]); i++) block.push(projectLines[i]);
    const tech = block.find((line) => /^\*.*\*$/.test(line.trim()));
    item.technologies = tech ? clean(tech) : "";
    item.description = block.filter((line) => line.trim() && line !== tech).map((line) => line.replace(/^\s*[-*]\s+/, "").trim()).join("\n");
    resume.projects.push(item);
    i--;
  }

  for (const line of sectionAt("Certifications").filter((entry) => /^\s*[-*]\s+/.test(entry))) {
    const text = line.replace(/^\s*[-*]\s+/, "").trim();
    const parts = text.split(/\s+--\s+|\s+—\s+|\s+-\s+/);
    resume.certifications.push({ name: parts[0] || text, issuer: parts[1] || "", date: parts[2] || "" });
  }
  return resume;
}

export function toMarkdown(resume: Resume): string {
  const p = resume.personal;
  const contacts = [p.location, p.email, p.phone, p.linkedin && `LinkedIn: ${p.linkedin}`, p.github && `GitHub: ${p.github}`, p.portfolio && `Portfolio: ${p.portfolio}`].filter(Boolean);
  const out = [`# ${p.name || "Your Name"}`, p.headline ? `**Headline:** ${p.headline}` : "", contacts.join(" | "), "", "## Professional Summary", resume.summary.trim(), ""];
  if (resume.experience.length) {
    out.push("## Work Experience", "");
    for (const item of resume.experience) out.push(`### ${item.title || "Role"} -- ${item.company || "Company"}`, item.dates ? `*${item.dates}*` : "", item.description.trim(), ...splitLines(item.achievements).map((line) => `- ${line}`), "");
  }
  if (resume.skills.length) {
    out.push("## Technical Skills", "", ...resume.skills.map((item) => `- **${item.category || "Skills"}:** ${item.skills}`), "");
  }
  if (resume.projects.length) {
    out.push("## Projects", "");
    for (const item of resume.projects) out.push(`### ${item.name || "Project"}`, item.technologies ? `*${item.technologies}*` : "", ...splitLines(item.description).map((line) => `- ${line}`), item.link ? `Link: ${item.link}` : "", "");
  }
  if (resume.education.length) {
    out.push("## Education", "", ...resume.education.map((item) => `- ${item.degree}${item.institution ? ` -- ${item.institution}` : ""}${item.dates ? ` (${item.dates})` : ""}${item.details ? ` — ${item.details}` : ""}`), "");
  }
  if (resume.certifications.length) out.push("## Certifications", "", ...resume.certifications.map((item) => `- ${item.name}${item.issuer ? ` -- ${item.issuer}` : ""}${item.date ? ` -- ${item.date}` : ""}`), "");
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

const inputClass = "w-full rounded-lg border border-border bg-background/40 px-3 py-2 text-sm outline-none transition focus:border-brand/60";
const field = (label: string, value: string, onChange: (value: string) => void, options?: { placeholder?: string; multiline?: boolean; required?: boolean }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-medium text-muted">{label}{options?.required ? " *" : ""}</span>
    {options?.multiline ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={options.placeholder} className={cn(inputClass, "min-h-20 resize-y")} /> : <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={options?.placeholder} className={inputClass} />}
  </label>
);

function Section({ title, description, children, open, onToggle }: { title: string; description: string; children: React.ReactNode; open: boolean; onToggle: () => void }) {
  return (
    <section className="rounded-2xl border border-border bg-surface/35">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-4 p-5 text-left">
        <span><span className="block font-display text-xl text-landing">{title}</span><span className="mt-1 block text-xs text-muted">{description}</span></span>
        {open ? <ChevronUp className="size-4 text-muted" /> : <ChevronDown className="size-4 text-muted" />}
      </button>
      {open && <div className="border-t border-border p-5">{children}</div>}
    </section>
  );
}

export function MasterResumeManager() {
  const [resume, setResume] = useState<Resume>(emptyResume);
  const [loaded, setLoaded] = useState(false);
  const [exists, setExists] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({ personal: true, summary: true, experience: true, education: false, skills: false, projects: false, certifications: false });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/cv").then(async (response) => {
      if (!response.ok) throw new Error("Could not load cv.md");
      const data = await response.json();
      setExists(Boolean(data.exists));
      setResume(parseMarkdown(data.content || ""));
      setStatus(data.exists ? "Current master resume loaded" : "No master resume yet — start with your details");
    }).catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load your resume")).finally(() => setLoaded(true));
  }, []);

  const update = <K extends keyof Resume>(key: K, value: Resume[K]) => { setResume((current) => ({ ...current, [key]: value })); setDirty(true); setStatus("Unsaved changes"); };
  const updatePersonal = (key: keyof Resume["personal"], value: string) => update("personal", { ...resume.personal, [key]: value });
  const toggle = (key: string) => setOpen((current) => ({ ...current, [key]: !current[key] }));
  const preview = useMemo(() => toMarkdown(resume), [resume]);

  const save = async () => {
    if (!resume.personal.name.trim()) { setError("Add your full name before saving."); setOpen((current) => ({ ...current, personal: true })); return; }
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/cv", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: preview }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not save cv.md");
      setExists(true); setDirty(false); setStatus(data.backedUp ? "Saved safely — previous cv.md backed up" : "Saved to cv.md"); 
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save your resume"); }
    finally { setSaving(false); }
  };

  const importMarkdown = (markdown: string) => {
    if (!markdown.trim()) { setError("That Markdown file is empty."); return; }
    if ((dirty || resume.personal.name) && !window.confirm("Replace the current editor draft with this Markdown? Nothing will be saved until you click Save.")) return;
    setResume(parseMarkdown(markdown)); setDirty(true); setStatus("Imported as a draft — review it before saving"); setError("");
  };

  const add = (key: "experience" | "education" | "skills" | "projects" | "certifications", value: Experience | Education | SkillGroup | Project | Certification) => {
    setResume((current) => ({ ...current, [key]: [...(current[key] as unknown as unknown[]), value] }) as Resume);
    setDirty(true);
    setStatus("Unsaved changes");
  };
  const remove = <K extends keyof Resume>(key: K, index: number) => update(key, (resume[key] as unknown as Array<unknown>).filter((_, itemIndex) => itemIndex !== index) as Resume[K]);

  if (!loaded) return <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-muted">Loading your master resume…</div>;
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-text">Master resume</p><h1 className="mt-2 font-display text-3xl tracking-tight text-landing">Your source of truth</h1><p className="mt-2 max-w-2xl text-sm text-muted">Build and maintain the original resume that powers future tailored versions. Changes stay in this editor until you explicitly save.</p></div>
        <div className="flex items-center gap-3"><span className={cn("text-xs", error ? "text-red-500" : dirty ? "text-brand-text" : "text-muted")}>{error || status}</span><button type="button" onClick={save} disabled={saving || !dirty} className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium", dirty ? "bg-brand text-brand-foreground hover:bg-brand-200" : "border border-border bg-surface text-muted")}><Save className="size-4" />{saving ? "Saving…" : "Save master resume"}</button></div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)]">
        <div className="space-y-4">
          <Section title="Personal information" description="The contact details shown at the top of your resume." open={!!open.personal} onToggle={() => toggle("personal")}>
            <div className="grid gap-4 sm:grid-cols-2">{field("Full name", resume.personal.name, (v) => updatePersonal("name", v), { required: true, placeholder: "Your full name" })}{field("Professional headline", resume.personal.headline, (v) => updatePersonal("headline", v), { placeholder: "Software Engineer · Data & AI" })}{field("Email", resume.personal.email, (v) => updatePersonal("email", v), { placeholder: "you@example.com" })}{field("Phone", resume.personal.phone, (v) => updatePersonal("phone", v), { placeholder: "+1 555 000 0000" })}{field("Location", resume.personal.location, (v) => updatePersonal("location", v), { placeholder: "City, Country" })}{field("LinkedIn", resume.personal.linkedin, (v) => updatePersonal("linkedin", v), { placeholder: "linkedin.com/in/you" })}{field("GitHub", resume.personal.github, (v) => updatePersonal("github", v), { placeholder: "github.com/you" })}{field("Portfolio", resume.personal.portfolio, (v) => updatePersonal("portfolio", v), { placeholder: "your-site.com" })}</div>
          </Section>
          <Section title="Professional summary" description="A concise overview of your experience, strengths and direction." open={!!open.summary} onToggle={() => toggle("summary")}>{field("Summary", resume.summary, (v) => update("summary", v), { multiline: true, placeholder: "Write a 2–4 sentence overview…" })}</Section>
          <Section title="Work experience" description="Add roles, responsibilities and measurable achievements." open={!!open.experience} onToggle={() => toggle("experience")}>
            <div className="space-y-4">{resume.experience.map((item, index) => <div key={index} className="rounded-xl border border-border/70 p-4"><div className="mb-4 flex items-center justify-between"><span className="text-sm font-medium text-foreground">Role {index + 1}</span><button type="button" onClick={() => remove("experience", index)} className="text-muted hover:text-red-500" aria-label={`Remove role ${index + 1}`}><Trash2 className="size-4" /></button></div><div className="grid gap-4 sm:grid-cols-2">{field("Company", item.company, (v) => update("experience", resume.experience.map((x, i) => i === index ? { ...x, company: v } : x)), { required: true })}{field("Job title", item.title, (v) => update("experience", resume.experience.map((x, i) => i === index ? { ...x, title: v } : x)), { required: true })}{field("Dates", item.dates, (v) => update("experience", resume.experience.map((x, i) => i === index ? { ...x, dates: v } : x)), { placeholder: "Sep 2024 – Present" })}{field("Description", item.description, (v) => update("experience", resume.experience.map((x, i) => i === index ? { ...x, description: v } : x)), { multiline: true })}{field("Achievements (one per line)", item.achievements, (v) => update("experience", resume.experience.map((x, i) => i === index ? { ...x, achievements: v } : x)), { multiline: true })}</div></div>)}<button type="button" onClick={() => add("experience", { company: "", title: "", dates: "", description: "", achievements: "" })} className="inline-flex items-center gap-2 text-sm font-medium text-brand-text hover:text-brand"><Plus className="size-4" /> Add experience</button></div>
          </Section>
          <Section title="Education" description="Degrees, institutions and relevant academic details." open={!!open.education} onToggle={() => toggle("education")}>
            <div className="space-y-4">
              {resume.education.map((item, index) => (
                <div key={index} className="rounded-xl border border-border/70 p-4">
                  <div className="mb-4 flex justify-between"><span className="text-sm font-medium">Education {index + 1}</span><button type="button" onClick={() => remove("education", index)} className="text-muted hover:text-red-500"><Trash2 className="size-4" /></button></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {field("Institution", item.institution, (v) => update("education", resume.education.map((x, i) => i === index ? { ...x, institution: v } : x)))}
                    {field("Degree", item.degree, (v) => update("education", resume.education.map((x, i) => i === index ? { ...x, degree: v } : x)))}
                    {field("Dates", item.dates, (v) => update("education", resume.education.map((x, i) => i === index ? { ...x, dates: v } : x)))}
                    {field("Relevant details", item.details, (v) => update("education", resume.education.map((x, i) => i === index ? { ...x, details: v } : x)), { multiline: true })}
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => add("education", { institution: "", degree: "", dates: "", details: "" })} className="inline-flex items-center gap-2 text-sm font-medium text-brand-text"><Plus className="size-4" /> Add education</button>
            </div>
          </Section>
          <Section title="Skills" description="Group technical and professional skills for easy scanning." open={!!open.skills} onToggle={() => toggle("skills")}><div className="space-y-4">{resume.skills.map((item, index) => <div key={index} className="flex items-end gap-3"><div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">{field("Category", item.category, (v) => update("skills", resume.skills.map((x, i) => i === index ? { ...x, category: v } : x)))}{field("Skills (comma separated)", item.skills, (v) => update("skills", resume.skills.map((x, i) => i === index ? { ...x, skills: v } : x)))}</div><button type="button" onClick={() => remove("skills", index)} className="mb-2 text-muted hover:text-red-500"><Trash2 className="size-4" /></button></div>)}<button type="button" onClick={() => add("skills", { category: "", skills: "" })} className="inline-flex items-center gap-2 text-sm font-medium text-brand-text"><Plus className="size-4" /> Add skill category</button></div></Section>
          <Section title="Projects" description="Showcase relevant work, technologies and links." open={!!open.projects} onToggle={() => toggle("projects")}><div className="space-y-4">{resume.projects.map((item, index) => <div key={index} className="rounded-xl border border-border/70 p-4"><div className="mb-4 flex justify-between"><span className="text-sm font-medium">Project {index + 1}</span><button type="button" onClick={() => remove("projects", index)} className="text-muted hover:text-red-500"><Trash2 className="size-4" /></button></div><div className="grid gap-4 sm:grid-cols-2">{field("Project name", item.name, (v) => update("projects", resume.projects.map((x, i) => i === index ? { ...x, name: v } : x)))}{field("Technologies", item.technologies, (v) => update("projects", resume.projects.map((x, i) => i === index ? { ...x, technologies: v } : x)))}{field("Description", item.description, (v) => update("projects", resume.projects.map((x, i) => i === index ? { ...x, description: v } : x)), { multiline: true })}{field("Relevant link", item.link, (v) => update("projects", resume.projects.map((x, i) => i === index ? { ...x, link: v } : x)))}</div></div>)}<button type="button" onClick={() => add("projects", { name: "", description: "", technologies: "", link: "" })} className="inline-flex items-center gap-2 text-sm font-medium text-brand-text"><Plus className="size-4" /> Add project</button></div></Section>
          <Section title="Certifications" description="Credentials, issuers and dates." open={!!open.certifications} onToggle={() => toggle("certifications")}><div className="space-y-3">{resume.certifications.map((item, index) => <div key={index} className="flex items-end gap-3"><div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-3">{field("Certification", item.name, (v) => update("certifications", resume.certifications.map((x, i) => i === index ? { ...x, name: v } : x)))}{field("Issuer", item.issuer, (v) => update("certifications", resume.certifications.map((x, i) => i === index ? { ...x, issuer: v } : x)))}{field("Date", item.date, (v) => update("certifications", resume.certifications.map((x, i) => i === index ? { ...x, date: v } : x)))}</div><button type="button" onClick={() => remove("certifications", index)} className="mb-2 text-muted hover:text-red-500"><Trash2 className="size-4" /></button></div>)}<button type="button" onClick={() => add("certifications", { name: "", issuer: "", date: "" })} className="inline-flex items-center gap-2 text-sm font-medium text-brand-text"><Plus className="size-4" /> Add certification</button></div></Section>
        </div>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <div className="overflow-hidden rounded-2xl border border-border bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-text">Live preview</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Generated in the existing cv.md format</p></div><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-500 dark:bg-slate-900">Preview only</span></div>
            <article className="resume-preview max-h-[calc(100vh-150px)] overflow-y-auto p-6 text-sm leading-relaxed"><h2 className="text-2xl font-semibold">{resume.personal.name || "Your Name"}</h2>{resume.personal.headline && <p className="mt-1 text-base text-brand-text">{resume.personal.headline}</p>}<p className="mt-2 text-xs text-slate-500">{[resume.personal.location, resume.personal.email, resume.personal.phone].filter(Boolean).join(" · ") || "Add contact details"}</p><p className="text-xs text-slate-500">{[resume.personal.linkedin, resume.personal.github, resume.personal.portfolio].filter(Boolean).join(" · ")}</p>{resume.summary && <><h3 className="mt-6 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:border-slate-800">Summary</h3><p className="mt-2 whitespace-pre-line">{resume.summary}</p></>}{resume.experience.length > 0 && <><h3 className="mt-6 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:border-slate-800">Experience</h3>{resume.experience.map((item, i) => <div key={i} className="mt-3"><div className="flex justify-between gap-3 font-semibold"><span>{item.title || "Job title"}</span><span className="text-xs font-normal text-slate-500">{item.dates}</span></div><p className="text-brand-text">{item.company || "Company"}</p>{item.description && <p className="mt-1 whitespace-pre-line">{item.description}</p>}<ul className="ml-4 list-disc">{splitLines(item.achievements).map((line, j) => <li key={j}>{line}</li>)}</ul></div>)}</>}{resume.skills.length > 0 && <><h3 className="mt-6 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:border-slate-800">Skills</h3>{resume.skills.map((item, i) => <p key={i} className="mt-1"><strong>{item.category || "Skills"}:</strong> {item.skills}</p>)}</>}{resume.projects.length > 0 && <><h3 className="mt-6 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:border-slate-800">Projects</h3>{resume.projects.map((item, i) => <div key={i} className="mt-3"><p className="font-semibold">{item.name || "Project"}</p>{item.technologies && <p className="text-xs italic text-slate-500">{item.technologies}</p>}<p className="whitespace-pre-line">{item.description}</p>{item.link && <p className="text-xs text-brand-text">{item.link}</p>}</div>)}</>}{resume.education.length > 0 && <><h3 className="mt-6 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:border-slate-800">Education</h3>{resume.education.map((item, i) => <p key={i} className="mt-2"><strong>{item.degree}</strong>{item.institution && ` — ${item.institution}`} {item.dates && `(${item.dates})`}{item.details && <><br />{item.details}</>}</p>)}</>}{resume.certifications.length > 0 && <><h3 className="mt-6 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:border-slate-800">Certifications</h3>{resume.certifications.map((item, i) => <p key={i} className="mt-2">{item.name}{item.issuer && ` — ${item.issuer}`} {item.date && `(${item.date})`}</p>)}</>}</article>
          </div>
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface/20 p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-medium">Import Markdown</p><p className="mt-1 text-xs text-muted">Loads a draft only. Your saved cv.md is untouched until you confirm with Save.</p></div><button type="button" onClick={() => fileRef.current?.click()} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-brand/50"><FileUp className="size-3.5" /> Choose file</button></div><input ref={fileRef} type="file" accept=".md,.markdown,.txt" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) file.text().then(importMarkdown).catch(() => setError("Could not read that Markdown file.")); event.currentTarget.value = ""; }} /><p className="mt-3 text-[11px] text-faint">DOCX/PDF parsing is not part of this manager. Use the existing CLI-assisted ingest on the first-run screen for those formats.</p></div>
          {!exists && <div className="mt-3 flex items-start gap-2 rounded-xl border border-brand/20 bg-brand-soft/40 p-3 text-xs text-brand-text"><Check className="mt-0.5 size-3.5 shrink-0" />Nothing has been written yet. Save when your draft is ready.</div>}
        </aside>
      </div>
    </div>
  );
}
