import React, { useState } from 'react';
import {
  X, Play, Award, CheckCircle2, AlertCircle, Sparkles, BookOpen,
  ChevronRight, RefreshCw, HelpCircle, ShieldCheck, ExternalLink,
  Volume2, Clock, FileText, Check, Trophy
} from 'lucide-react';

// Comprehensive course syllabus with authentic YouTube videos & HSSC Skill Assessment MCQs
export const COURSE_MODULES_MAP = {
  c1: {
    id: 'c1',
    title: 'Panchakarma Therapy: Complete Clinical Protocol',
    provider: 'National Institute of Ayurveda (NIA), Jaipur',
    qualificationPack: 'HSS/Q5701 (Panchakarma Paricharaka)',
    youtubeEmbedId: 'Y4f9q7Pz0-A',
    youtubeFallbackUrl: 'https://www.youtube.com/watch?v=Y4f9q7Pz0-A',
    description: 'Learn step-by-step clinical execution of authentic Panchakarma therapies: Snehana, Swedana, Vamana, Virechana, and Basti setups under standardized NCISM guidelines.',
    duration: '6 Weeks (Self-paced)',
    lessonsCount: 24,
    skillsAwarded: ['Panchakarma Procedure Execution', 'Abhyanga & Swedana', 'Kati/Janu Basti Setup'],
    xpAward: 150,
    mcqQuestions: [
      {
        id: 1,
        question: 'Which of the following is considered the primary Purvakarma (preparatory procedure) before Vamana or Virechana?',
        options: [
          'Direct Basti Administration',
          'Snehana (Oleation) and Swedana (Sudation)',
          'Nasya with Teekshna taila',
          'Immediate Shirodhara'
        ],
        correctIndex: 1,
        explanation: 'Snehana (internal/external oleation) followed by Swedana (sudation) mobilizes deep-seated toxins (Doshas) to the Koshtha for elimination.'
      },
      {
        id: 2,
        question: 'What is the optimal patient positioning and oil temperature monitoring protocol during Kati Basti?',
        options: [
          'Supine posture with boiling herbal decoction',
          'Prone posture with lukewarm medicated oil (approx. 38-40°C) retained in black gram dough ring',
          'Standing posture with cold sesame oil',
          'Lateral recumbent position without any dough containment'
        ],
        correctIndex: 1,
        explanation: 'Kati Basti requires the patient in a prone position with lukewarm medicated oil retained within a leakproof Masha (black gram) dough ring.'
      },
      {
        id: 3,
        question: 'Which vital sign must be continuously logged during and immediately after standard Vamana therapy?',
        options: [
          'Only skin temperature',
          'Blood pressure, pulse rate, respiration, and Vega count (number of bouts)',
          'Serum bilirubin hourly',
          'No vital logging is needed'
        ],
        correctIndex: 1,
        explanation: 'Clinical protocol demands meticulous logging of BP, pulse, respiration, and Antiki/Vega criteria to assess Shuddhi lakshana and prevent dehydration.'
      }
    ]
  },
  c2: {
    id: 'c2',
    title: 'Ayurvedic Pharmacology & Dravyaguna Standardization',
    provider: 'All India Institute of Ayurveda (AIIA), New Delhi',
    qualificationPack: 'HSS/Q5704 (Ayush QC Associate)',
    youtubeEmbedId: '1vRz1cR7Gek',
    youtubeFallbackUrl: 'https://www.youtube.com/watch?v=1vRz1cR7Gek',
    description: 'Master classical extraction techniques, Kashaya decoction ratios (1:16 boiled down to 1/4th), TLC fingerprinting, and WHO-GMP manufacturing compliance.',
    duration: '4 Weeks',
    lessonsCount: 18,
    skillsAwarded: ['Ayurvedic Herbal Kashaya Preparation', 'Sterilization & Herbal Dravya Prep', 'Ayurvedic Pharmacology Basics'],
    xpAward: 120,
    mcqQuestions: [
      {
        id: 1,
        question: 'According to Sharangadhara Samhita, what is the classical water-to-herb ratio and reduction standard for Kashaya (Kwatha) preparation?',
        options: [
          '1 part herb to 2 parts water, reduce to 1/2',
          '1 part coarse herb (Yavakuta) to 16 parts water, reduce to 1/4th (Chaturbhaga)',
          '1 part powder to 4 parts milk, reduce to 1/8th',
          '10 parts herb to 10 parts water, no boiling'
        ],
        correctIndex: 1,
        explanation: 'The standard classical ratio for Kwatha kalpana is 1 part dry coarse herbal drug to 16 parts water, boiled down gently to one-fourth without covering the vessel.'
      },
      {
        id: 2,
        question: 'What is the permissible upper limit for microbial contamination and heavy metals testing under Ayush Pharmacopoeia standards?',
        options: [
          'No testing is required for classical formulations',
          'Heavy metals (Pb, Cd, As, Hg) and total microbial counts must strictly comply with Ayurvedic Pharmacopoeia of India (API) limits',
          'Only sugar content is measured',
          'Any quantity of pesticide residue is permitted'
        ],
        correctIndex: 1,
        explanation: 'API and WHO-GMP guidelines mandate strict quantitative limits on heavy metals (Lead < 10ppm, Arsenic < 3ppm) and absence of E. coli and Salmonella.'
      },
      {
        id: 3,
        question: 'Which Rasa (taste) and Vipaka are primarily associated with the anti-inflammatory herb Guduchi (Tinospora cordifolia)?',
        options: [
          'Tikta-Kashaya Rasa and Madhura Vipaka',
          'Amla Rasa and Katu Vipaka',
          'Lavana Rasa and Amla Vipaka',
          'Madhura Rasa and Guru Vipaka'
        ],
        correctIndex: 0,
        explanation: 'Guduchi is predominantly Tikta (bitter) and Kashaya (astringent) in taste with a Madhura (sweet) post-digestive effect (Vipaka) and Tridoshahara action.'
      }
    ]
  },
  c3: {
    id: 'c3',
    title: 'Clinical Yoga & Naturopathy for Ayush Practitioners',
    provider: 'Morarji Desai National Institute of Yoga (MDNIY), New Delhi',
    qualificationPack: 'HSS/Q2301 (Yoga Wellness Trainer)',
    youtubeEmbedId: 's2NQhpFGIOg',
    youtubeFallbackUrl: 'https://www.youtube.com/watch?v=s2NQhpFGIOg',
    description: 'Evidence-based Yogic therapy modules, disease-specific Asanas, Pranayama protocols, Naturopathic hydrotherapy, and YCB certification readiness.',
    duration: '3 Weeks',
    lessonsCount: 12,
    skillsAwarded: ['Therapeutic Yoga & Pranayama', 'Prakriti-Based Diet Planning', 'Client Assessment & Alignment'],
    xpAward: 100,
    mcqQuestions: [
      {
        id: 1,
        question: 'Which Pranayama protocol is clinically indicated for reducing autonomic arousal and lowering systolic blood pressure in hypertension patients?',
        options: [
          'Bhastrika at rapid pace',
          'Slow Bhramari Pranayama with extended Rechak (exhalation) and Nadisodhana',
          'Kapalabhati 120 strokes/min',
          'Surya Bhedana with Kumbhaka'
        ],
        correctIndex: 1,
        explanation: 'Slow, rhythmic Bhramari Pranayama stimulates parasympathetic tone via vagal activation, clinically reducing blood pressure and anxiety.'
      },
      {
        id: 2,
        question: 'In Naturopathic hydrotherapy, what physiological reaction is triggered by a cold compress applied over the abdomen?',
        options: [
          'Initial primary vasoconstriction followed by reactive hyperaemia (increased blood flow)',
          'Total cessation of GI motility',
          'Immediate hypothermia with no vascular response',
          'Excess bile stagnation'
        ],
        correctIndex: 0,
        explanation: 'Cold applications trigger primary local vasoconstriction, followed by compensatory local vasodilation and enhanced visceral circulation.'
      },
      {
        id: 3,
        question: 'Which dietary principle aligns with the Ayurvedic concept of Pathya in a Pitta-predominant metabolic disorder?',
        options: [
          'High spicy, pungent, fermented foods (Katu-Amla-Lavana)',
          'Cooling, sweet, bitter, and astringent foods (Madhura-Tikta-Kashaya) like Ghee and Shatavari',
          'Deep fried sour mustard oil curds at night',
          'Dry raw mustard seeds on empty stomach'
        ],
        correctIndex: 1,
        explanation: 'Pitta dosha is pacified by sweet (Madhura), bitter (Tikta), and astringent (Kashaya) tastes, while pungent, sour, and salty tastes aggravate it.'
      }
    ]
  },
  c4: {
    id: 'c4',
    title: 'AI & Digital Health Tools for Ayurveda Practitioners',
    provider: 'AyushConnect Digital Academy & NCISM',
    qualificationPack: 'HSS/Q8102 (Digital Health Ayush)',
    youtubeEmbedId: '7X8II6J-6mU',
    youtubeFallbackUrl: 'https://www.youtube.com/watch?v=7X8II6J-6mU',
    description: 'Learn remote EHR documentation, digital Prakriti assessment algorithms, Tele-Ayurveda consultation guidelines, and clinical safety compliance.',
    duration: '5 Weeks',
    lessonsCount: 20,
    skillsAwarded: ['Tele-Ayurveda Protocols', 'Clinical Documentation & Logging', 'Digital Health Diagnostics'],
    xpAward: 140,
    mcqQuestions: [
      {
        id: 1,
        question: 'Under the Telemedicine Practice Guidelines issued by the Ministry of AYUSH, which document must be digitally recorded for every remote patient consultation?',
        options: [
          'Only a verbal acknowledgement',
          'Patient explicit/implicit consent, registered Ayush practitioner ID, clinical notes, and standardized e-prescription',
          'No records are needed for online video calls',
          'Social media chat screenshot only'
        ],
        correctIndex: 1,
        explanation: 'Statutory guidelines mandate digital patient consent, RMP registration number, clinical logging, and standardized prescription format.'
      },
      {
        id: 2,
        question: 'How do AI-assisted clinical decision support tools support Ayurvedic practitioners without replacing clinical judgement?',
        options: [
          'By generating automated unverified drug cocktails',
          'By providing evidence-backed classical dosage recommendations, contraindication warnings, and Prakriti alignment cross-checks',
          'By eliminating the need for physical consultation completely',
          'By disabling practitioner review'
        ],
        correctIndex: 1,
        explanation: 'AI tools act as assistive co-pilots, cross-referencing Samhita formulations, drug-herb interactions, and patient vitals for practitioner validation.'
      },
      {
        id: 3,
        question: 'What is the primary standard for electronic health record (EHR) data security in Ayush telemedicine platforms?',
        options: [
          'Storing unencrypted patient files in public cloud buckets',
          'End-to-end encryption (AES-256) and compliance with ABDM (Ayushman Bharat Digital Mission) health data privacy standards',
          'Sharing medical records over open Telegram groups',
          'Plaintext email attachments'
        ],
        correctIndex: 1,
        explanation: 'ABDM compliance and AES-256 encryption guarantee patient data privacy and secure health information exchange.'
      }
    ]
  },
  c5: {
    id: 'c5',
    title: 'Kshara Sutra & Minimal Invasive Shalya Tantra',
    provider: 'BHU Institute of Medical Sciences, Varanasi',
    qualificationPack: 'HSS/Q5702 (Kshara Karma Technician)',
    youtubeEmbedId: 'kK7gXqA_oF0',
    youtubeFallbackUrl: 'https://www.youtube.com/watch?v=kK7gXqA_oF0',
    description: 'Standardize medicated thread preparation using Snuhi ksheera, Apamarga kshara, and Haridra churnam for Bhagandara (fistula-in-ano) management.',
    duration: '8 Weeks',
    lessonsCount: 32,
    skillsAwarded: ['Kshara Sutra Preparation & Standardization', 'Sterilization & Aseptic Technique', 'OT Sterilization & Shalya Protocols'],
    xpAward: 180,
    mcqQuestions: [
      {
        id: 1,
        question: 'What is the sequential coating formula for preparing classical Apamarga Kshara Sutra thread (Barbour linen thread No. 20)?',
        options: [
          '11 coatings of Snuhi latex, 7 coatings of Snuhi + Apamarga Kshara, 3 coatings of Snuhi + Haridra churna (Total 21 coatings)',
          '1 coating of honey and mustard oil only',
          '5 coatings of sugar syrup and turmeric',
          '10 coatings of alcohol and salt'
        ],
        correctIndex: 0,
        explanation: 'Standardized Kshara Sutra requires 11 coats of Snuhi Ksheera, 7 coats of Snuhi + Apamarga Kshara, and 3 coats of Snuhi + Haridra Churna in a Kshara Sutra cabinet.'
      },
      {
        id: 2,
        question: 'Why is Haridra (Curcuma longa) powder used as the final coating layers in Kshara Sutra preparation?',
        options: [
          'Only for adding yellow coloration',
          'For potent antiseptic, wound-healing, anti-inflammatory properties, and smoothing thread texture',
          'To make the thread dissolve in 5 minutes',
          'To increase moisture retention'
        ],
        correctIndex: 1,
        explanation: 'Haridra provides antibacterial barrier, neutralizes excess caustic irritation from the alkaline Kshara, and promotes healthy tissue granulation.'
      },
      {
        id: 3,
        question: 'Which sterilization method is standard for autoclave equipment used in Shalya Tantra minor OT setups?',
        options: [
          'Washing with cold tap water only',
          'Moist heat autoclaving at 121°C (15 psi) for at least 15-20 minutes',
          'Wiping with dry cloth',
          'Sun drying for 10 minutes'
        ],
        correctIndex: 1,
        explanation: 'Steam under pressure (autoclave at 121°C for 20 mins) is the benchmark standard for surgical instrument sterilization to prevent nosocomial infections.'
      }
    ]
  },
  c6: {
    id: 'c6',
    title: 'Sterilization & Aseptic Technique in Ayurveda Practice',
    provider: 'National Commission for Indian System of Medicine (NCISM)',
    qualificationPack: 'HSS/Q8201 (Clinical Research Protocol)',
    youtubeEmbedId: 's2NQhpFGIOg',
    youtubeFallbackUrl: 'https://www.youtube.com/watch?v=s2NQhpFGIOg',
    description: 'Infection prevention, herbal drug preparation hygiene, aseptic therapy equipment sterilization, and clinical patient safety protocols.',
    duration: '2 Weeks',
    lessonsCount: 8,
    skillsAwarded: ['Sterilization & Aseptic Technique', 'Patient Vital Signs Monitoring', 'Clinical Documentation & Logging'],
    xpAward: 90,
    mcqQuestions: [
      {
        id: 1,
        question: 'What is the recommended protocol for disinfecting wooden Droni tables used for daily Panchakarma Abhyanga?',
        options: [
          'Leave unwashed with leftover oil for 1 week',
          'Thorough cleaning with hot herbal decoction/detergent, wiping with hospital-grade disinfectant, and ultraviolet room sanitization',
          'Spray with cold water only',
          'Apply fresh raw oil immediately without wiping'
        ],
        correctIndex: 1,
        explanation: 'Wooden Droni requires hot water degreasing, hospital-grade disinfectant wiping, and periodic UV sanitization to prevent bacterial contamination.'
      },
      {
        id: 2,
        question: 'How should single-use Matra Basti catheter tubes and disposable gloves be handled after clinical therapy?',
        options: [
          'Washed and reused on next patient',
          'Segregated into designated Biomedical Waste (BMW) color-coded bins and disposed as per BMW Management Rules 2016',
          'Thrown into open general dustbins',
          'Flushed into standard drains'
        ],
        correctIndex: 1,
        explanation: 'Disposable medical items must be categorized into Red/Yellow BMW containers and autoclaved/shredded per statutory biomedical waste guidelines.'
      },
      {
        id: 3,
        question: 'What constitutes the WHO 5 Moments for Hand Hygiene for Ayush healthcare personnel?',
        options: [
          'Only before leaving hospital in the evening',
          'Before touching patient, before clean/aseptic procedure, after body fluid exposure, after touching patient, and after touching patient surroundings',
          'Only when hands are visibly muddy',
          'Once a week during audits'
        ],
        correctIndex: 1,
        explanation: 'The WHO 5 Moments define key infection prevention checkpoints before and after clinical contact with patients and equipment.'
      }
    ]
  }
};

export default function CourseLearningModal({ course, onClose, onCompleteCourse }) {
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'assessment' | 'certificate'
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isPassed, setIsPassed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!course) return null;

  // Resolve course module data with safe fallbacks
  const moduleData = COURSE_MODULES_MAP[course.id] || {
    id: course.id,
    title: course.title,
    provider: course.provider || 'Ayush National Institute',
    qualificationPack: course.tag || 'HSS/Q5701 (Ayush Qualification Pack)',
    youtubeEmbedId: 'Y4f9q7Pz0-A',
    youtubeFallbackUrl: 'https://www.youtube.com/watch?v=Y4f9q7Pz0-A',
    description: 'Comprehensive clinical modules, procedures demonstration, and HSSC Skill Assessment test.',
    duration: course.duration || '4 Weeks',
    lessonsCount: course.lessons || 16,
    skillsAwarded: course.skills || ['Panchakarma Procedure Execution', 'Patient Vital Signs Monitoring'],
    xpAward: 100,
    mcqQuestions: [
      {
        id: 1,
        question: `What is the key clinical standard required for ${course.title}?`,
        options: [
          'Adherence to Ministry of AYUSH & NCISM clinical practice guidelines',
          'Unverified random therapy',
          'Skipping patient history taking',
          'No aseptic equipment preparation'
        ],
        correctIndex: 0,
        explanation: 'All clinical procedures require strict adherence to standard operating procedures (SOPs) and safety protocols.'
      },
      {
        id: 2,
        question: 'Which documentation is critical following clinical therapy administration?',
        options: [
          'No documentation needed',
          'Patient vitals, procedure duration, herbal formulation batch, and post-therapy observations',
          'Only oral notification to peer',
          'Social media check-in'
        ],
        correctIndex: 1,
        explanation: 'Meticulous therapy logging ensures patient safety, continuity of care, and medicolegal compliance.'
      }
    ]
  };

  const questions = moduleData.mcqQuestions;

  const handleSelectOption = (qIndex, optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [qIndex]: optionIndex
    }));
  };

  const handleGradeAssessment = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / questions.length) * 100);
    setScore(percent);
    setIsSubmitted(true);
    const passed = percent >= 60;
    setIsPassed(passed);

    if (passed && onCompleteCourse) {
      onCompleteCourse(course.id, percent);
    }
  };

  const handleClaimCertificate = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setIsSaving(false);
    setActiveTab('certificate');
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setIsPassed(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === questions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-surface-white rounded-3xl max-w-4xl w-full border border-surface-container-high shadow-2xl overflow-hidden flex flex-col max-h-[92vh] font-manrope">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-surface-container-high bg-surface-container-lowest flex items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                {moduleData.qualificationPack}
              </span>
              <span className="text-xs text-outline font-bold truncate">
                {moduleData.provider}
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-primary truncate">
              {moduleData.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-high text-outline hover:text-text-main transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 sm:px-6 pt-3 bg-surface-container-lowest border-b border-surface-container-high">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-black border-b-2 transition-all ${
              activeTab === 'video'
                ? 'border-primary text-primary'
                : 'border-transparent text-outline hover:text-text-main'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>1. Video Lecture & Clinical Demo</span>
          </button>

          <button
            onClick={() => setActiveTab('assessment')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-black border-b-2 transition-all ${
              activeTab === 'assessment'
                ? 'border-primary text-primary'
                : 'border-transparent text-outline hover:text-text-main'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>2. HSSC Skill Assessment Quiz</span>
            {isSubmitted && isPassed && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          {isPassed && (
            <button
              onClick={() => setActiveTab('certificate')}
              className={`flex items-center gap-2 pb-3 px-3 text-xs font-black border-b-2 transition-all ${
                activeTab === 'certificate'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-outline hover:text-text-main'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>3. Verified Certificate</span>
            </button>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* ── TAB 1: VIDEO LECTURE ────────────────────────────────────────── */}
          {activeTab === 'video' && (
            <div className="space-y-6">
              
              {/* Responsive Embedded YouTube Player */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-surface-container-high" style={{ paddingTop: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${moduleData.youtubeEmbedId}?rel=0&modestbranding=1&enablejsapi=1`}
                  title={moduleData.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Video Info & Key Takeaways */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-3">
                  <h3 className="text-sm font-black text-text-main">Clinical Lesson Overview</h3>
                  <p className="text-xs text-text-main/80 font-medium leading-relaxed">
                    {moduleData.description}
                  </p>
                  
                  <div className="space-y-1.5 pt-2">
                    <div className="text-[11px] font-black text-outline uppercase tracking-wider">Competencies Imparted:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {moduleData.skillsAwarded.map((sk, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container-high space-y-3.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-xs font-black text-primary flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span>Earn {moduleData.xpAward} XP + Badge</span>
                    </div>
                    <div className="text-[11px] text-outline font-medium">
                      Watch the full lecture demo, then complete the 3-question MCQ quiz to verify your HSSC competency.
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('assessment')}
                    className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Proceed to Assessment</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: MCQ SKILL ASSESSMENT QUIZ ────────────────────────────── */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              
              {/* Assessment Top Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                      HSSC NOS Level 4/5 Assessment
                    </span>
                    <span className="text-xs font-bold text-leaf-green-accent">
                      Passing Score: 60%
                    </span>
                  </div>
                  <h3 className="text-base font-black mt-0.5">Clinical Knowledge & SOP Verification</h3>
                </div>

                {isSubmitted && (
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-white/80">Your Score</div>
                      <div className={`text-xl font-black ${isPassed ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {score}%
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                      isPassed ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-black'
                    }`}>
                      {isPassed ? 'PASSED 🎉' : 'RETRY NEEDED'}
                    </span>
                  </div>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-5">
                {questions.map((q, qIndex) => {
                  const selected = selectedAnswers[qIndex];
                  const hasAnswered = selected !== undefined;
                  const isCorrect = isSubmitted && selected === q.correctIndex;
                  const isWrong = isSubmitted && hasAnswered && selected !== q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
                        isSubmitted
                          ? isCorrect
                            ? 'border-emerald-300 bg-emerald-50/40'
                            : 'border-amber-300 bg-amber-50/30'
                          : 'border-surface-container-high bg-surface-container-lowest'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-xs sm:text-sm font-black text-text-main leading-snug">
                          <span className="text-primary font-black mr-1.5">Q{qIndex + 1}.</span>
                          {q.question}
                        </h4>

                        {isSubmitted && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                            isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isCorrect ? 'Correct +1' : 'Incorrect'}
                          </span>
                        )}
                      </div>

                      {/* Options Grid */}
                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => {
                          const isOptionSelected = selected === optIndex;
                          let optionStyle = 'border-surface-container-high bg-surface-container-low hover:border-primary hover:bg-white text-text-main';

                          if (isSubmitted) {
                            if (optIndex === q.correctIndex) {
                              optionStyle = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-black';
                            } else if (isOptionSelected && optIndex !== q.correctIndex) {
                              optionStyle = 'border-red-400 bg-red-100 text-red-950';
                            } else {
                              optionStyle = 'border-surface-container-high bg-surface-container-low opacity-60 text-outline';
                            }
                          } else if (isOptionSelected) {
                            optionStyle = 'border-primary bg-primary/10 text-primary font-black ring-1 ring-primary';
                          }

                          return (
                            <button
                              key={optIndex}
                              type="button"
                              onClick={() => handleSelectOption(qIndex, optIndex)}
                              disabled={isSubmitted}
                              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                                  isOptionSelected ? 'bg-primary text-white' : 'bg-surface-container-high text-outline'
                                }`}>
                                  {String.fromCharCode(65 + optIndex)}
                                </span>
                                <span>{opt}</span>
                              </div>

                              {isSubmitted && optIndex === q.correctIndex && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation box after submission */}
                      {isSubmitted && q.explanation && (
                        <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high text-[11px] text-text-main font-medium space-y-1">
                          <strong className="text-primary font-black">Clinical Rationale: </strong>
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Assessment Action Bar */}
              <div className="pt-3 border-t border-surface-container-high flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-outline font-medium">
                  {isSubmitted
                    ? isPassed
                      ? '🎉 Congratulations! You met the 60% competency threshold.'
                      : 'You scored below 60%. Review the explanations and retake the quiz.'
                    : `Answered ${answeredCount} of ${questions.length} questions.`}
                </div>

                <div className="flex items-center gap-2.5">
                  {isSubmitted ? (
                    <>
                      <button
                        onClick={handleRetake}
                        className="px-4 py-2.5 rounded-xl border border-surface-container-high text-outline hover:text-text-main text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retake Quiz</span>
                      </button>

                      {isPassed && (
                        <button
                          onClick={handleClaimCertificate}
                          disabled={isSaving}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <Trophy className="w-4 h-4 text-yellow-300" />
                          <span>{isSaving ? 'Issuing...' : 'Claim HSSC Certificate'}</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={handleGradeAssessment}
                      disabled={!isAllAnswered}
                      className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-sm ${
                        isAllAnswered
                          ? 'bg-primary hover:bg-primary-container text-white cursor-pointer'
                          : 'bg-surface-container-high text-outline cursor-not-allowed'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>Submit Assessment</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ── TAB 3: VERIFIED CERTIFICATE ─────────────────────────────────── */}
          {activeTab === 'certificate' && isPassed && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              
              {/* Certificate Card Preview */}
              <div className="p-6 sm:p-8 rounded-3xl border-4 border-emerald-500/40 bg-gradient-to-br from-emerald-50 via-white to-leaf-green-light text-center space-y-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-2 right-2 text-emerald-100 pointer-events-none">
                  <ShieldCheck className="w-32 h-32 opacity-20" />
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-black uppercase tracking-widest text-emerald-800">
                    National Health Sector Skill Council • Ministry of AYUSH
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-primary">
                    Certificate of Competency Completion
                  </h2>
                  <p className="text-xs text-outline font-medium">
                    This certifies that the candidate has successfully cleared the clinical video lecture & verified NOS assessment
                  </p>
                </div>

                <div className="py-3 border-y border-emerald-200/60 max-w-md mx-auto space-y-1">
                  <div className="text-base font-black text-text-main">{moduleData.title}</div>
                  <div className="text-xs font-bold text-emerald-800">{moduleData.qualificationPack}</div>
                  <div className="text-[11px] text-outline font-medium">Issued by {moduleData.provider}</div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-text-main pt-2">
                  <div className="flex items-center gap-1 text-emerald-700 font-black">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Score: {score}% (Verified)</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-black">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span>+{moduleData.xpAward} XP Added</span>
                  </div>
                  <div className="text-outline">
                    Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Post-Completion Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-outline font-medium">
                  ✅ Your live profile skills & HSSC readiness score have been automatically updated!
                </div>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-black hover:bg-primary-container transition-all shadow-sm"
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
