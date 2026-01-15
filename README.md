PainSense
AI-Powered Real-Time Pain Assessment System

Bridging the Clinical Gap in Non-Verbal Patient Care
Developed for the VIT Bhopal × Johns Hopkins University Health Hackathon 2026

📋 Executive Summary:
PainSense is an AI-driven digital health platform designed to provide real-time, objective pain assessment for patients who are unable to communicate verbally. By combining computer vision, clinically validated pain scales, and continuous monitoring, PainSense enables clinicians to make faster, data-driven decisions and improve patient outcomes. The system is built with a modular, privacy-first architecture to support clinical environments such as ICUs, neonatal wards, and post-operative care units.

🏥 The Clinical Challenge:
Pain is widely regarded as the “5th Vital Sign”, yet current assessment methods depend heavily on patient self-reporting (e.g., 0–10 Numeric Rating Scale). This approach fails for:
ICU & Sedated Patients – unable to communicate due to medical intervention
Neonatal & Pediatric Patients – limited or absent verbal expression
Cognitively Impaired Patients – dementia, neurological disorders, or altered consciousness
Inadequate pain management can result in physiological stress, delayed healing, and long-term complications.

💡 The PainSense Solution:
PainSense transforms pain assessment into a continuous physiological signal rather than a sporadic manual observation.

Core Capabilities- 
Automated Facial Expression Analysis- Detects pain-associated micro-expressions and Facial Action Units (AUs) such as brow furrowing and eye squeezing.
Clinical Scale Mapping- Expression data is mapped to validated tools, including:
CPOT (Critical-Care Pain Observation Tool)
Primal Face Pain Scale
Contextual Correlation
Designed to correlate pain trends with vital signs (HR, SpO₂, BP) for a holistic patient view.


🛠️ System Architecture:
PainSense follows a scalable, modular architecture suitable for collaborative development and future clinical deployment.
1️⃣ AI & Computer Vision (Core Engine)
Real-time facial landmark detection (68+ landmarks)
Action Unit (AU) estimation
Edge-first inference for low latency and patient privacy

2️⃣ Clinical Frontend (Dashboard)
Built using React + Vite
Designed for nurse stations and bedside monitors
Real-time pain visualization and historical trends
Alert-ready UI for sudden pain spikes

3️⃣ Backend Services (Planned)
Secure data orchestration between AI and frontend
Session-based patient monitoring
Future-ready for HL7 / FHIR EHR integration

📁 Repository Structure
PainSense/
│
├── frontend/        # React + Vite frontend application
├── backend/         # Backend services (API, auth, database) – in progress
├── ai/              # AI/ML models and inference logic – in progress
├── shared/          # Shared types and utilities
│   └── types.ts
│
├── README.md
└── .gitignore

⚙️ Running the Project (Frontend)
   🔹 Prerequisites
       Node.js (v18+ recommended)
       npm
       Git

  🔹 Setup Instructions:
      git clone https://github.com/ManjiriKench/PainSense.git
      cd PainSense/frontend
      npm install
      npm run dev

Development Workflow & Branching Strategy:
This project follows a professional Git workflow.
Main Branches
main → Stable, demo-ready code
dev → Active integration branch

Feature Branches
frontend-feature-name
backend-feature-name
ai-feature-name

Contribution Rules
All work must be done in feature branches
Pull Requests are merged into the dev
Only the team lead merges dev → main

👥 Team Responsibilities:
Team Lead & Frontend: Manjiri Kench, Adityaraj Bagwan
Backend Development: Harsh Nagre, Priyanka Bankar
AI / ML Development: Anish Pathak, Khushi Thakkar

🚀 Key Features:
Touchless & non-invasive pain monitoring
Continuous pain history tracking
Privacy-first design (edge processing & visualization safeguards)
Designed for ICU, neonatal, and post-operative care
Scalable for multi-patient monitoring

📈 Impact & Future Roadmap:
PainSense aims to standardize objective pain assessment, especially for vulnerable populations.
Planned Enhancements
Multimodal fusion (facial + vocal + motion cues)
Predictive pain analytics
Centralized ICU / ward monitoring dashboard
Cloud & on-prem deployment options

🤝 Contributing- Contributions are welcome via feature branches and pull requests.
Please follow the project’s branching strategy and commit conventions.

Contributions are welcome via feature branches and pull requests.
Please follow the project’s branching strategy and commit conventions.
