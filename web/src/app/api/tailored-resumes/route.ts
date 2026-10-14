import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { careerOpsRoot } from "@/lib/career-ops";
import { atomicWrite } from "@/lib/core/safe-write";

const MAX_BYTES = 200_000;

function versionsDir() {
  return path.join(careerOpsRoot(), "data", "tailored-resumes");
}

function safePart(value: string, fallback: string) {
  const part = value.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
  return part || fallback;
}

export async function GET(req: Request) {
  try {
    const dir = versionsDir();
    const id = new URL(req.url).searchParams.get("id");
    if (id) {
      if (!/^[a-z0-9-]+$/i.test(id)) return NextResponse.json({ error: "invalid version id" }, { status: 400 });
      const metadataPath = path.join(dir, `${id}.json`);
      const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
      const contentPath = path.join(dir, String(metadata.contentFile || `${id}.md`));
      if (path.dirname(contentPath) !== dir) return NextResponse.json({ error: "invalid content path" }, { status: 400 });
      return NextResponse.json({ version: metadata, content: fs.readFileSync(contentPath, "utf8") });
    }
    const versions = fs.readdirSync(dir)
      .filter((name) => name.endsWith(".json"))
      .map((name) => JSON.parse(fs.readFileSync(path.join(dir, name), "utf8")))
      .sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)));
    return NextResponse.json({ versions });
  } catch {
    const id = new URL(req.url).searchParams.get("id");
    if (id) return NextResponse.json({ error: "Saved tailored resume not found" }, { status: 404 });
    return NextResponse.json({ versions: [] });
  }
}

export async function POST(req: Request) {
  let body: { content?: string; title?: string; company?: string; jobDescription?: string; analysisJobId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  if (typeof body.content !== "string" || !body.content.trim()) {
    return NextResponse.json({ error: "resume content required" }, { status: 400 });
  }
  if (Buffer.byteLength(body.content, "utf8") > MAX_BYTES) {
    return NextResponse.json({ error: "Resume is too large (over 200KB)" }, { status: 413 });
  }

  const savedAt = new Date().toISOString();
  const base = `${savedAt.replace(/[:.]/g, "-")}-${safePart(body.company || "", "company")}-${safePart(body.title || "", "role")}`;
  const dir = versionsDir();
  try {
    fs.mkdirSync(dir, { recursive: true });
    let stem = base;
    let suffix = 1;
    while (fs.existsSync(path.join(dir, `${stem}.json`))) stem = `${base}-${suffix++}`;
    const metadata = {
      id: stem,
      title: body.title?.trim() || "Untitled role",
      company: body.company?.trim() || "Unknown company",
      jobDescription: body.jobDescription?.trim() || "",
      analysisJobId: body.analysisJobId || null,
      savedAt,
      contentFile: `${stem}.md`,
    };
    atomicWrite(path.join(dir, metadata.contentFile), body.content);
    atomicWrite(path.join(dir, `${stem}.json`), JSON.stringify(metadata, null, 2) + "\n");
    return NextResponse.json({ ok: true, version: metadata });
  } catch {
    return NextResponse.json({ error: "Could not save the tailored resume" }, { status: 500 });
  }
}
