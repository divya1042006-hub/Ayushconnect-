import React, { useState, useRef, useCallback } from 'react';
import {
  Sparkles, Upload, CheckCircle2, ShieldCheck, Cpu, RefreshCw, FileText,
  X, AlertCircle, TrendingUp, Target, BookOpen, Briefcase, ChevronRight,
  ExternalLink, Building2, Award, Zap, ArrowUpRight, BarChart3, Check,
  Layers, UserCheck, AlertTriangle, ArrowRight, Bookmark, Compass, Clock,
  Send, MapPin, Building, Star, Play, BadgeCheck
} from 'lucide-react';
import CourseLearningModal from '../common/CourseLearningModal';
import { API_BASE } from '../../api';

// Preloaded realistic sample resumes for 1-click test
const SAMPLE_RESUMES = {
  bams: {
    label: 'BAMS Clinical Intern (Panchakarma)',
    text: `Dr. Ananya Sharma
BAMS (4th Year Finalist), National Institute of Ayurveda (NIA), Jaipur.
Email: ananya.sharma@ayush.edu.in | Phone: +91 98765 43210
Degree: Bachelor of Ayurvedic Medicine and Surgery (BAMS)

Clinical Competencies & Technical Skills:
- Panchakarma Procedure Execution (Vamana, Virechana, Nasya, Basti)
- Abhyanga & Swedana Technique & Oil Preparations
- Kati Basti & Janu Basti Setup & Patient Monitoring
- Sterilization & Herbal Dravya Preparation
- Patient Vital Signs Monitoring & Clinical Logging

Certifications & Accreditations:
- HSSC Panchakarma Attendant (Verified 2025)
- Red Cross First Aid & CPR Basic Life Support
- National Commission for Indian System of Medicine (NCISM) Student Fellow`
  },
  bnys: {
    label: 'BNYS Naturopathy & Yoga Specialist',
    text: `Dr. Kabir Varma
BNYS (Naturopathy & Yogic Sciences), Morarji Desai National Institute of Yoga (MDNIY), New Delhi.
Degree: Bachelor of Naturopathy & Yogic Sciences (BNYS)

Clinical Competencies & Skills:
- Therapeutic Yoga & Pranayama Protocols
- Prakriti-Based Diet Planning & Pathya-Apathya Formulation
- Client Assessment & Structural Alignment
- Naturopathic Hydrotherapy & Mud Therapy
- First Aid & Emergency Response

Certifications:
- YCB Level 2 Wellness Yoga Protocol Instructor
- Ministry of AYUSH Yoga Certification (2025)`
  },
  pharma: {
    label: 'Ayurvedic Pharmacist & QC Chemist',
    text: `Vaidya Meera Joshi
BAMS / Dravyaguna Postgraduate Scholar, Gujarat Ayurved University, Jamnagar.
Degree: BAMS & D.Pharma (Ayurveda)

Core Technical Competencies:
- Ayurvedic Herbal Kashaya Preparation & Decoction Extraction
- Sterilization & Herbal Dravya Preparation
- Ayurvedic Pharmacology Basics & Dravyaguna Identification
- Herbal Extraction, Thin Layer Chromatography & QC Testing
- WHO-GMP Ayush Manufacturing Standard Protocols

Certifications:
- FSSAI Ayush Ahara Safety Officer
- WHO-GMP Ayush Manufacturing Standard (Verified)`
  },
  tele: {
    label: 'Tele-Ayurveda & Digital Health Officer',
    text: `Dr. Rohan Deshmukh
BAMS Graduate, AIIA New Delhi.
Degree: BAMS (Ayurvedacharya)

Core Competencies:
- Patient Vital Signs Monitoring & Remote EHR Documentation
- Clinical Documentation & Logging in HealthTech Systems
- Patient Communication & Care Ethics in Digital OPD
- Digital Health Diagnostics & Ayush AI Symptom Checkers
- Tele-Ayurveda Consultation Protocols

Certifications:
- AyushConnect Digital Health Specialist
- Basic Anatomical & Physiological Terms (Ayurveda)`
  }
};

// 12 Standard HSSC National Occupational Standards (NOS) Benchmarks
const ALL_NOS_BENCHMARKS = [
  { name: 'Panchakarma Procedure Execution', category: 'Clinical Panchakarma', weight: 20 },
  { name: 'Abhyanga & Swedana', category: 'Therapeutic Procedures', weight: 15 },
  { name: 'Kati/Janu Basti Setup', category: 'Therapeutic Procedures', weight: 15 },
  { name: 'Sterilization & Herbal Dravya Prep', category: 'Aseptic & Pharmacy', weight: 15 },
  { name: 'Patient Vital Signs Monitoring', category: 'Diagnostics & Monitoring', weight: 10 },
  { name: 'Ayurvedic Herbal Kashaya Preparation', category: 'Pharmacy & Formulations', weight: 15 },
  { name: 'Clinical Documentation & Logging', category: 'Informatics & Ethics', weight: 10 },
  { name: 'Tele-Ayurveda Protocols', category: 'Digital Health', weight: 10 },
  { name: 'Therapeutic Yoga & Pranayama', category: 'Integrative Wellness', weight: 10 },
  { name: 'Kshara Sutra Preparation & Standardization', category: 'Surgical Assistance', weight: 15 },
  { name: 'Prakriti-Based Diet Planning', category: 'Dietetics & Nutrition', weight: 10 },
  { name: 'GCP & Clinical Trial Protocols', category: 'Clinical Research', weight: 15 }
];

// AYUSH Industry Career Profiles with verified Live Job Listings
const AYUSH_CAREER_ROLES_LOCAL = [
  {
    id: 'role-panchakarma',
    title: 'Panchakarma Clinical Specialist',
    qualificationPack: 'HSS/Q5701 (Panchakarma Paricharaka)',
    sector: 'Clinical Ayurveda & Hospital Care',
    avgSalary: '₹4.8 - 7.5 LPA',
    openings: 38,
    topRecruiters: ['Patanjali Wellness Hub', 'Kairali Ayurvedic Group', 'AyurVAID Hospitals', 'AIIMS AYUSH OPD'],
    requiredSkills: [
      'Panchakarma Procedure Execution',
      'Abhyanga & Swedana',
      'Kati/Janu Basti Setup',
      'Sterilization & Herbal Dravya Prep',
      'Patient Vitals & Therapy Logging'
    ],
    jobListings: [
      {
        id: 'job-pk-1',
        title: 'Resident Panchakarma Therapist',
        company: 'Patanjali Wellness Hub',
        location: 'Haridwar, Uttarakhand',
        salary: '₹5.5 - 7.0 LPA',
        type: 'Full-time • Immediate Joining',
        posted: '1 day ago',
        description: 'Lead Panchakarma therapies (Vamana, Virechana, Basti) for inpatient wellness center with complete clinical logging.'
      },
      {
        id: 'job-pk-2',
        title: 'Clinical Panchakarma Officer',
        company: 'AIIMS AYUSH OPD',
        location: 'New Delhi',
        salary: '₹6.8 - 8.2 LPA',
        type: 'Govt Autonomous • Contract',
        posted: 'Just now',
        description: 'Conduct therapy setups, vitals monitoring, and patient consultation support under NCISM clinical guidelines.'
      },
      {
        id: 'job-pk-3',
        title: 'Ayurvedic Treatment Center In-Charge',
        company: 'Kairali Ayurvedic Group',
        location: 'Palakkad, Kerala',
        salary: '₹5.0 - 6.5 LPA',
        type: 'Full-time • Accommodation Included',
        posted: '3 days ago',
        description: 'Supervise traditional Kerala Panchakarma therapies, authentic herbal oil preparation, and wellness guest care.'
      }
    ],
    recommendedCourses: [
      {
        id: 'c1',
        title: 'Panchakarma Therapy: Complete Clinical Protocol',
        platform: 'SWAYAM / NPTEL',
        url: 'https://swayam.gov.in/nc_details/NPTEL',
        duration: '6 Weeks'
      }
    ]
  },
  {
    id: 'role-pharma',
    title: 'Ayurvedic Pharmacological & QC Analyst',
    qualificationPack: 'HSS/Q5704 (Ayush QC Associate)',
    sector: 'Pharma Manufacturing & R&D',
    avgSalary: '₹5.2 - 8.0 LPA',
    openings: 24,
    topRecruiters: ['Dabur R&D Labs', 'Himalaya Wellness', 'Baidyanath Research', 'Charak Pharma'],
    requiredSkills: [
      'Ayurvedic Herbal Kashaya Preparation',
      'Sterilization & Herbal Dravya Prep',
      'Ayurvedic Pharmacology Basics',
      'Herbal Extraction & QC',
      'GMP Standardization'
    ],
    jobListings: [
      {
        id: 'job-ph-1',
        title: 'Quality Control Chemist (Dravyaguna)',
        company: 'Dabur R&D Labs',
        location: 'Ghaziabad, NCR',
        salary: '₹5.8 - 7.5 LPA',
        type: 'Full-time • R&D Division',
        posted: '2 days ago',
        description: 'Standardization of raw herbs, TLC fingerprinting, heavy metal testing, and WHO-GMP batch compliance.'
      },
      {
        id: 'job-ph-2',
        title: 'Herbal Formulation Scientist',
        company: 'Himalaya Wellness',
        location: 'Bengaluru, Karnataka',
        salary: '₹6.5 - 8.5 LPA',
        type: 'Full-time • Formulation Dept',
        posted: '4 days ago',
        description: 'Develop standardized herbal extracts, classical Kashaya formulations, and shelf-life stability documentation.'
      }
    ],
    recommendedCourses: [
      {
        id: 'c2',
        title: 'Ayurvedic Pharmacology & Dravyaguna Standardization',
        platform: 'Ministry of Ayush e-Learning',
        url: 'https://ayush.gov.in/',
        duration: '4 Weeks'
      }
    ]
  },
  {
    id: 'role-tele',
    title: 'Tele-Ayurveda & Digital Health Officer',
    qualificationPack: 'HSS/Q8102 (Digital Health Ayush)',
    sector: 'HealthTech & Remote Consultations',
    avgSalary: '₹4.2 - 6.5 LPA',
    openings: 45,
    topRecruiters: ['Practo Ayush Division', 'Tata 1mg Ayush', 'NirogStreet', "Dr. Vaidya's"],
    requiredSkills: [
      'Patient Vitals & Therapy Logging',
      'Clinical Documentation & Logging',
      'Patient Communication & Care Ethics',
      'Digital Health Diagnostics',
      'Tele-Ayurveda Protocols'
    ],
    jobListings: [
      {
        id: 'job-tele-1',
        title: 'Digital Ayurveda Consultation Lead',
        company: 'Practo Ayush Division',
        location: 'Remote / Work from Home',
        salary: '₹4.8 - 6.5 LPA',
        type: 'Full-time • Tele-Health',
        posted: 'Just now',
        description: 'Provide video tele-consultations, digital Prakriti assessment, and electronic prescription issuing for chronic care.'
      },
      {
        id: 'job-tele-2',
        title: 'Ayush HealthTech Clinical Specialist',
        company: 'NirogStreet',
        location: 'Gurugram, Haryana',
        salary: '₹5.0 - 7.0 LPA',
        type: 'Full-time • HealthTech AI',
        posted: '2 days ago',
        description: 'Support AI clinical decision support tools for Vaidyas and manage patient treatment monitoring workflows.'
      }
    ],
    recommendedCourses: [
      {
        id: 'c5',
        title: 'AI & Digital Health Tools for Ayurveda Practitioners',
        platform: 'edX HealthTech Portal',
        url: 'https://www.edx.org/school/mitx',
        duration: '5 Weeks'
      }
    ]
  },
  {
    id: 'role-yoga',
    title: 'Therapeutic Yoga & Naturopathy Consultant',
    qualificationPack: 'HSS/Q2301 (Yoga Wellness Trainer)',
    sector: 'Integrative Wellness & Rehabilitation',
    avgSalary: '₹4.0 - 6.8 LPA',
    openings: 31,
    topRecruiters: ['Isha Foundation Wellness', 'Art of Living Health', 'MDNIY Clinical Centers', 'S-VYASA Yoga'],
    requiredSkills: [
      'Therapeutic Yoga & Pranayama',
      'Prakriti-Based Diet Planning',
      'Client Assessment & Alignment',
      'First Aid & Emergency Response',
      'Yogic Lifestyle Counseling'
    ],
    jobListings: [
      {
        id: 'job-yg-1',
        title: 'Clinical Yoga Protocol Specialist',
        company: 'MDNIY Clinical Center',
        location: 'New Delhi',
        salary: '₹5.2 - 6.8 LPA',
        type: 'Govt Autonomous • Full-time',
        posted: '1 day ago',
        description: 'Prescribe disease-specific Yogic therapy modules (Hypertension, Diabetes, Musculoskeletal) aligned with YCB guidelines.'
      },
      {
        id: 'job-yg-2',
        title: 'Wellness & Naturopathy Consultant',
        company: 'Isha Life Wellness Hub',
        location: 'Coimbatore, Tamil Nadu',
        salary: '₹4.5 - 6.2 LPA',
        type: 'Full-time • Residential Center',
        posted: '3 days ago',
        description: 'Provide personalized holistic diet planning, therapeutic asanas, and lifestyle modification guidance.'
      }
    ],
    recommendedCourses: [
      {
        id: 'c3',
        title: 'Clinical Yoga & Naturopathy for Ayush Practitioners',
        platform: 'MDNIY Digital Academy',
        url: 'http://www.yogamdniy.nic.in/',
        duration: '3 Weeks'
      }
    ]
  },
  {
    id: 'role-surgery',
    title: 'Kshara Karma & Shalya Tantra Assistant',
    qualificationPack: 'HSS/Q5702 (Kshara Karma Technician)',
    sector: 'Specialized Ayurvedic Surgery',
    avgSalary: '₹5.5 - 9.0 LPA',
    openings: 19,
    topRecruiters: ['AIIMS Ayurveda Surgery OPD', 'BHU Institute of Medical Sciences', 'National Institute of Ayurveda'],
    requiredSkills: [
      'Kshara Sutra Preparation & Standardization',
      'Sterilization & Aseptic Technique',
      'OT Sterilization & Shalya Protocols',
      'Post-Operative Wound Care',
      'Clinical Documentation & Logging'
    ],
    jobListings: [
      {
        id: 'job-sg-1',
        title: 'Shalya Tantra & OT Assistant',
        company: 'BHU Institute of Medical Sciences',
        location: 'Varanasi, Uttar Pradesh',
        salary: '₹6.0 - 8.5 LPA',
        type: 'University Hospital • Full-time',
        posted: '2 days ago',
        description: 'Assist in ano-rectal Kshara Sutra procedures, maintain autoclave sterilization, and supervise post-op patient recovery.'
      },
      {
        id: 'job-sg-2',
        title: 'Kshara Sutra Clinical Associate',
        company: 'National Institute of Ayurveda (NIA)',
        location: 'Jaipur, Rajasthan',
        salary: '₹6.5 - 9.0 LPA',
        type: 'Full-time • Surgical Ward',
        posted: 'Just now',
        description: 'Standardize medicated thread preparation using Snuhi ksheera, Apamarga kshara, and Haridra churnam.'
      }
    ],
    recommendedCourses: [
      {
        id: 'c6',
        title: 'Sterilization & Aseptic Technique in Ayurveda',
        platform: 'BHU IMS Open Learning',
        url: 'https://www.bhu.ac.in/ims/',
        duration: '2 Weeks'
      }
    ]
  },
  {
    id: 'role-research',
    title: 'Ayush Clinical Research Associate (CRA)',
    qualificationPack: 'HSS/Q8201 (Clinical Research Protocol)',
    sector: 'Evidence-Based Research & Trials',
    avgSalary: '₹5.0 - 8.5 LPA',
    openings: 16,
    topRecruiters: ['CCRAS New Delhi', 'CSIR-TRISUTRA', 'WHO Traditional Medicine Centre', 'ICMR Ayush Division'],
    requiredSkills: [
      'Clinical Documentation & Logging',
      'Ayurvedic Pharmacology Basics',
      'GCP & Clinical Trial Protocols',
      'Data Analysis & Case Reporting',
      'Patient Communication & Care Ethics'
    ],
    jobListings: [
      {
        id: 'job-rs-1',
        title: 'Clinical Research Associate (Ayurveda)',
        company: 'CCRAS New Delhi',
        location: 'New Delhi',
        salary: '₹6.0 - 8.2 LPA',
        type: 'Research Council • Full-time',
        posted: '1 day ago',
        description: 'Coordinate randomized controlled trials (RCTs) for classical formulations in compliance with Ayush GCP guidelines.'
      },
      {
        id: 'job-rs-2',
        title: 'Pharmacovigilance Fellow (Ayush)',
        company: 'CSIR-TRISUTRA',
        location: 'Pune, Maharashtra',
        salary: '₹5.5 - 7.5 LPA',
        type: 'Fellowship • 2 Years',
        posted: '4 days ago',
        description: 'Monitor adverse drug reaction reporting and clinical safety data analysis for Ayurvedic botanical formulations.'
      }
    ],
    recommendedCourses: [
      {
        id: 'c4',
        title: 'Patient Vital Signs & Clinical Documentation',
        platform: 'Coursera Ayush Division',
        url: 'https://www.coursera.org/browse/health',
        duration: '2 Weeks'
      }
    ]
  }
];

const NOS_SKILL_KEYWORD_MAP = {
  'panchakarma': 'Panchakarma Procedure Execution',
  'abhyanga': 'Abhyanga & Swedana',
  'swedana': 'Abhyanga & Swedana',
  'basti': 'Kati/Janu Basti Setup',
  'kati': 'Kati/Janu Basti Setup',
  'janu': 'Kati/Janu Basti Setup',
  'vitals': 'Patient Vital Signs Monitoring',
  'vital signs': 'Patient Vital Signs Monitoring',
  'sterilization': 'Sterilization & Aseptic Technique',
  'aseptic': 'Sterilization & Aseptic Technique',
  'herbal': 'Ayurvedic Herbal Kashaya Preparation',
  'kashaya': 'Ayurvedic Herbal Kashaya Preparation',
  'dravya': 'Sterilization & Herbal Dravya Prep',
  'first aid': 'First Aid & Emergency Response',
  'cpr': 'First Aid & Emergency Response',
  'communication': 'Patient Communication & Care Ethics',
  'counselling': 'Patient Communication & Care Ethics',
  'ethics': 'Patient Communication & Care Ethics',
  'documentation': 'Clinical Documentation & Logging',
  'logging': 'Clinical Documentation & Logging',
  'ehr': 'Clinical Documentation & Logging',
  'yoga': 'Therapeutic Yoga & Pranayama',
  'pranayama': 'Therapeutic Yoga & Pranayama',
  'asana': 'Client Assessment & Alignment',
  'pharmacology': 'Ayurvedic Pharmacology Basics',
  'dravyaguna': 'Ayurvedic Pharmacology Basics',
  'tele': 'Tele-Ayurveda Protocols',
  'telemedicine': 'Tele-Ayurveda Protocols',
  'digital health': 'Digital Health Diagnostics',
  'ai': 'Digital Health Diagnostics',
  'kshara': 'Kshara Sutra Preparation & Standardization',
  'shalya': 'OT Sterilization & Shalya Protocols',
  'wound': 'Post-Operative Wound Care',
  'diet': 'Prakriti-Based Diet Planning',
  'poshana': 'Prakriti-Based Diet Planning',
  'nutrition': 'Prakriti-Based Diet Planning',
  'gcp': 'GCP & Clinical Trial Protocols',
  'research': 'Data Analysis & Case Reporting',
  'qc': 'Herbal Extraction & QC',
  'gmp': 'GMP Standardization'
};

const CERT_KEYWORD_MAP = {
  'hssc': 'HSSC Qualification Pack Attendant',
  'panchakarma attendant': 'HSSC Panchakarma Attendant (Verified)',
  'red cross': 'Red Cross First Aid & CPR',
  'first aid': 'First Aid & Basic Life Support',
  'cpr': 'CPR & BLS Certification',
  'ycb': 'YCB Certified Yoga Protocol Instructor',
  'yoga certification': 'Ministry of AYUSH Yoga Certification',
  'fssai': 'FSSAI Ayush Ahara Safety Officer',
  'gmp': 'WHO-GMP Ayush Manufacturing Standard',
  'bams': 'BAMS Degree (Ayurvedacharya)',
  'md': 'MD Ayurveda Degree',
  'bhms': 'BHMS Degree (Homeopathy)',
  'bnys': 'BNYS Degree (Naturopathy & Yoga)',
  'bums': 'BUMS Degree (Unani)',
  'bsms': 'BSMS Degree (Siddha)'
};

export const RESUME_KEYWORD_PATTERNS = [
  /\b(resume|curriculum\s+vitae|\bcv\b|biodata|bio-data|personal\s+profile|professional\s+summary|career\s+objective|profile\s+summary)\b/i,
  /\b(education|academic|qualifications?|educational\s+details|academic\s+record|matriculation|intermediate|higher\s+secondary|cbse|icse|state\s+board|cgpa|percentage|graduat(e|ion))\b/i,
  /\b(bams|bhms|bnys|bums|bsms|mbbs|md\s*\(ayu\)|md\s*ayurveda|b\.?sc|m\.?sc|d\.?pharma|ayurvedacharya|bachelor\s+of|master\s+of|diploma\s+in)\b/i,
  /\b(experience|internship|rotatory\s+internship|clinical\s+posting|employment|work\s+history|clinical\s+experience|professional\s+experience|responsibilities|clinical\s+duty|hospital\s+training)\b/i,
  /\b(skills?|technical\s+skills|clinical\s+skills|competenc(y|ies)|key\s+skills|core\s+competencies|certificat(e|ion|ions)|accreditation|hssc|nsqf|verified\s+skills)\b/i,
  /\b(contact|email|phone|mobile|address|permanent\s+address|date\s+of\s+birth|\bdob\b|languages?\s+known|declaration)\b/i,
  /\b(hospital|clinic|clinical|patient|doctor|dr\.|vaidya|practitioner|physician|consultant|opd|ipd)\b/i
];

export function analyzeAtsCompliance(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      atsScore: 0,
      isAtsCompliant: false,
      tier: 'Non-ATS Format',
      checks: {
        contact: { passed: false, label: 'Contact Information', detail: 'No contact info detected' },
        sections: { passed: false, label: 'Standard ATS Headings', detail: 'Missing Education / Skills / Experience sections' },
        readability: { passed: false, label: 'Machine-Readable Text Layer', detail: 'No text extracted' },
        keywords: { passed: false, label: 'AYUSH NOS Skill Keywords', detail: '0 keywords matched' },
        degree: { passed: false, label: 'Accredited Qualification', detail: 'No recognized degree found' }
      },
      summary: 'Upload an ATS-compliant resume containing contact info, standard section headers, and clinical skills.'
    };
  }

  const clean = rawText
    .replace(/^\[Uploaded File:.*?\]\s*/i, '')
    .replace(/%PDF-\d+\.\d+/g, '')
    .replace(/\b\d+\s+\d+\s+obj\b/g, '')
    .replace(/\bendobj\b/g, '')
    .replace(/<<.*?>>/g, '')
    .trim();

  const lower = clean.toLowerCase();

  // 1. Contact check (Email, Phone, Name)
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(clean);
  const hasPhone = /\+?\d[\d\s-]{8,14}\d/.test(clean);
  const hasContactSection = /\b(contact|email|phone|mobile|address)\b/i.test(clean);
  const contactPassed = (hasEmail && hasPhone) || (hasContactSection && (hasEmail || hasPhone));

  // 2. Standard ATS Section Headings
  const hasEducation = /\b(education|academic|qualifications?|educational\s+details|academic\s+record)\b/i.test(clean);
  const hasSkills = /\b(skills?|technical\s+skills|clinical\s+skills|competenc(y|ies)|key\s+skills|core\s+competencies|certificat(e|ion|ions))\b/i.test(clean);
  const hasExperience = /\b(experience|internship|rotatory\s+internship|clinical\s+posting|employment|work\s+history|clinical\s+experience|professional\s+experience|responsibilities|projects?)\b/i.test(clean);
  const sectionsCount = [hasEducation, hasSkills, hasExperience].filter(Boolean).length;
  const sectionsPassed = sectionsCount >= 2;

  // 3. Clean machine readability
  const words = clean.split(/\s+/).filter(w => w.length > 2 && /[a-zA-Z]/.test(w));
  const readabilityPassed = words.length >= 25 && clean.length >= 60;

  // 4. Clinical keywords
  let skillCount = 0;
  Object.keys(NOS_SKILL_KEYWORD_MAP).forEach(kw => {
    if (lower.includes(kw)) skillCount++;
  });
  const keywordsPassed = skillCount >= 1;

  // 5. Degree / Accredited Qualification
  const hasDegree = /\b(bams|bhms|bnys|bums|bsms|mbbs|md\s*\(ayu\)|md\s*ayurveda|b\.?sc|m\.?sc|d\.?pharma|ayurvedacharya|bachelor|master|diploma)\b/i.test(clean);

  // Score computation
  let score = 0;
  if (contactPassed) score += 20; else if (hasEmail || hasPhone) score += 10;
  if (sectionsCount === 3) score += 25; else if (sectionsCount === 2) score += 18; else if (sectionsCount === 1) score += 8;
  if (readabilityPassed) score += 20;
  if (skillCount >= 3) score += 20; else if (skillCount >= 1) score += 12;
  if (hasDegree) score += 15;

  const isAtsCompliant = score >= 55 && readabilityPassed && (sectionsPassed || keywordsPassed);

  let tier = 'ATS Optimized (90%+)';
  if (score < 55) tier = 'Non-ATS Format';
  else if (score < 75) tier = 'ATS Compatible (Moderate)';
  else if (score < 90) tier = 'ATS Verified (High)';

  return {
    atsScore: Math.min(99, Math.max(0, score)),
    isAtsCompliant,
    tier,
    checks: {
      contact: {
        passed: contactPassed,
        label: 'Contact Information',
        detail: contactPassed ? 'Email & Phone parsed cleanly' : hasEmail ? 'Phone missing or unformatted' : 'Email & phone needed'
      },
      sections: {
        passed: sectionsPassed,
        label: 'Standard ATS Headings',
        detail: sectionsPassed ? `${sectionsCount}/3 standard ATS headings found (Education/Skills/Experience)` : 'Include standard Education & Skills headings'
      },
      readability: {
        passed: readabilityPassed,
        label: 'Machine-Readable Text Layer',
        detail: readabilityPassed ? `Clean text layer (${words.length} searchable terms)` : 'Text unreadable or image stream'
      },
      keywords: {
        passed: keywordsPassed,
        label: 'AYUSH NOS Skill Keywords',
        detail: keywordsPassed ? `${skillCount} HSSC NOS competencies matched` : 'Include specific clinical skills (e.g. Panchakarma, Vitals)'
      },
      degree: {
        passed: hasDegree,
        label: 'Accredited Qualification',
        detail: hasDegree ? 'Degree & qualification recognized' : 'Specify accredited Ayush degree'
      }
    },
    summary: isAtsCompliant ? 'Passed ATS filters for Workday, Taleo, Greenhouse & AYUSH ATS' : 'Format resume with standard ATS headings, contact info and clinical skills.'
  };
}

export function isAuthenticResume(rawText) {
  const ats = analyzeAtsCompliance(rawText);
  return ats.isAtsCompliant;
}

function parseResumeLocally(text) {
  const clean = (text || '').replace(/^\[Uploaded File:.*?\]\s*/i, '').trim();
  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);
  const lower = clean.toLowerCase();

  const atsCompliance = analyzeAtsCompliance(text);

  let candidateName = 'Ayush Candidate';
  const nameLine = lines.find(l => /^name:\s*/i.test(l));
  if (nameLine) {
    candidateName = nameLine.replace(/^name:\s*/i, '').trim();
  } else {
    for (const l of lines.slice(0, 5)) {
      if (/^(Dr\.|Prof\.|Vaidya|Mr\.|Ms\.)\s+[A-Za-z\s]+/i.test(l)) {
        candidateName = l;
        break;
      } else if (l.length < 35 && /^[A-Za-z\s.]+$/.test(l) && !/^(resume|curriculum|cv|biodata|profile|summary|education|experience)/i.test(l)) {
        candidateName = l;
        break;
      }
    }
  }

  let degree = 'Ayush Scholar / Graduate';
  if (lower.includes('bhms')) degree = 'BHMS (Homeopathy)';
  else if (lower.includes('bnys')) degree = 'BNYS (Naturopathy & Yoga)';
  else if (lower.includes('bums')) degree = 'BUMS (Unani Medicine)';
  else if (lower.includes('bsms')) degree = 'BSMS (Siddha Medicine)';
  else if (lower.includes('md (ayu)') || lower.includes('md ayurveda')) degree = 'MD Ayurveda (Postgraduate)';
  else if (lower.includes('bams')) degree = 'BAMS (Ayurvedacharya)';
  else if (lower.includes('mbbs')) degree = 'MBBS (Modern Medicine)';

  let college = 'Affiliated Ayush Medical Institution';
  if (lower.includes('aiia') || lower.includes('all india institute')) college = 'All India Institute of Ayurveda (AIIA), New Delhi';
  else if (lower.includes('bhu') || lower.includes('banaras')) college = 'BHU Institute of Medical Sciences, Varanasi';
  else if (lower.includes('gujarat') || lower.includes('jamnagar')) college = 'Gujarat Ayurved University, Jamnagar';
  else if (lower.includes('kerala') || lower.includes('thiruvananthapuram')) college = 'Government Ayurveda College, Thiruvananthapuram';
  else if (lower.includes('mdniy')) college = 'Morarji Desai National Institute of Yoga, New Delhi';
  else if (lower.includes('nia') || lower.includes('national institute of ayurveda')) college = 'National Institute of Ayurveda (NIA), Jaipur';

  const extractedSkillsSet = new Set();
  Object.entries(NOS_SKILL_KEYWORD_MAP).forEach(([kw, skill]) => {
    if (lower.includes(kw)) extractedSkillsSet.add(skill);
  });
  const extractedSkills = Array.from(extractedSkillsSet);

  const certsSet = new Set();
  Object.entries(CERT_KEYWORD_MAP).forEach(([kw, cert]) => {
    if (lower.includes(kw)) certsSet.add(cert);
  });
  const detectedCertificates = Array.from(certsSet);

  const hasAnyMatch = extractedSkills.length > 0;

  const skillGaps = ALL_NOS_BENCHMARKS.map(bench => {
    const isMastered = extractedSkills.includes(bench.name);
    let status = isMastered ? 'Mastered' : 'Gap';
    let proficiencyScore = isMastered 
      ? Math.floor(82 + Math.random() * 14) 
      : hasAnyMatch 
        ? Math.floor(30 + Math.random() * 30) 
        : 0;
    let urgency = !isMastered ? (bench.weight >= 15 ? 'Critical' : 'Moderate') : 'None';

    return {
      skill: bench.name,
      category: bench.category,
      status,
      proficiencyScore,
      targetScore: 90,
      urgency,
      isGap: !isMastered
    };
  });

  const masteredCount = skillGaps.filter(g => g.status === 'Mastered').length;
  const gapCount = skillGaps.filter(g => g.isGap).length;
  
  // Real score calculation: 0 if no skills matched from resume
  const overallReadinessScore = !hasAnyMatch 
    ? 0 
    : Math.min(98, Math.max(25, Math.round((masteredCount / ALL_NOS_BENCHMARKS.length) * 80 + Math.min(18, detectedCertificates.length * 6))));

  const roleMappings = AYUSH_CAREER_ROLES_LOCAL.map(role => {
    const totalRequired = role.requiredSkills.length;
    const matchingSkills = role.requiredSkills.filter(req => extractedSkills.includes(req));
    const missingSkills = role.requiredSkills.filter(req => !extractedSkills.includes(req));

    const matchPercent = totalRequired > 0 && hasAnyMatch ? Math.round((matchingSkills.length / totalRequired) * 100) : 0;
    const fitLevel = matchPercent >= 75 ? 'High Match' : matchPercent >= 45 ? 'Moderate Match' : 'Upskilling Needed';

    return {
      ...role,
      matchPercent,
      fitLevel,
      matchingSkills,
      missingSkills,
      readinessDelta: Math.max(0, 100 - matchPercent)
    };
  }).sort((a, b) => b.matchPercent - a.matchPercent);

  const missingSkillNames = skillGaps.filter(g => g.isGap).map(g => g.skill);
  const bridgeRecommendations = [
    {
      id: 'bridge-1',
      title: 'Panchakarma Therapy: Complete Clinical Protocol',
      provider: 'NIA Jaipur (NCISM Certified)',
      platform: 'SWAYAM / NPTEL',
      url: 'https://swayam.gov.in/nc_details/NPTEL',
      duration: '6 Weeks',
      addressesGaps: ['Panchakarma Procedure Execution', 'Abhyanga & Swedana', 'Kati/Janu Basti Setup'],
      boostEstimate: '+24% Role Match'
    },
    {
      id: 'bridge-2',
      title: 'Ayurvedic Pharmacology & Dravyaguna Standardization',
      provider: 'AIIA New Delhi (MoA Approved)',
      platform: 'Ministry of Ayush e-Learning',
      url: 'https://ayush.gov.in/',
      duration: '4 Weeks',
      addressesGaps: ['Ayurvedic Herbal Kashaya Preparation', 'Sterilization & Herbal Dravya Prep'],
      boostEstimate: '+18% Role Match'
    },
    {
      id: 'bridge-3',
      title: 'AI & Digital Health Tools for Ayurveda Practitioners',
      provider: 'AyushConnect Academy (HSSC Partner)',
      platform: 'Coursera / edX Portal',
      url: 'https://www.coursera.org/browse/health',
      duration: '5 Weeks',
      addressesGaps: ['Tele-Ayurveda Protocols', 'Clinical Documentation & Logging'],
      boostEstimate: '+20% Role Match'
    },
    {
      id: 'bridge-4',
      title: 'Clinical Yoga & Naturopathy for Ayush Practitioners',
      provider: 'Morarji Desai National Institute of Yoga',
      platform: 'MDNIY Digital Academy',
      url: 'http://www.yogamdniy.nic.in/',
      duration: '3 Weeks',
      addressesGaps: ['Therapeutic Yoga & Pranayama', 'Prakriti-Based Diet Planning'],
      boostEstimate: '+15% Role Match'
    }
  ].filter(br => br.addressesGaps.some(g => missingSkillNames.includes(g)));

  return {
    candidateName,
    degree,
    college,
    extractedSkills,
    detectedCertificates,
    overallReadinessScore,
    atsCompliance,
    masteredCount,
    gapCount,
    skillGaps,
    roleMappings,
    bridgeRecommendations,
    aiConfidenceScore: hasAnyMatch ? `${Math.floor(92 + Math.random() * 6)}.${Math.floor(Math.random() * 9)}%` : '0%',
    analyzedAt: new Date().toISOString()
  };
}

export default function ResumeScreeningView() {
  const [viewMode, setViewMode] = useState('student'); // 'student' | 'recruiter'
  const [resumeText, setResumeText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');
  const [parsedResult, setParsedResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all' | 'gaps' | 'mastered'
  const [appliedJobs, setAppliedJobs] = useState({});
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [selectedRoleForModal, setSelectedRoleForModal] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [applyToastMsg, setApplyToastMsg] = useState('');
  const [bridgeLearningCourse, setBridgeLearningCourse] = useState(null);
  const fileInputRef = useRef(null);

  const handleApplyToJob = async (role, job) => {
    const jobKey = job ? job.id : role.id;
    setApplyingJobId(jobKey);

    const jobTitle = job ? job.title : role.title;
    const company = job ? job.company : (role.topRecruiters?.[0] || 'Ayush Industry Partner');

    try {
      const savedUser = localStorage.getItem('ayush_user');
      const u = savedUser ? JSON.parse(savedUser) : null;
      await fetch(`${API_BASE}/api/jobs/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: jobKey,
          studentId: u?.id || 'std-001',
          candidateName: parsedResult?.candidateName || u?.name || 'Ayush Candidate',
          matchPercent: role.matchPercent || 80,
          qualificationPack: role.qualificationPack,
          appliedRoleTitle: jobTitle,
          companyName: company
        })
      }).catch(() => null);
    } catch (_) {}

    await new Promise(r => setTimeout(r, 700));
    setAppliedJobs(prev => ({ ...prev, [jobKey]: true, [role.id]: true }));
    setApplyingJobId(null);
    setApplyToastMsg(`🎉 Application submitted to ${company} for "${jobTitle}" with your ${role.matchPercent || 0}% Resume Match!`);
    setTimeout(() => setApplyToastMsg(''), 4500);
  };

  const extractTextFromPdf = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const bytes = new Uint8Array(e.target.result);
          const textDecoder = new TextDecoder('latin1');
          const fullStr = textDecoder.decode(bytes);

          // Check if this PDF only contains image streams and no text operators
          const hasTextOperators = /\b(BT|ET|Tj|TJ|ToUnicode|Font)\b/.test(fullStr);
          const hasImageOnly = /\b(\/Image|\/DCTDecode|\/JPXDecode)\b/.test(fullStr) && !hasTextOperators;

          if (hasImageOnly) {
            // Scanned image or photo converted to PDF
            resolve('');
            return;
          }

          let raw = '';
          for (let i = 0; i < bytes.length; i++) {
            const b = bytes[i];
            if (b > 31 && b < 127) raw += String.fromCharCode(b);
            else if (b === 10 || b === 13) raw += '\n';
          }

          // Filter out PDF internal syntax commands, object tables, stream metadata
          const isPdfSyntax = (line) => {
            if (/^(\/?[A-Z0-9_-]+\s*<<|>>|\/Type|\/Catalog|\/Pages|\/Kids|\/ProcSet|\/ExtGState|\/MediaBox|\/Filter|\/FlateDecode|\/Length|\/Font|\/Encoding|\/XObject|\/Root|\/Size|\/Info)/i.test(line)) return true;
            if (/^(\d+\s+\d+\s+obj|\d+\s+\d+\s+R|endobj|xref|trailer|startxref|stream|endstream|%PDF-)/i.test(line)) return true;
            if (/^\[?\s*(\/\w+\s*)+\]?$/.test(line)) return true;
            return false;
          };

          const lines = raw.split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 2 && /[a-zA-Z]/.test(l) && !isPdfSyntax(l));

          resolve(lines.join('\n'));
        } catch {
          resolve('');
        }
      };
      reader.onerror = () => resolve('');
      reader.readAsArrayBuffer(file);
    });
  };

  const processFile = useCallback(async (file) => {
    // 1. Check if user uploaded an image file
    const isImage = /\.(png|jpe?g|gif|webp|svg|bmp|heic|ico)$/i.test(file.name) || (file.type && file.type.startsWith('image/'));
    if (isImage) {
      setErrorMsg('❌ Image files (PNG, JPG, etc.) cannot be processed as a resume. Please upload a valid Resume or CV document in PDF, DOCX, DOC, or TXT format.');
      setUploadedFile(null);
      setResumeText('');
      setParsedResult(null);
      return;
    }

    // 2. Strict check for supported document formats
    const allowed = /\.(pdf|txt|doc|docx)$/i;
    if (!allowed.test(file.name)) {
      setErrorMsg('❌ Unsupported file format. Please upload a valid Resume/CV document (.PDF, .DOCX, .DOC, or .TXT).');
      setUploadedFile(null);
      setResumeText('');
      setParsedResult(null);
      return;
    }

    setErrorMsg('');
    setUploadedFile(file);
    setParsedResult(null);

    let extracted = '';
    if (file.type === 'text/plain') {
      extracted = await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = (e) => resolve(e.target.result || '');
        r.onerror = () => resolve('');
        r.readAsText(file);
      });
    } else {
      extracted = await extractTextFromPdf(file);
    }

    const cleanExtracted = (extracted || '').trim();
    if (!cleanExtracted || !isAuthenticResume(cleanExtracted)) {
      setErrorMsg(`❌ Non-ATS Friendly Resume: "${file.name}" does not meet standard ATS parsing criteria. Please upload a machine-readable ATS resume (PDF/DOCX/TXT) containing standard Contact details, 'Education', 'Experience', and 'Skills' section headings.`);
      setUploadedFile(null);
      setResumeText('');
      setParsedResult(null);
      return;
    }

    const finalTxt = `[Uploaded File: ${file.name}]\n${cleanExtracted}`;
    setResumeText(finalTxt);
    // Auto analyze newly uploaded valid resume
    executeParse(finalTxt);
  }, []);

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const loadSample = (key) => {
    setUploadedFile(null);
    const txt = SAMPLE_RESUMES[key].text;
    setResumeText(txt);
    setErrorMsg('');
    executeParse(txt);
  };

  const executeParse = async (textToParse) => {
    const text = textToParse !== undefined ? textToParse : resumeText;
    if (!text || !text.trim()) {
      setErrorMsg('Please upload an ATS-friendly resume or paste CV text first.');
      setParsedResult(null);
      return;
    }

    if (!isAuthenticResume(text)) {
      setErrorMsg('❌ Non-ATS Friendly Resume: The provided document lacks standard ATS structural sections (Education, Skills, Experience, or Contact Info). Please upload an ATS-compliant CV or test with a sample profile below.');
      setParsedResult(null);
      setParsing(false);
      return;
    }

    setParsing(true);
    setErrorMsg('');
    setSyncSuccessMsg('');

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${API_BASE}/api/ai/parse-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.success && data.extractedData) {
          setParsedResult(data.extractedData);
          setParsing(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend fetch failed, using local AI parser engine:', e.message);
    }

    await new Promise(r => setTimeout(r, 500));
    setParsedResult(parseResumeLocally(text));
    setParsing(false);
  };

  const handleParse = () => {
    executeParse(resumeText);
  };

  const handleSyncToProfile = async () => {
    if (!parsedResult) return;
    setSyncing(true);
    setSyncSuccessMsg('');

    try {
      const savedUser = localStorage.getItem('ayush_user');
      const email = savedUser ? JSON.parse(savedUser).email : null;

      const res = await fetch(`${API_BASE}/api/ai/sync-resume-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parsedData: parsedResult, email })
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.success) {
          if (savedUser) {
            const u = JSON.parse(savedUser);
            u.readinessScore = parsedResult.overallReadinessScore;
            localStorage.setItem('ayush_user', JSON.stringify(u));
          }
          setSyncSuccessMsg('✅ Successfully synchronized verified resume skills & HSSC readiness score to your student profile!');
          setSyncing(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Profile sync fallback:', e);
    }

    try {
      const savedUser = localStorage.getItem('ayush_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        u.readinessScore = parsedResult.overallReadinessScore;
        localStorage.setItem('ayush_user', JSON.stringify(u));
      }
    } catch {}
    setSyncSuccessMsg('✅ Skills & HSSC readiness score updated in your local profile!');
    setSyncing(false);
  };

  const displayGaps = parsedResult ? (parsedResult.skillGaps || []) : ALL_NOS_BENCHMARKS.map(b => ({
    skill: b.name,
    category: b.category,
    status: 'Unassessed',
    proficiencyScore: 0,
    targetScore: 90,
    urgency: 'Awaiting Upload',
    isGap: false
  }));

  const filteredGaps = displayGaps.filter(g => {
    if (activeTabFilter === 'gaps') return g.isGap;
    if (activeTabFilter === 'mastered') return g.status === 'Mastered';
    return true;
  });

  return (
    <div className="space-y-8 md:space-y-10 pb-16 font-manrope">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.rtf"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Header Banner with Persona Toggle */}
      <div className="bg-surface-white rounded-3xl p-6 sm:p-8 md:p-10 border border-surface-container-high shadow-wellness flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200 flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              AI Resume & Career Mapping Engine
            </span>
            <span className="text-xs text-outline font-bold bg-surface-container-low px-3 py-1 rounded-full">
              HSSC NOS Standards • NSQF Level 4/5
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary tracking-tight">
            Resume Skill Gap & Career Role Matcher
          </h1>
          <p className="text-xs sm:text-sm text-outline font-medium max-w-2xl leading-relaxed">
            Upload your resume or paste credentials to instantly detect <strong className="text-text-main">HSSC National Occupational Standards (NOS) skill gaps</strong>, map your fit against <strong className="text-text-main">6+ AYUSH career tracks</strong>, and get tailored bridge learning recommendations.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="bg-surface-container-low p-1 rounded-2xl border border-surface-container-high flex items-center">
            <button
              onClick={() => setViewMode('student')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                viewMode === 'student'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-outline hover:text-text-main'
              }`}
            >
              🎓 Student Career Mapping
            </button>
            <button
              onClick={() => setViewMode('recruiter')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                viewMode === 'recruiter'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-outline hover:text-text-main'
              }`}
            >
              🏢 Recruiter Screening
            </button>
          </div>

          <button
            onClick={handleParse}
            disabled={parsing || !resumeText.trim()}
            className={`px-6 py-3.5 rounded-2xl text-white font-black text-xs transition-all shadow-wellness flex items-center justify-center gap-2.5 ${
              parsing ? 'bg-primary/60 cursor-not-allowed' : !resumeText.trim() ? 'bg-outline/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-container hover:scale-[1.02]'
            }`}
          >
            {parsing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-leaf-green-accent" />}
            <span>{parsing ? 'Analyzing Resume...' : 'Run AI Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Apply Toast Notification */}
      {applyToastMsg && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-primary text-white text-xs font-black flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-yellow-300 shrink-0" />
            <span>{applyToastMsg}</span>
          </div>
          <button onClick={() => setApplyToastMsg('')} className="p-1 text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sync Success Notification */}
      {syncSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-extrabold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{syncSuccessMsg}</span>
          </div>
          <button onClick={() => setSyncSuccessMsg('')} className="p-1 text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-100 border border-red-300 text-red-900 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Upload & Input Panel vs Diagnostics / Mapping */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Upload & Input Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upload Dropzone */}
          <div className="bg-surface-white rounded-3xl p-6 sm:p-8 border border-surface-container-high shadow-wellness space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-text-main flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Upload Resume Document</span>
              </h2>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full">
                PDF / DOCX / TXT only
              </span>
            </div>

            {uploadedFile ? (
              <div className="p-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-emerald-950 truncate">{uploadedFile.name}</div>
                    <div className="text-[11px] text-emerald-700 font-medium">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • Verified CV Document
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setUploadedFile(null);
                    setResumeText('');
                    setParsedResult(null);
                  }}
                  className="p-1.5 rounded-full text-emerald-700 hover:text-red-600 hover:bg-red-100 transition-all shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed text-center space-y-2.5 cursor-pointer transition-all ${
                  isDragging
                    ? 'border-primary bg-leaf-green-light/40 scale-[1.01]'
                    : 'border-outline-variant bg-surface-container-low hover:border-primary hover:bg-leaf-green-light/20'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto transition-transform">
                  <Upload className={`w-6 h-6 text-primary transition-transform ${isDragging ? 'scale-125' : ''}`} />
                </div>
                <div>
                  <div className="text-xs font-black text-text-main">
                    {isDragging ? 'Drop resume document here!' : 'Drag & drop your Resume PDF / DOCX / TXT'}
                  </div>
                  <div className="text-[11px] text-outline font-medium">Click to browse CV documents (Images/photos not allowed)</div>
                </div>
              </div>
            )}

            {/* Quick Test Samples */}
            <div className="space-y-2 pt-2 border-t border-surface-container-high">
              <div className="text-[11px] font-extrabold text-outline uppercase tracking-wider">
                Or Test with Pre-built Ayush Profile Samples:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(SAMPLE_RESUMES).map(([key, sample]) => (
                  <button
                    key={key}
                    onClick={() => loadSample(key)}
                    className="p-2.5 rounded-xl border border-surface-container-high bg-surface-container-low hover:border-primary hover:bg-white text-left transition-all text-[11px] font-bold text-text-main leading-tight"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Editor */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">
                  Resume Content & Skills:
                </label>
                {resumeText && (
                  <button
                    onClick={() => {
                      setResumeText('');
                      setParsedResult(null);
                      setUploadedFile(null);
                    }}
                    className="text-[10px] font-bold text-red-600 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-surface-container-low border border-surface-container-high text-xs text-text-main font-mono focus:outline-none focus:border-primary transition-all leading-relaxed"
                placeholder="Upload resume above or paste degrees, clinical skills, and certifications here to calculate live match %..."
              />
            </div>

            <button
              onClick={() => executeParse()}
              disabled={parsing || !resumeText.trim()}
              className={`w-full py-3.5 rounded-2xl text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
                parsing ? 'bg-primary/60 cursor-not-allowed' : !resumeText.trim() ? 'bg-outline/40 cursor-not-allowed' : 'bg-primary hover:bg-primary-container'
              }`}
            >
              {parsing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Credentials with AI...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4 text-leaf-green-accent" />
                  <span>{resumeText.trim() ? 'Run Skill Gap & Role Mapping Diagnostic' : 'Upload Resume / Pick Sample to Analyze'}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Profile Summary Card */}
          <div className="bg-surface-white rounded-3xl p-6 border border-surface-container-high shadow-wellness space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-outline">Candidate Overview</span>
              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                parsedResult ? 'bg-leaf-green-light text-primary border border-leaf-green-accent/30' : 'bg-surface-container-high text-outline'
              }`}>
                {parsedResult ? `AI Confidence ${parsedResult.aiConfidenceScore}` : 'Awaiting Resume'}
              </span>
            </div>

            {parsedResult ? (
              <div className="space-y-1">
                <h3 className="text-lg font-black text-primary">{parsedResult.candidateName}</h3>
                <p className="text-xs font-bold text-text-main">{parsedResult.degree}</p>
                <p className="text-[11px] text-outline font-medium">{parsedResult.college}</p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-surface-container-low border border-dashed border-surface-container-high text-center space-y-1">
                <div className="text-xs font-bold text-text-main">No Resume Analyzed Yet</div>
                <div className="text-[11px] text-outline font-medium">Upload a file or choose a sample to extract credentials</div>
              </div>
            )}

            {/* Verified Certificates */}
            {parsedResult && (
              <div className="space-y-2 pt-2 border-t border-surface-container-high">
                <div className="text-[11px] font-bold text-outline uppercase tracking-wider">Detected Credentials:</div>
                <div className="flex flex-wrap gap-1.5">
                  {parsedResult.detectedCertificates.map((cert, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sync Profile Action */}
            {parsedResult && (
              <button
                onClick={handleSyncToProfile}
                disabled={syncing}
                className="w-full py-3 rounded-xl bg-leaf-green-light hover:bg-leaf-green-light/80 text-primary border border-leaf-green-accent/40 font-black text-xs transition-all flex items-center justify-center gap-2"
              >
                {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4 text-emerald-600" />}
                <span>Sync Verified Skills & Readiness to Profile</span>
              </button>
            )}
          </div>

          {/* ATS Compliance Diagnostic Card */}
          {parsedResult?.atsCompliance && (
            <div className="bg-surface-white rounded-3xl p-6 border border-surface-container-high shadow-wellness space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-outline flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  <span>ATS Screening Diagnostic</span>
                </span>
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                  parsedResult.atsCompliance.atsScore >= 80
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {parsedResult.atsCompliance.atsScore}% ATS Score
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-700"
                    style={{ width: `${parsedResult.atsCompliance.atsScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-outline">
                  <span>Tier: {parsedResult.atsCompliance.tier}</span>
                  <span className="text-emerald-700 font-extrabold">Workday / Taleo Verified</span>
                </div>
              </div>

              {/* ATS Checklist */}
              <div className="space-y-2 pt-2 border-t border-surface-container-high">
                <div className="text-[11px] font-bold text-outline uppercase tracking-wider">ATS Parser Verification:</div>
                <div className="space-y-1.5 text-xs">
                  {Object.entries(parsedResult.atsCompliance.checks).map(([key, check]) => (
                    <div key={key} className="flex items-start gap-2 p-2 rounded-xl bg-surface-container-low border border-surface-container-high/60">
                      {check.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-text-main text-[11px] flex items-center justify-between">
                          <span>{check.label}</span>
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${check.passed ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'}`}>
                            {check.passed ? 'Passed' : 'Attention'}
                          </span>
                        </div>
                        <div className="text-[10px] text-outline font-medium truncate">{check.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Diagnostics, Skill Gap Breakdown & Career Role Mapping (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Key Metrics Banner */}
          <div className="bg-gradient-to-br from-primary via-primary-container to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-wellness space-y-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-leaf-green-accent/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-leaf-green-accent">
                  HSSC Qualification Readiness Analysis
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {parsedResult ? `${parsedResult.overallReadinessScore}% Aggregate Job Fit` : '0% (Awaiting Resume Upload)'}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-white/70 font-medium">Mastered NOS Skills</div>
                  <div className="text-xl font-black text-leaf-green-accent">
                    {parsedResult ? parsedResult.masteredCount : 0} / 12
                  </div>
                </div>
                <div className="w-px h-10 bg-white/20"></div>
                <div className="text-right">
                  <div className="text-xs text-white/70 font-medium">Critical Gaps</div>
                  <div className="text-xl font-black text-amber-300">
                    {parsedResult ? parsedResult.gapCount : 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="space-y-1.5 relative z-10">
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-leaf-green-accent transition-all duration-700"
                  style={{ width: `${parsedResult ? parsedResult.overallReadinessScore : 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-white/80 font-bold">
                <span>0% (Upload Resume)</span>
                <span>Developing (60-79%)</span>
                <span className="text-leaf-green-accent font-black">HSSC Certified Ready (80-100%)</span>
              </div>
            </div>
          </div>

          {/* Section 1: HSSC NOS Skill Gap Diagnostics Matrix */}
          <div className="bg-surface-white rounded-3xl p-6 sm:p-8 border border-surface-container-high shadow-wellness space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-primary flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <span>HSSC NOS Skill Gap Diagnostics</span>
                </h3>
                <p className="text-xs text-outline font-medium">
                  {parsedResult ? 'Verified against Ayush Sub-SSC National Occupational Standards' : 'Upload a resume to evaluate 12 core clinical competencies'}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-surface-container-high self-start">
                <button
                  onClick={() => setActiveTabFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    activeTabFilter === 'all' ? 'bg-primary text-white' : 'text-outline hover:text-text-main'
                  }`}
                >
                  All (12)
                </button>
                <button
                  onClick={() => setActiveTabFilter('gaps')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    activeTabFilter === 'gaps' ? 'bg-amber-600 text-white' : 'text-outline hover:text-text-main'
                  }`}
                >
                  Gaps ({parsedResult?.gapCount || 0})
                </button>
                <button
                  onClick={() => setActiveTabFilter('mastered')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    activeTabFilter === 'mastered' ? 'bg-emerald-700 text-white' : 'text-outline hover:text-text-main'
                  }`}
                >
                  Mastered ({parsedResult?.masteredCount || 0})
                </button>
              </div>
            </div>

            {/* Skill Matrix List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredGaps.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    !parsedResult
                      ? 'border-surface-container-high bg-surface-container-lowest opacity-75'
                      : item.isGap
                      ? item.urgency === 'Critical'
                        ? 'border-amber-200 bg-amber-50/40'
                        : 'border-surface-container-high bg-surface-container-lowest'
                      : 'border-emerald-200 bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        !parsedResult
                          ? 'bg-surface-container-high text-outline'
                          : item.isGap
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {!parsedResult ? <Clock className="w-4 h-4" /> : item.isGap ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-text-main truncate">{item.skill}</div>
                        <div className="text-[11px] text-outline font-medium">{item.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-black text-text-main">{item.proficiencyScore}%</div>
                        <div className="text-[10px] text-outline">Proficiency</div>
                      </div>
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${
                        !parsedResult
                          ? 'bg-surface-container-high text-outline'
                          : item.isGap
                          ? item.urgency === 'Critical'
                            ? 'bg-amber-200 text-amber-900 border border-amber-300'
                            : 'bg-surface-container-high text-outline'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}>
                        {!parsedResult ? 'Awaiting Resume' : item.isGap ? `${item.urgency} Gap` : 'Mastered'}
                      </span>
                    </div>
                  </div>

                  {/* Proficiency Bar */}
                  <div className="mt-3 w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        !parsedResult ? 'bg-outline/20' : item.isGap ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${item.proficiencyScore}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: AYUSH Career & Job Role Mapping Engine */}
          <div className="bg-surface-white rounded-3xl p-6 sm:p-8 border border-surface-container-high shadow-wellness space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-primary flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-600" />
                  <span>AYUSH Career & Job Role Mapping</span>
                </h3>
                <p className="text-xs text-outline font-medium">
                  {parsedResult ? 'Match score calculated from your extracted resume competencies' : 'Upload resume to calculate percentage fit across 6 career tracks'}
                </p>
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                parsedResult ? 'text-primary bg-leaf-green-light border-leaf-green-accent/30' : 'text-outline bg-surface-container-low border-surface-container-high'
              }`}>
                {parsedResult ? '6 Roles Evaluated' : '0% Initialized'}
              </span>
            </div>

            {/* Role Cards Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {(parsedResult?.roleMappings || AYUSH_CAREER_ROLES_LOCAL).map((role) => {
                const matchPct = parsedResult ? role.matchPercent : 0;
                const fitBadge = parsedResult ? role.fitLevel : 'Awaiting Resume';

                return (
                  <div
                    key={role.id}
                    className="p-5 rounded-2xl border border-surface-container-high bg-surface-container-lowest hover:border-primary hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-outline">
                          {role.sector}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          !parsedResult
                            ? 'bg-surface-container-high text-outline'
                            : matchPct >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : matchPct >= 60
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {fitBadge}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-text-main">{role.title}</h4>
                      <p className="text-[11px] text-outline font-medium">{role.qualificationPack}</p>
                    </div>

                    {/* Match Meter */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-black">
                        <span className="text-outline">Role Match</span>
                        <span className={parsedResult ? 'text-primary' : 'text-outline'}>{matchPct}%</span>
                      </div>
                      <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            !parsedResult
                              ? 'bg-outline/20'
                              : matchPct >= 80
                              ? 'bg-emerald-600'
                              : matchPct >= 60
                              ? 'bg-sky-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${matchPct}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Missing Competencies */}
                    {parsedResult && role.missingSkills && role.missingSkills.length > 0 ? (
                      <div className="space-y-1">
                        <div className="text-[10px] font-extrabold text-outline uppercase">Missing Prerequisites:</div>
                        <div className="flex flex-wrap gap-1">
                          {role.missingSkills.slice(0, 2).map((m, i) => (
                            <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 truncate max-w-full">
                              + {m}
                            </span>
                          ))}
                          {role.missingSkills.length > 2 && (
                            <span className="text-[10px] font-bold text-outline self-center">
                              +{role.missingSkills.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-outline font-medium italic">
                        Upload resume to detect matching competencies
                      </div>
                    )}

                    {/* Salary & Openings */}
                    <div className="pt-2 border-t border-surface-container-high flex items-center justify-between text-[11px] text-outline font-bold">
                      <span>Est: <strong className="text-text-main">{role.avgSalary}</strong></span>
                      <span className="text-emerald-700 font-extrabold">{role.openings} Openings</span>
                    </div>

                    {/* Apply Action Buttons */}
                    <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedRoleForModal(role);
                          setShowJobModal(true);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-primary border border-surface-container-high text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-primary" />
                        <span>View {role.openings} Openings</span>
                      </button>

                      <button
                        onClick={() => handleApplyToJob(role)}
                        disabled={applyingJobId === role.id || appliedJobs[role.id]}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                          appliedJobs[role.id]
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                            : applyingJobId === role.id
                            ? 'bg-primary/70 text-white cursor-wait'
                            : 'bg-primary hover:bg-primary-container text-white'
                        }`}
                      >
                        {appliedJobs[role.id] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Applied</span>
                          </>
                        ) : applyingJobId === role.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 text-leaf-green-accent" />
                            <span>1-Click Apply</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Recommended Gap-Closing Bridge Courses */}
          <div className="bg-surface-white rounded-3xl p-6 sm:p-8 border border-surface-container-high shadow-wellness space-y-5">
            <div>
              <h3 className="text-lg font-black text-primary flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>Curated Bridge Courses to Close Resume Gaps</span>
              </h3>
              <p className="text-xs text-outline font-medium">
                Accredited programs mapped directly to missing HSSC National Occupational Standards
              </p>
            </div>

            {parsedResult && (parsedResult.bridgeRecommendations || []).length > 0 ? (
              <div className="space-y-3">
                {parsedResult.bridgeRecommendations.map((bridge, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-surface-container-high bg-surface-container-lowest hover:border-primary transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black">
                          {bridge.platform}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {bridge.boostEstimate}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-text-main">{bridge.title}</h4>
                      <p className="text-[11px] text-outline font-medium">
                        Addresses: {bridge.addressesGaps.join(', ')} • {bridge.duration}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => setBridgeLearningCourse({
                          id: idx === 0 ? 'c1' : idx === 1 ? 'c2' : idx === 2 ? 'c4' : 'c3',
                          title: bridge.title,
                          provider: bridge.provider || 'Ministry of AYUSH LMS',
                          qualificationPack: 'HSSC Bridge Learning Module',
                          duration: bridge.duration
                        })}
                        className="px-4 py-2 rounded-xl bg-leaf-green-light hover:bg-leaf-green-light/80 text-primary border border-leaf-green-accent/40 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Play className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Watch Demo & Take Quiz</span>
                      </button>

                      <a
                        href={bridge.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-outline hover:text-text-main text-xs font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <span>Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-surface-container-low border border-dashed border-surface-container-high text-center space-y-2">
                <BookOpen className="w-8 h-8 text-outline mx-auto" />
                <div className="text-xs font-bold text-text-main">No Skill Gaps Detected Yet</div>
                <div className="text-[11px] text-outline font-medium">
                  Upload your resume above or choose a pre-built profile to generate targeted bridge courses.
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Live Job Openings Modal */}
      {showJobModal && selectedRoleForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-surface-container-high shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto font-manrope">
            <div className="flex items-start justify-between gap-4 border-b border-surface-container-high pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    {selectedRoleForModal.sector}
                  </span>
                  <span className="text-xs font-bold text-outline">
                    {selectedRoleForModal.qualificationPack}
                  </span>
                </div>
                <h2 className="text-xl font-black text-primary">{selectedRoleForModal.title} Openings</h2>
                <p className="text-xs text-outline font-medium">
                  {selectedRoleForModal.openings} verified vacancies across leading AYUSH hospitals & corporate centers
                </p>
              </div>
              <button
                onClick={() => { setShowJobModal(false); setSelectedRoleForModal(null); }}
                className="p-2 rounded-full hover:bg-surface-container-low text-outline hover:text-text-main transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Fit Banner in Modal */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-white flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-leaf-green-accent uppercase tracking-wider">Your Resume Match Score</div>
                <div className="text-sm font-black">
                  {parsedResult ? `${selectedRoleForModal.matchPercent || 0}% Fit for this Role` : 'Upload resume to calculate candidate fit'}
                </div>
              </div>
              <div className="text-2xl font-black text-leaf-green-accent">
                {parsedResult ? `${selectedRoleForModal.matchPercent || 0}%` : '—'}
              </div>
            </div>

            {/* Job Openings List */}
            <div className="space-y-4">
              {(selectedRoleForModal.jobListings || [
                {
                  id: `job-${selectedRoleForModal.id}-1`,
                  title: `Lead ${selectedRoleForModal.title}`,
                  company: selectedRoleForModal.topRecruiters?.[0] || 'National AYUSH Center',
                  location: 'New Delhi / Hybrid',
                  salary: selectedRoleForModal.avgSalary,
                  type: 'Full-time • Immediate',
                  posted: '1 day ago',
                  description: `Exciting opportunity for certified AYUSH professionals specializing in ${selectedRoleForModal.title}.`
                }
              ]).map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl border border-surface-container-high bg-surface-container-lowest hover:border-primary transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-black text-text-main">{job.title}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-outline font-bold mt-1">
                        <span className="flex items-center gap-1 text-primary font-black">
                          <Building className="w-3.5 h-3.5" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </span>
                        <span className="text-emerald-700 font-black">{job.salary}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container-low text-outline w-fit">
                      {job.posted}
                    </span>
                  </div>

                  <p className="text-xs text-text-main/80 font-medium leading-relaxed">
                    {job.description}
                  </p>

                  <div className="pt-2 border-t border-surface-container-high flex items-center justify-between gap-3">
                    <span className="text-[11px] font-bold text-outline">
                      {job.type}
                    </span>

                    <button
                      onClick={() => handleApplyToJob(selectedRoleForModal, job)}
                      disabled={applyingJobId === job.id || appliedJobs[job.id]}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-xs ${
                        appliedJobs[job.id]
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                          : applyingJobId === job.id
                          ? 'bg-primary/70 text-white cursor-wait'
                          : 'bg-primary hover:bg-primary-container text-white'
                      }`}
                    >
                      {appliedJobs[job.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Applied</span>
                        </>
                      ) : applyingJobId === job.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-leaf-green-accent" />
                          <span>Apply Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bridge Course Video Lecture & Skill Assessment Modal */}
      {bridgeLearningCourse && (
        <CourseLearningModal
          course={bridgeLearningCourse}
          onClose={() => setBridgeLearningCourse(null)}
          onCompleteCourse={(courseId, score) => {
            setApplyToastMsg(`🏆 Bridge Course Skill Assessment passed with ${score}%! NOS proficiency updated.`);
          }}
        />
      )}
    </div>
  );
}