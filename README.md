# RESUME_TAILOR.dev

<p align="center">
  <em>Stop sending the same resume to every job.</em><br>
  <strong>RESUME_TAILOR.dev uses AI to evaluate job offers against your CV, tailor your resume per listing, and track every application in one place.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white" alt="Playwright">
  <img src="https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white" alt="Go">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT">
</p>

<p align="center"><sub>Created and maintained by <strong>Muzammil</strong></sub></p>

---

## What Is This

RESUME_TAILOR.dev turns any AI coding CLI into a job-search command center. Instead of tracking applications in a spreadsheet and rewriting your CV by hand, you get an AI-powered pipeline that:

- **Evaluates offers** into a structured report (blocks A through H) with a global 1-5 fit score based on how well your CV matches the job description
- **Generates tailored PDFs**: ATS-optimized CVs customized for each job description
- **Scans job portals** automatically (Greenhouse, Ashby, Lever, company career pages)
- **Processes in batch**: evaluate many offers in parallel with sub-agents
- **Tracks everything** in a single source of truth with integrity checks
- **Researches companies and finds the right person to contact**, because applications get you in the queue and research gets you a conversation

> **Important: This is NOT a spray-and-pray tool.** RESUME_TAILOR.dev is a filter. It helps you find the few offers worth your time out of hundreds, and it recommends against applying to anything scoring below 4.0/5. Always review before submitting.

> **Heads up: the first evaluations won't be great.** The system doesn't know you yet. Feed it context: your CV, your projects, your proof points, your preferences, what you're good at and what you want to avoid. The more you teach it, the better it gets.

## Features

| Feature | Description |
| --- | --- |
| **Auto-Pipeline** | Paste a job URL, get a full evaluation + tailored PDF + tracker entry |
| **A-H Evaluation** | Role summary, CV match, level strategy, compensation research, personalization, interview prep (STAR+R), and a posting-legitimacy check that flags scams and ghost jobs |
| **ATS PDF Generation** | Keyword-injected CVs rendered from an HTML template via Playwright |
| **Cover Letter Generator** | Research-backed cover letters with keyword mirroring and A4 PDF output |
| **Application Email Drafts** | Recruiter / referral / cold application emails with subject line and attachment checklist. Draft-only: nothing is ever sent for you |
| **Portal Scanner** | Pre-configured companies plus custom queries across Ashby, Greenhouse, Lever and more |
| **Batch Processing** | Parallel evaluation with headless CLI workers |
| **Dashboard TUI** | Terminal UI to browse, filter and sort your pipeline |
| **Interview Story Bank** | Accumulates STAR+Reflection stories across evaluations so you can answer any behavioral question |
| **Interview Prep** | Time-blocked prep plans, practice sessions with feedback, post-interview debriefs |
| **Negotiation Scripts** | Salary negotiation frameworks and counter-offer leverage |
| **Pipeline Integrity** | Automated merge, dedup, status normalization and health checks |
| **Human-in-the-Loop** | The AI evaluates and recommends. You decide and act. The system never submits an application |

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/<your-username>/RESUME_TAILOR.dev.git
cd RESUME_TAILOR.dev && npm install
npx playwright install chromium   # only needed for PDF generation

# 2. Check setup
npm run doctor

# 3. Configure
cp config/profile.example.yml config/profile.yml   # edit with your details
cp templates/portals.example.yml portals.yml        # customize companies

# 4. Add your CV
# Create cv.md in the project root with your CV in markdown

# 5. Open your AI CLI in this directory
claude   # or codex / opencode / qwen / agy / grok

# 6. Start using
# Paste a job URL or JD text to trigger the auto-pipeline
```

On first launch, the system walks you through setup (your CV, profile and target roles) just by chatting.

> **The system is designed to be customized by your AI CLI itself.** Modes, archetypes, scoring weights and scripts: just ask it to change them.

## Usage

In CLIs that register slash commands:

```
/career-ops                → Show all available commands
/career-ops {paste a JD}   → Full auto-pipeline (evaluate + PDF + tracker)
/career-ops scan           → Scan portals for new offers
/career-ops pdf            → Generate ATS-optimized CV
/career-ops cover          → Cover letter generator
/career-ops email          → Application email draft (draft-only)
/career-ops batch          → Batch evaluate multiple offers
/career-ops tracker        → View application status
/career-ops pipeline       → Process pending URLs
/career-ops contacto       → Find hiring manager / recruiter + draft a LinkedIn message
/career-ops deep           → Structured company research prompt
```

In Codex, slash commands are not guaranteed. Ask in plain language instead, for example: *"Run the scan mode and summarize new matches."*

## How It Works

```
You paste a job URL or description
        │
        ▼
┌──────────────────┐
│  Archetype       │  Classifies the role type
│  Detection       │
└────────┬─────────┘
         │
┌────────▼─────────┐
│  A-H Evaluation  │  Match, gaps, comp research, STAR stories, legitimacy
│  (reads cv.md)   │
└────────┬─────────┘
         │
    ┌────┼────┐
    ▼    ▼    ▼
 Report  PDF  Tracker
  .md   .pdf  entry
```

## Project Structure

```
RESUME_TAILOR.dev/
├── AGENTS.md                    # Agent instructions (all CLIs)
├── cv.md                        # Your CV (create this)
├── article-digest.md            # Your proof points (optional)
├── config/
│   └── profile.example.yml      # Template for your profile
├── modes/                       # Skill modes (evaluation, pdf, cover, scan, batch...)
├── templates/
│   ├── cv-template.html         # ATS-optimized CV template
│   ├── portals.example.yml      # Scanner config template
│   └── states.yml               # Canonical statuses
├── batch/                       # Batch prompt and runner
├── dashboard/                   # Go TUI pipeline viewer
├── data/                        # Your tracking data (gitignored)
├── reports/                     # Evaluation reports (gitignored)
├── output/                      # Generated PDFs (gitignored)
├── fonts/                       # CV fonts
├── docs/                        # Setup and architecture docs
└── examples/                    # Sample CV, report, proof points
```

## Tech Stack

- **Agent**: AI coding CLI with shared skills and modes
- **PDF**: Playwright + HTML template
- **Scanner**: Playwright + Greenhouse API + web search
- **Dashboard**: Go + Bubble Tea + Lipgloss
- **Data**: Markdown tables + YAML config + TSV batch files

## FAQ

**Does RESUME_TAILOR.dev apply to jobs for me?**
No. It evaluates, ranks and drafts. You review and decide. It never submits, sends or clicks anything on your behalf.

**Which AI CLIs does it work with?**
Any major AI coding CLI that supports agent skills: Claude Code, Codex, Antigravity, OpenCode, Grok, Qwen and others.

**Can I run it cheaply?**
Yes. It can run on free-tier or local models. See `docs/` for budget setup notes.

## About the Author

I'm **Muzammil**, a Computer Science graduate from Sir Syed University of Engineering & Technology (SSUET), Karachi. I work across mobile development, AI integration and data analytics, with a stack that includes Flutter, FastAPI, Firebase, Python, LangChain, the Gemini API, Scikit-learn and TensorFlow. I built RESUME_TAILOR.dev to make tailoring a CV to every job faster and smarter.

- GitHub: `https://github.com/<your-username>`
- LinkedIn: `https://linkedin.com/in/<your-handle>`
- Email: `<your-email>`

## Disclaimer

**RESUME_TAILOR.dev is a local, open-source tool, NOT a hosted service.** By using it, you acknowledge:

1. **You control your data.** Your CV and personal data stay on your machine and are sent directly to the AI provider you choose. No data is collected or stored by this project.
2. **You control the AI.** The default prompts instruct the AI not to auto-submit applications, but AI models can behave unpredictably. **Always review AI-generated content for accuracy before submitting.**
3. **You comply with third-party ToS.** Use this tool in accordance with the Terms of Service of the career portals you interact with. Do not use it to spam employers or overwhelm ATS systems.
4. **No guarantees.** Evaluations are recommendations, not truth. AI models may hallucinate skills or experience. The author is not liable for employment outcomes.

## License & Acknowledgements

Released under the [MIT License](LICENSE). RESUME_TAILOR.dev is built on top of the open-source [career-ops](https://github.com/santifer/career-ops) project by Santiago Fernández de Valderrama Aparicio (MIT). The original copyright and license notice are retained in the `LICENSE` file, as the MIT License requires.
