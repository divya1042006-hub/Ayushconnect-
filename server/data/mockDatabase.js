export const mockDatabase = {
  users: {
    student: {
      id: "std-001",
      name: "Dr. Ananya Sharma",
      email: "ananya.sharma@ayush.edu.in",
      role: "student",
      degree: "BAMS 4th Year",
      institution: "National Institute of Ayurveda (NIA), Jaipur",
      regNo: "AYU-2023-8842",
      xp: 1420,
      level: 4,
      targetRole: "qp-panchakarma",
      targetRoleTitle: "Panchakarma Paricharaka",
      readinessScore: 78,
      skills: [
        { name: "Abhyanga & Swedana Technique", score: 85, target: 90, status: "strong" },
        { name: "Kati/Janu Basti Setup & Monitoring", score: 75, target: 85, status: "developing" },
        { name: "Sterilization & Herbal Dravya Prep", score: 90, target: 90, status: "strong" },
        { name: "Patient Vitals & Therapy Logging", score: 80, target: 85, status: "developing" },
        { name: "Ayurvedic Pharmacology Basics", score: 55, target: 80, status: "gap" }
      ],
      certifications: [
        { title: "HSSC Panchakarma Attendant Certificate", issuer: "HSSC Ayush Sub-SSC", year: 2025, verified: true },
        { title: "Ayush First-Aid & Emergency Response", issuer: "Red Cross & Min of Ayush", year: 2024, verified: true }
      ],
      missingCertifications: [
        "Advanced Marma Point Therapy (Level 2)",
        "Standardized Herbal Kashaya Decoction Protocol"
      ]
    },
    recruiter: {
      id: "rec-101",
      name: "Vikramaditya Roy",
      title: "Head of Clinical Talent",
      company: "Patanjali Wellness & Herbal Research Labs",
      email: "v.roy@patanjaliwellness.com",
      role: "recruiter",
      openPositions: 8,
      pipelineCount: 34,
      interviewsToday: 4,
      offersSent: 12
    },
    faculty: {
      id: "fac-201",
      name: "Prof. (Dr.) Rajeshwar Vaidya",
      department: "Dept of Shalya Tantra",
      institution: "All India Institute of Ayurveda (AIIA), New Delhi",
      role: "faculty",
      researchArea: "Kshara Sutra Thread Standardization & Wound Healing",
      fdpsCompleted: 6,
      collaborationsActive: 3
    },
    institution: {
      id: "inst-301",
      name: "State Ayurvedic College & Hospital, Lucknow",
      code: "AYU-INST-UP04",
      role: "institution",
      totalStudents: 340,
      activeBatch: "2022-2027",
      placementRate: "84.2%",
      topSkillGap: "Ayurvedic Pharmacology & FSSAI Ayush Standards",
      ncismAlignment: "92%"
    }
  },
  jobs: [
    {
      id: "job-101",
      title: "Senior Panchakarma Clinical Intern",
      company: "Patanjali Wellness Hub",
      location: "Haridwar, Uttarakhand (On-site)",
      stipend: "₹18,000 / month",
      duration: "6 Months",
      type: "Internship",
      sector: "Ayurveda",
      requiredSkills: [
        "Abhyanga & Swedana Technique",
        "Kati/Janu Basti Setup & Monitoring",
        "Sterilization & Herbal Dravya Prep",
        "Patient Vitals & Therapy Logging"
      ],
      description: "Hands-on clinical internship assisting senior Vaidyas in high-volume Panchakarma therapy centers.",
      verified: true,
      postedDate: "2 days ago",
      targetPack: "qp-panchakarma"
    },
    {
      id: "job-102",
      title: "Yoga & Wellness Protocol Specialist",
      company: "Himalaya Wellness & Global Retreats",
      location: "Bengaluru, Karnataka (Hybrid)",
      stipend: "₹22,000 / month",
      duration: "3 Months",
      type: "Internship",
      sector: "Yoga & Naturopathy",
      requiredSkills: [
        "Asana & Alignment Precision",
        "Pranayama & Shatkarma Protocols",
        "Client Assessment & Wellness Planning"
      ],
      description: "Formulate personalized daily yoga therapy modules and corporate wellness retreats.",
      verified: true,
      postedDate: "1 day ago",
      targetPack: "qp-yoga"
    },
    {
      id: "job-103",
      title: "Shalya Tantra & Kshara Karma Assistant",
      company: "Dabur Research Foundation & Ayurvedic Hospitals",
      location: "Ghaziabad, UP (On-site)",
      stipend: "₹25,000 / month",
      duration: "6 Months",
      type: "Placement Opportunity",
      sector: "Ayurvedic Surgery",
      requiredSkills: [
        "Kshara Sutra Preparation & Standardization",
        "OT Sterilization & Shalya Protocols",
        "Post-Operative Wound Care (Ayurvedic)"
      ],
      description: "Assisting surgical Vaidyas in ano-rectal Kshara Sutra procedures and standardized wound dressings.",
      verified: true,
      postedDate: "3 days ago",
      targetPack: "qp-kshara"
    },
    {
      id: "job-104",
      title: "Ayush Ahara & Nutraceutical Formulation Associate",
      company: "Kottakkal Arya Vaidya Sala",
      location: "Kottakkal, Kerala",
      stipend: "₹20,000 / month",
      duration: "4 Months",
      type: "Internship",
      sector: "Nutraceuticals",
      requiredSkills: [
        "Pathya-Apathya Formulation",
        "Prakriti-Based Diet Planning",
        "FSSAI Ayush Food Regulations"
      ],
      description: "Develop clinical Pathya-Apathya dietary charts and quality test herbal nutritional supplements.",
      verified: true,
      postedDate: "Just now",
      targetPack: "qp-ahara"
    }
  ],
  applications: [
    {
      id: "app-501",
      jobId: "job-101",
      studentId: "std-001",
      candidateName: "Dr. Ananya Sharma",
      roleApplied: "Senior Panchakarma Clinical Intern",
      company: "Patanjali Wellness Hub",
      appliedDate: "2026-08-25",
      matchScore: 88,
      status: "Shortlisted",
      stage: "Screening",
      matchedSkills: [
        "Abhyanga & Swedana Technique",
        "Kati/Janu Basti Setup & Monitoring",
        "Sterilization & Herbal Dravya Prep"
      ],
      gapSkills: ["Ayurvedic Pharmacology Basics"],
      notes: "Strong clinical background from NIA Jaipur. Certified in emergency response."
    },
    {
      id: "app-502",
      jobId: "job-101",
      studentId: "std-002",
      candidateName: "Vaidya Rohan Deshmukh",
      roleApplied: "Senior Panchakarma Clinical Intern",
      company: "Patanjali Wellness Hub",
      appliedDate: "2026-08-26",
      matchScore: 92,
      status: "Under Review",
      stage: "Applied",
      matchedSkills: [
        "Abhyanga & Swedana Technique",
        "Kati/Janu Basti Setup & Monitoring",
        "Sterilization & Herbal Dravya Prep",
        "Patient Vitals & Therapy Logging"
      ],
      gapSkills: [],
      notes: "Exceptional practical experience in Basti monitoring."
    },
    {
      id: "app-503",
      jobId: "job-101",
      studentId: "std-003",
      candidateName: "Priya Nair",
      roleApplied: "Senior Panchakarma Clinical Intern",
      company: "Patanjali Wellness Hub",
      appliedDate: "2026-08-24",
      matchScore: 64,
      status: "Interview",
      stage: "Interview",
      matchedSkills: [
        "Abhyanga & Swedana Technique",
        "Sterilization & Herbal Dravya Prep"
      ],
      gapSkills: ["Kati/Janu Basti Setup & Monitoring"],
      notes: "Interview scheduled for tomorrow at 11:30 AM."
    },
    {
      id: "app-504",
      jobId: "job-101",
      studentId: "std-004",
      candidateName: "Siddharth Joshi",
      roleApplied: "Senior Panchakarma Clinical Intern",
      company: "Patanjali Wellness Hub",
      appliedDate: "2026-08-27",
      matchScore: 95,
      status: "Offered",
      stage: "Offered",
      matchedSkills: [
        "Abhyanga & Swedana Technique",
        "Kati/Janu Basti Setup & Monitoring",
        "Sterilization & Herbal Dravya Prep",
        "Patient Vitals & Therapy Logging",
        "Ayurvedic Pharmacology Basics"
      ],
      gapSkills: [],
      notes: "Offer letter generated. Awaiting candidate confirmation."
    }
  ],
  fdps: [
    {
      id: "fdp-301",
      title: "Advanced Clinical Standardization in Ayush Pharmacology",
      organizer: "Ministry of Ayush & CSIR-CIMAP",
      format: "Residential (5 Days)",
      location: "Lucknow, Uttar Pradesh",
      dates: "15 Sep - 20 Sep 2026",
      grantStipend: "₹15,000 Grant",
      eligibility: "Ayush Faculty & Senior Researchers",
      seatsLeft: 12,
      applied: false
    },
    {
      id: "fdp-302",
      title: "NCISM Outcome-Based Curriculum & HSSC Skill Alignment",
      organizer: "National Commission for Indian System of Medicine (NCISM)",
      format: "Online Hybrid (3 Weeks)",
      location: "Virtual & Regional Centers",
      dates: "01 Oct - 21 Oct 2026",
      grantStipend: "Certifying FDP",
      eligibility: "Department Heads & Principals",
      seatsLeft: 45,
      applied: true
    },
    {
      id: "fdp-303",
      title: "Standardizing Kshara Sutra Therapy for Global Clinical Trials",
      organizer: "AIIA New Delhi & Dabur Research Foundation",
      format: "Residential Workshop",
      location: "New Delhi",
      dates: "10 Nov - 14 Nov 2026",
      grantStipend: "Full Sponsorship",
      eligibility: "Shalya Tantra Faculty",
      seatsLeft: 8,
      applied: false
    }
  ],
  institutionMetrics: {
    batchName: "BAMS 2022-2027 (Final Year)",
    totalEnrolled: 120,
    assessedStudents: 114,
    readinessAvg: 81.4,
    skillGaps: [
      { skill: "Ayurvedic Pharmacology Basics", weaknessPct: 42, severity: "High" },
      { skill: "Kati/Janu Basti Monitoring", weaknessPct: 28, severity: "Medium" },
      { skill: "FSSAI Ayush Standards", weaknessPct: 35, severity: "High" },
      { skill: "OT Sterilization", weaknessPct: 14, severity: "Low" }
    ],
    funnel: [
      { stage: "Registered", count: 120, pct: 100 },
      { stage: "Skill Assessed", count: 114, pct: 95 },
      { stage: "Shortlisted", count: 88, pct: 73 },
      { stage: "Interviewed", count: 64, pct: 53 },
      { stage: "Placed / Interning", count: 52, pct: 43 }
    ]
  }
};
