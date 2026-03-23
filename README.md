# Resume ATS Checker 🚀

A premium, local-first Applicant Tracking System (ATS) analyzer built with **React** and **FastAPI**. This tool helps developers and job seekers optimize their resumes by matching them against specific job roles and custom Job Descriptions (JDs) using a robust keyword-matching engine.

![Hero Image](frontend/src/assets/hero.png)

## ✨ Features

- **Immersive UI/UX**: A dark-themed, glassmorphic design featuring smooth animations and a premium look.
- **Local-First Architecture**: No complex database setup required! Uses a JSON-based local storage system for lightning-fast results and maximum privacy.
- **Job Description Extraction**: Upload a JD file (PDF/Docx) or paste text to automatically extract and match key requirements.
- **Comprehensive Scoring**:
  - **Skills Match**: Compares your resume against thousands of technical skills in our taxonomy.
  - **Project Relevance**: Evaluates your projects based on the targeted role.
  - **Format Check**: Scans for standard sections, bullet points, and contact information.
- **Actionable Feedback**: Provides high-priority suggestions to improve your ATS score instantly.

## 🛠️ Tech Stack

- **Frontend**: Vite, React, Tailwind CSS, Lucide React, Framer Motion, Shadcn/UI
- **Backend**: FastAPI, Python, PDFPlumber, Docx-Python
- **Storage**: Local JSON Store

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+

### 1. Clone the repository
```bash
git clone https://github.com/Dhruvan05/resume-ats-checker.git
cd resume-ats-checker
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
*The backend will run on `http://localhost:8000`*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`*

## 📁 Repository Structure

```text
├── backend/
│   ├── data/             # Local data storage (uploads, results, taxonomy)
│   ├── routes/           # API endpoints (analyze, upload, results)
│   ├── services/         # Business logic (parsers, scorers, extractors)
│   └── main.py           # Backend entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── context/      # React state management
│   │   └── pages/        # Dashboard and Upload pages
│   └── tailwind.config.js
└── README.md
```

## 🔒 Privacy & Security

This tool is designed to be **Privacy-First**. Your resumes and Job Descriptions are stored locally on your machine in the `backend/data/` directory and are never uploaded to any third-party cloud service or database (unless you explicitly configure an AI provider).

## 📄 License

MIT License - feel free to use and modify for your own personal projects!
