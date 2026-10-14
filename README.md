<!-- ===================== HEADER BANNER ===================== -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=240&section=header&text=RESUME_TAILOR.dev&fontSize=56&fontColor=ffffff&fontAlignY=38&desc=AI-powered%20resume%20tailoring%20%26%20job%20application%20tracking&descSize=18&descAlignY=60&animation=fadeIn" alt="RESUME_TAILOR.dev banner" width="100%"/>
</p>

<!-- ===================== TYPING ANIMATION ===================== -->
<p align="center">
  <a href="https://github.com/<your-username>/RESUME_TAILOR.dev">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=8B7CFF&center=true&vCenter=true&width=760&lines=Stop+sending+the+same+resume+to+every+job.;Evaluate+job+offers+against+your+CV.;Generate+an+ATS-ready+resume+per+listing.;Track+every+application+in+one+place.;The+AI+assists.+You+decide." alt="Typing animation"/>
  </a>
</p>

<!-- ===================== BADGES ===================== -->
<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright"/>
  <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go"/>
  <img src="https://img.shields.io/badge/AI_Powered-8B7CFF?style=for-the-badge&logo=anthropic&logoColor=white" alt="AI Powered"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Human_in_the_Loop-Always-success?style=flat-square" alt="Human in the loop"/>
  <img src="https://img.shields.io/badge/Auto_Submit-Never-critical?style=flat-square" alt="Never auto-submits"/>
  <img src="https://img.shields.io/badge/Runs-Locally-informational?style=flat-square" alt="Runs locally"/>
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs welcome"/>
</p>

<p align="center">
  <b>Created &amp; maintained by Muzammil</b>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-faq">FAQ</a> •
  <a href="#-about-the-author">Author</a>
</p>

---

## ✨ What Is This?

**RESUME_TAILOR.dev** turns any AI coding CLI into a full job-search command center. Instead of tracking applications in a spreadsheet and rewriting your CV by hand for every posting, you get an AI-powered pipeline that does the heavy lifting, while **you** keep the final say.

| 😩 Without RESUME_TAILOR.dev | 🚀 With RESUME_TAILOR.dev |
| --- | --- |
| One generic resume sent everywhere | A tailored, ATS-optimized CV for every job |
| Guessing which jobs are worth applying to | A 1-5 fit score with a structured report |
| Messy spreadsheet of applications | One tracker with dedup and integrity checks |
| Checking career pages by hand | Automatic portal scanning |
| Applying and hoping | Company research + the right person to contact |

> [!IMPORTANT]
> **This is NOT a spray-and-pray tool.** RESUME_TAILOR.dev is a *filter*. It helps you find the few offers worth your time out of hundreds, and it recommends against applying to anything scoring below **4.0 / 5**. Always review before submitting.

> [!TIP]
> **The first evaluations won't be great.** The system doesn't know you yet. Feed it context: your CV, projects, proof points, preferences, strengths and dealbreakers. The more you teach it, the sharper it gets.

---

## 🎯 Features

<table>
  <tr>
    <td width="50%" valign="top">

### 🤖 Auto-Pipeline
Paste a job URL and get a full evaluation, a tailored PDF and a tracker entry in one go.

### 📊 A-H Evaluation
Role summary, CV match, level strategy, compensation research, personalization, interview prep (STAR+R) and a **posting-legitimacy check** that flags scams and ghost jobs.

### 📄 ATS PDF Generation
Keyword-injected CVs rendered from an HTML template via Playwright.

### ✉️ Cover Letters &amp; Email Drafts
Research-backed cover letters (A4 PDF) and recruiter / referral / cold emails with a subject line and attachment checklist. **Draft-only. Nothing is ever sent for you.**

    </td>
    <td width="50%" valign="top">

### 🔍 Portal Scanner
Pre-configured companies plus custom queries across Greenhouse, Ashby, Lever and more.

### ⚡ Batch Processing
Evaluate many offers in parallel with headless CLI workers.

### 🖥️ Dashboard TUI
A terminal UI to browse, filter and sort your whole pipeline.

### 🎤 Interview Suite
Story bank (STAR+Reflection), time-blocked prep plans, practice sessions with feedback and post-interview debriefs.

### 💰 Negotiation Scripts
Salary negotiation frameworks and counter-offer leverage.

### 🛡️ Pipeline Integrity
Automated merge, dedup, status normalization and health checks.

    </td>
  </tr>
</table>

> [!NOTE]
> **Human-in-the-Loop by design.** The AI evaluates and recommends. You decide and act. The system never submits an application.

---

## 🧠 How It Works

```mermaid
flowchart LR
    A([📋 Paste job URL<br/>or description]) --> B[🧭 Archetype<br/>Detection]
    B --> C[📊 A-H Evaluation<br/>reads cv.md]
    C --> D{Fit score}
    D -->|≥ 4.0| E[📝 Report .md]
    D -->|≥ 4.0| F[📄 Tailored PDF]
    D -->|≥ 4.0| G[📌 Tracker entry]
    D -->|< 4.0| H[🚫 Skip &<br/>save your time]
    E --> I([🙋 You review<br/>and decide])
    F --> I
    G --> I

    style A fill:#8B7CFF,stroke:#6C63FF,color:#fff
    style I fill:#2EAD33,stroke:#1f7a24,color:#fff
    style H fill:#e5534b,stroke:#b3342d,color:#fff
```

---

## 🚀 Quick Start

```bash
# 1️⃣  Clone and install
git clone https://github.com/<your-username>/RESUME_TAILOR.dev.git
cd RESUME_TAILOR.dev && npm install
npx playwright install chromium   # only needed for PDF generation

# 2️⃣  Check setup
npm run doctor

# 3️⃣  Configure
cp config/profile.example.yml config/profile.yml   # edit with your details
cp templates/portals.example.yml portals.yml        # customize companies

# 4️⃣  Add your CV
#     Create cv.md in the project root with your CV in markdown

# 5️⃣  Open your AI CLI in this directory
claude   # or codex / opencode / qwen / agy / grok

# 6️⃣  Start using
#     Paste a job URL or JD text to trigger the auto-pipeline
```

On first launch, the system walks you through setup (your CV, profile and target roles) just by chatting.

> [!TIP]
> The system is designed to be customized by your AI CLI itself. Modes, archetypes, scoring weights and scripts: just ask it to change them.

---

## 🎮 Usage

<details open>
<summary><b>Slash commands</b> (for CLIs that register them)</summary>

<br/>

| Command | What it does |
| --- | --- |
| `/career-ops` | Show all available commands |
| `/career-ops {paste a JD}` | Full auto-pipeline (evaluate + PDF + tracker) |
| `/career-ops scan` | Scan portals for new offers |
| `/career-ops pdf` | Generate an ATS-optimized CV |
| `/career-ops cover` | Cover letter generator |
| `/career-ops email` | Application email draft (draft-only) |
| `/career-ops batch` | Batch evaluate multiple offers |
| `/career-ops tracker` | View application status |
| `/career-ops pipeline` | Process pending URLs |
| `/career-ops contacto` | Find hiring manager / recruiter + draft a LinkedIn message |
| `/career-ops deep` | Structured company research prompt |

</details>

> In Codex, slash commands are not guaranteed. Ask in plain language instead, for example: *"Run the scan mode and summarize new matches."*

---

## 🧰 Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,go,js,md,yaml,git,github&theme=dark" alt="Tech stack icons"/>
</p>

| Layer | Technology |
| --- | --- |
| 🤖 **Agent** | AI coding CLI with shared skills and modes |
| 📄 **PDF** | Playwright + HTML template |
| 🔍 **Scanner** | Playwright + Greenhouse API + web search |
| 🖥️ **Dashboard** | Go + Bubble Tea + Lipgloss |
| 🗄️ **Data** | Markdown tables + YAML config + TSV batch files |

---

## 📁 Project Structure

<details>
<summary><b>Click to expand</b></summary>

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

</details>

---

## ❓ FAQ

<details>
<summary><b>Does RESUME_TAILOR.dev apply to jobs for me?</b></summary>

No. It evaluates, ranks and drafts. You review and decide. It never submits, sends or clicks anything on your behalf.

</details>

<details>
<summary><b>Which AI CLIs does it work with?</b></summary>

Any major AI coding CLI that supports agent skills: Claude Code, Codex, Antigravity, OpenCode, Grok, Qwen and others.

</details>

<details>
<summary><b>Can I run it cheaply?</b></summary>

Yes. It can run on free-tier or local models. See the `docs/` folder for budget setup notes.

</details>

---

## 👨‍💻 About the Author

<table>
  <tr>
    <td>

Hi, I'm **Muzammil** 👋

A Computer Science graduate from **Sir Syed University of Engineering &amp; Technology (SSUET), Karachi**. I work across mobile development, AI integration and data analytics. I built RESUME_TAILOR.dev to make tailoring a CV to every job faster and smarter.

<p>
  <img src="https://img.shields.io/badge/Flutter-02569B?style=flat-square&logo=flutter&logoColor=white" alt="Flutter"/>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white" alt="LangChain"/>
  <img src="https://img.shields.io/badge/Gemini_API-8E75B2?style=flat-square&logo=googlegemini&logoColor=white" alt="Gemini API"/>
  <img src="https://img.shields.io/badge/Scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white" alt="Scikit-learn"/>
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=flat-square&logo=tensorflow&logoColor=white" alt="TensorFlow"/>
</p>

    </td>
  </tr>
</table>

### 🤝 Let's Connect

<p align="center">
  <a href="https://github.com/<your-username>"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/></a>
  <a href="https://linkedin.com/in/<your-handle>"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/></a>
  <a href="mailto:<your-email>"><img src="https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"/></a>
</p>

---

## ⚠️ Disclaimer

**RESUME_TAILOR.dev is a local, open-source tool, NOT a hosted service.** By using it, you acknowledge:

1. **You control your data.** Your CV and personal data stay on your machine and are sent directly to the AI provider you choose. No data is collected or stored by this project.
2. **You control the AI.** The default prompts instruct the AI not to auto-submit applications, but AI models can behave unpredictably. **Always review AI-generated content for accuracy before submitting.**
3. **You comply with third-party ToS.** Use this tool in accordance with the Terms of Service of the career portals you interact with. Do not use it to spam employers or overwhelm ATS systems.
4. **No guarantees.** Evaluations are recommendations, not truth. AI models may hallucinate skills or experience. The author is not liable for employment outcomes.

---

## 📜 License &amp; Acknowledgements

Released under the [MIT License](LICENSE). RESUME_TAILOR.dev is built on top of the open-source [career-ops](https://github.com/santifer/career-ops) project by Santiago Fernández de Valderrama Aparicio (MIT). The original copyright and license notice are retained in the `LICENSE` file, as the MIT License requires.

<p align="center">
  <b>⭐ If this helps your job search, give the repo a star! ⭐</b>
</p>

<!-- ===================== FOOTER WAVE ===================== -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" alt="footer wave" width="100%"/>
</p>
