# Career Ops — Project Details

**Made by Muzammil**

This repository contains a local-first, AI-assisted career operations toolkit
for organizing a complete job-search workflow. It helps a candidate discover
public job postings, evaluate opportunities against a profile, tailor
application materials, generate CVs and cover letters, and track applications
without uploading personal data to a central service.

## Main capabilities

- Discover jobs from supported public ATS and job-board sources.
- Score and evaluate job descriptions with structured AI-assisted workflows.
- Tailor CVs and cover letters for individual opportunities.
- Generate ATS-friendly PDF and LaTeX documents.
- Track applications, reports, follow-ups, and pipeline status locally.
- Run checks for posting liveness, duplicate records, data consistency, and CV
  facts.
- Use the optional Go dashboard to inspect the application pipeline.
- Work with multiple AI coding CLIs, including Claude Code, Codex, OpenCode,
  Gemini, Qwen, Kimi, Grok, Antigravity, and GitHub Copilot.

## Technology

- Node.js 18 or newer
- ECMAScript modules (`.mjs`)
- Playwright for browser automation and PDF generation
- Go for the optional dashboard
- Markdown, YAML, JSON, and local files for configuration and tracking

## Getting started

1. Install Node.js 18 or newer.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to a local `.env` file only when an integration needs
   environment variables.
4. Review `AGENTS.md` and the main `README.md` for the complete workflow.
5. Run `npm run doctor` to check the local setup.

## Privacy and security

Personal CVs, application records, reports, generated output, local
configuration, API keys, tokens, passwords, certificates, and environment
files are intentionally excluded by `.gitignore`. Do not force-add ignored
files with `git add -f`. Use the example configuration files as templates and
keep real credentials only in local environment files or an approved secret
manager.

## Attribution

This project is published and documented in this repository by **Muzammil**.
The original project documentation and upstream notices remain in the
repository where applicable. See `LICENSE`, `NOTICE`, and the existing
contributor documentation for project terms and attribution details.
