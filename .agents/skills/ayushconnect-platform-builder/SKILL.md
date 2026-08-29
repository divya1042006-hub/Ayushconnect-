---
name: ayushconnect-platform-builder
description: >-
  Builds, enhances, and validates full-stack AYUSH Academia-Industry Collaboration & Career Portals.
  Includes placement management pipelines, faculty development spaces, AI skill gap recommendations,
  QR-coded HSSC certificate issuance, multi-dimensional application submission analytics,
  live readiness aggregate scoring, student application status tracking dashboards, and program-specific AYUSH degree filters (BAMS, BHMS, BNYS, BUMS, BSMS).
---

# AyushConnect Platform Builder Skill

## Overview
This skill provides complete patterns, components, and API routes for constructing and scaling the **AyushConnect Academia-Industry Collaboration Portal**. It covers end-to-end features for students, mentors, professors, recruiters, and academic institutions.

---

## Capabilities & Architecture

### 1. Smart Recommendations & External Provider Links
- **AI Skill Diagnostic Engine**: Calculates skill gaps by comparing candidate assessment scores against HSSC National Occupational Standards (NOS).
- **Live Readiness Aggregate Scoring**: Computes dynamic readiness scores (`Math.min(98, 68 + completedCourses * 8 + enrolled * 3)`) that update live as student progress changes.
- **Curated Course Linking**: Connects recommended modules directly to verified external LMS providers (e.g., SWAYAM / NPTEL, Ministry of Ayush e-Learning, MDNIY, BHU IMS, Coursera) with working outbound enrollment links (`Platform ↗`).
- **Filter Presets & State Persistence**: Allows users and mentors to save and bookmark active filter criteria.

### 2. Program-Specific Opportunity Discovery
- **AYUSH Degree Filters**: Includes degree-level filters for `BAMS (Ayurveda)`, `BHMS (Homeopathy)`, `BNYS (Naturopathy & Yoga)`, `BUMS (Unani)`, and `BSMS (Siddha)`.

### 3. Application Submission Confirmation & Status Tracker
- **Real-Time Application Confirmations**: Triggers confirmation toasts/notifications upon internship or job application.
- **Student Status Dashboard**: Dedicated application status tracker modal displaying application IDs, submission dates, real-time pipeline stages (`Applied`, `Under Review`, `Shortlisted`, `Interview Scheduled`, `Selected`), and HR reviewer notes.

### 4. Mentor Review & Verified Certificate Issuance
- **Student Progress Monitoring**: Tracks course progress percentages, completed NOS modules, and HSSC job readiness scores.
- **Clinical Evaluation Notes**: Enables faculty to record qualitative assessment feedback.
- **One-Click Certificate Sign-Off**: Issues verifiable HSSC NOS certificates (`/api/mentor/issue-certificate`) equipped with dynamic QR codes linking to public validation endpoints (`/verify-certificate?id=...`) and direct LinkedIn sharing buttons.

### 5. Faculty & Professor Space
- **Faculty Internships**: Senior clinical & R&D fellowships at Dabur, Kairali, AIIMS, and WHO India.
- **Industrial Training**: Immersive tracks in WHO-GMP, Biotech, Tele-Ayurveda, and Nutraceuticals.
- **Faculty Development Programs (FDPs)**: Accredited training sponsored by Ministry of Ayush, CSIR, ICMR, and NCISM.

### 6. Placement Management (Hiring Phase)
- **Job Postings Board**: Openings categorized by strict qualification pack requirements.
- **Automated Shortlisting**: AI match scoring ranking candidates by NOS alignment.
- **Recruitment Tracking & HR Controls**: Stage transitions (Applied -> Shortlisted -> Interviewing -> Selected -> Rejected) with multi-select bulk update action bars.

### 7. Collaboration & Analytics (Partnership Phase)
- **Industry-College Ties**: Joint research, consultancy projects, guest lectures, hackathons, and mentorship programs with persistent milestone tracking.
- **Application Submission Analytics**: Visual dashboards categorizing submissions by:
  1. Qualification Program (Panchakarma Paricharaka, Ayurvedic Pharmacist, Tele-Ayurveda, etc.)
  2. Hiring Organization (Patanjali, Kairali, Dabur, Practo, AIIMS)
  3. Target Skill Gap Addressed

---

## Quick Start Commands

### Backend Verification
```bash
# Start server process
cd server && node index.js

# Test Certificate Verification API
curl http://localhost:5000/api/certificates/verify/HSSC-NOS-2026-8842

# Test Application Analytics API
curl http://localhost:5000/api/analytics/applications
```

### Frontend Launch
```bash
cd client && npm run dev
```

---

## Key Files Reference
- [`server/routes/api.js`](file:///c:/Users/Divya/OneDrive/Desktop/sih2026/server/routes/api.js): Full REST API suite (Certificates, HR Bulk Updates, Proposals, Mentor Signoff, Application Analytics).
- [`client/src/components/views/SmartRecommendationsView.jsx`](file:///c:/Users/Divya/OneDrive/Desktop/sih2026/client/src/components/views/SmartRecommendationsView.jsx): AI skill gap recommendation engine, live readiness aggregates, program degree filters (BAMS/BHMS/BNYS/BUMS/BSMS), application status tracker modal, QR Code Modal & LinkedIn sharing button.
- [`client/src/components/views/FacultyDashboardView.jsx`](file:///c:/Users/Divya/OneDrive/Desktop/sih2026/client/src/components/views/FacultyDashboardView.jsx): Mentor student review, clinical evaluation notes & certificate issuance controls.
- [`client/src/components/views/CollaborationAnalyticsView.jsx`](file:///c:/Users/Divya/OneDrive/Desktop/sih2026/client/src/components/views/CollaborationAnalyticsView.jsx): Application submission analytics dashboard by program, organization, and skill gap.
- [`client/src/components/views/PlacementManagementView.jsx`](file:///c:/Users/Divya/OneDrive/Desktop/sih2026/client/src/components/views/PlacementManagementView.jsx): Placement management Kanban pipeline and candidate shortlisting.
