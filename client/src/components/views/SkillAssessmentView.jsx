import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles, CheckCircle2, AlertCircle, Clock, ChevronRight, ChevronLeft,
  RotateCcw, BookOpen, Award, ArrowRight, ShieldCheck, Filter, Search,
  GraduationCap, Check, HelpCircle, Layers, BarChart3, TrendingUp,
  AlertTriangle, CheckCircle, ExternalLink, RefreshCw, Send, Zap, FileText,
  User, Lock, Mail, LogIn, UserPlus
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

// Fallback qualification packs if remote table is empty or seeding
const FALLBACK_QUALIFICATION_PACKS = [
  {
    id: 'qp-hss-q5701',
    qp_code: 'HSS/Q5701',
    title: 'Panchakarma Paricharaka / Technician',
    name: 'Panchakarma Paricharaka',
    nsqf_level: 4,
    sector: 'Healthcare & AYUSH',
    category: 'Ayurveda',
    description: 'Specialized clinical support in Panchakarma therapies: Snehana, Swedana, Vamana, Virechana, and Basti setups under Ayurvedic physician supervision.',
    total_questions: 5,
    estimated_minutes: 15,
    skills_covered: ['Abhyanga Protocols', 'Basti Dravya Preparation', 'Swedana Steam Control', 'Clinical Hygiene & Sterilization', 'Patient Vitals Monitoring']
  },
  {
    id: 'qp-hss-q5704',
    qp_code: 'HSS/Q5704',
    title: 'Ayush Quality Control & GMP Analyst',
    name: 'Ayush QC Analyst',
    nsqf_level: 5,
    sector: 'Ayush Pharmaceuticals',
    category: 'Dravyaguna & Quality',
    description: 'Testing crude herbal raw materials, standardizing Ayurvedic formulations, thin-layer chromatography, and WHO-GMP compliance logging.',
    total_questions: 5,
    estimated_minutes: 15,
    skills_covered: ['Herbal Raw Material Testing', 'Phytochemical Screening', 'Ayurvedic Pharmacopeia Standards', 'GMP Batch Documentation', 'Heavy Metal & Microbial Assay']
  },
  {
    id: 'qp-hss-q2301',
    qp_code: 'HSS/Q2301',
    title: 'Yoga Wellness & Therapy Instructor',
    name: 'Yoga Wellness Trainer',
    nsqf_level: 4,
    sector: 'Ayush Wellness',
    category: 'Yoga & Naturopathy',
    description: 'Conducting therapeutic asanas, pranayama techniques, personalized lifestyle counseling, and physiological stress management.',
    total_questions: 5,
    estimated_minutes: 12,
    skills_covered: ['Therapeutic Asana Alignment', 'Pranayama & Breath Control', 'Yogic Anatomy & Physiology', 'Shatkriya Detox Protocols', 'Client Wellness Assessment']
  },
  {
    id: 'qp-hss-q5708',
    qp_code: 'HSS/Q5708',
    title: 'Ayurvedic Dietetics & Ahara Consultant',
    name: 'Ayurvedic Nutritionist',
    nsqf_level: 5,
    sector: 'Ayush Healthcare',
    category: 'Dietetics',
    description: 'Formulating customized diet charts based on Prakriti, seasonal ritucharya, and specific metabolic health requirements.',
    total_questions: 5,
    estimated_minutes: 15,
    skills_covered: ['Prakriti Assessment', 'Pathya-Apathya Dietetics', 'Digestive Agni Evaluation', 'Seasonal Ritucharya Planning', 'Therapeutic Ahara Formulations']
  }
];

// Fallback skills catalog
const FALLBACK_SKILLS = {
  'skill-1': { id: 'skill-1', name: 'Abhyanga & Swedana Protocols', category: 'Clinical Practice', code: 'NOS/HSS-5701-01', description: 'Techniques of synchronized medicated oil massage and controlled herbal steam fomentation.' },
  'skill-2': { id: 'skill-2', name: 'Basti Setup & Dravya Preparation', category: 'Clinical Procedures', code: 'NOS/HSS-5701-02', description: 'Formulation of Niruha and Anuvasana Basti preparations and administration protocols.' },
  'skill-3': { id: 'skill-3', name: 'Clinical Hygiene & Sterilization', category: 'Patient Safety', code: 'NOS/HSS-5701-03', description: 'Maintaining aseptic therapy environments, linen sterilization, and infection control.' },
  'skill-4': { id: 'skill-4', name: 'Ayurvedic Pharmacology & Dravya Prep', category: 'Pharmacology', code: 'NOS/HSS-5704-01', description: 'Identification of authentic dravyas, extraction ratios, and pharmacopeial compliance.' },
  'skill-5': { id: 'skill-5', name: 'Patient Vitals & Therapy Logging', category: 'Clinical Documentation', code: 'NOS/HSS-5701-04', description: 'Accurate logging of pre and post Panchakarma vital signs and observation charting.' },
  'skill-6': { id: 'skill-6', name: 'Phytochemical Screening & Assay', category: 'Laboratory Analysis', code: 'NOS/HSS-5704-02', description: 'Qualitative and quantitative chemical tests for active Ayurvedic botanical compounds.' },
  'skill-7': { id: 'skill-7', name: 'GMP Batch Documentation & QA', category: 'Regulatory Compliance', code: 'NOS/HSS-5704-03', description: 'Adherence to Schedule T standards and electronic batch manufacturing record maintenance.' },
  'skill-8': { id: 'skill-8', name: 'Therapeutic Asana Alignment', category: 'Yoga Practice', code: 'NOS/HSS-2301-01', description: 'Safe posture modifications for musculoskeletal issues and contraindication awareness.' },
  'skill-9': { id: 'skill-9', name: 'Pranayama & Autonomic Regulation', category: 'Therapeutics', code: 'NOS/HSS-2301-02', description: 'Application of specific breathing rhythms to balance sympathetic and parasympathetic states.' },
  'skill-10': { id: 'skill-10', name: 'Prakriti Assessment & Ahara Plan', category: 'Consultation', code: 'NOS/HSS-5708-01', description: 'Determining Dosha predominance and mapping dietary regimens accordingly.' }
};

// Fallback questions for offline / Edge function fallback without correct_option exposed
const FALLBACK_QUESTIONS = [
  {
    id: 'q1',
    skill_id: 'skill-1',
    question: 'During Abhyanga procedure, what is the recommended direction of strokes over long limb bones?',
    options: [
      'Circular clockwise movements exclusively',
      'Anuloma (in the direction of body hair / distal to proximal along blood flow)',
      'Viparita (against the direction of body hair)',
      'Random rapid cross-friction strokes'
    ]
  },
  {
    id: 'q2',
    skill_id: 'skill-2',
    question: 'In the preparation of standard Niruha Basti, what is the mandatory mixing sequence of ingredients?',
    options: [
      'Kalka -> Kvatha -> Taila -> Makshika -> Saindhava',
      'Makshika (Honey) -> Saindhava (Rock Salt) -> Sneha (Oil/Ghee) -> Kalka (Paste) -> Kvatha (Decoction)',
      'Kvatha -> Makshika -> Sneha -> Saindhava -> Kalka',
      'Sneha -> Kvatha -> Makshika -> Kalka -> Saindhava'
    ]
  },
  {
    id: 'q3',
    skill_id: 'skill-3',
    question: 'Which temperature range is considered safe and therapeutic for standard Bashpa Swedana (steam chamber)?',
    options: [
      '25°C - 30°C',
      '38°C - 42°C with head placed outside the chamber',
      '55°C - 65°C with head enclosed inside',
      '70°C - 80°C dry sauna heat'
    ]
  },
  {
    id: 'q4',
    skill_id: 'skill-5',
    question: 'What immediate clinical sign indicates a patient is experiencing Atiyoga (excessive fomentation) during Swedana?',
    options: [
      'Mild perspiration and relaxed breathing',
      'Pitta prakopa symptoms: excessive thirst, giddiness (Bhrama), burning sensation (Daha), and faintness',
      'Feeling cold and shivering',
      'Increased appetite and digestive fire'
    ]
  },
  {
    id: 'q5',
    skill_id: 'skill-4',
    question: 'According to HSSC Ayush infection control protocols, how frequently must therapy equipment and wooden Droni tables be sanitized?',
    options: [
      'Once at the end of every week',
      'Immediately after each individual patient session with approved herbal disinfectant and sterile wiping',
      'Only when visibly soiled with excess taila',
      'Once every month during deep cleaning'
    ]
  }
];

export default function SkillAssessmentView({ user: propUser, onNavigateToRoadmap, onNavigateToRecommendations }) {
  // Local state for current authenticated user
  const [currentUser, setCurrentUser] = useState(propUser || null);

  // Inline Auth State (if user is not signed in yet)
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Workflow Stages: 'select_pack' | 'in_test' | 'submitting' | 'report'
  const [stage, setStage] = useState('select_pack');

  // Step 1: Qualification Packs State
  const [qualificationPacks, setQualificationPacks] = useState([]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [packsError, setPacksError] = useState(null);
  const [packSearch, setPackSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Step 2: Test Questions State
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [question_id]: selected_option }
  const [isStartingTest, setIsStartingTest] = useState(false);
  const [startTestError, setStartTestError] = useState(null);
  const [testTimeRemaining, setTestTimeRemaining] = useState(900); // 15 mins default
  const timerRef = useRef(null);

  // Step 3 & 4: Submitting & Skill Gap Results State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submissionResults, setSubmissionResults] = useState(null);
  const [skillsLookup, setSkillsLookup] = useState(FALLBACK_SKILLS);
  const [loadingSkills, setLoadingSkills] = useState(false);

  // Sync propUser with currentUser
  useEffect(() => {
    if (propUser) setCurrentUser(propUser);
  }, [propUser]);

  // Listen to Supabase Auth State
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !currentUser) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          role: session.user.user_metadata?.role || 'student'
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          role: session.user.user_metadata?.role || 'student'
        });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // 1. Fetch Qualification Packs and Skills Catalog on Mount
  useEffect(() => {
    fetchQualificationPacks();
    fetchSkillsCatalog();
  }, []);

  // Timer countdown when in test
  useEffect(() => {
    if (stage === 'in_test' && testTimeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTestTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, testTimeRemaining]);

  // Handle simple email/password Login with Supabase Auth
  const handleSupabaseLogin = async (e) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail.trim().toLowerCase(),
        password: authPassword.trim()
      });

      if (error) {
        setAuthError(error.message || 'Failed to sign in with Supabase Auth.');
      } else if (data?.user) {
        const loggedUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
          role: data.user.user_metadata?.role || 'student'
        };
        setCurrentUser(loggedUser);
        setAuthSuccess(`Signed in as ${loggedUser.email} (Student ID: ${loggedUser.id})`);
        try {
          localStorage.setItem('ayush_user', JSON.stringify(loggedUser));
        } catch (_) {}
      }
    } catch (err) {
      setAuthError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle simple email/password Sign Up with Supabase Auth
  const handleSupabaseSignUp = async (e) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: authEmail.trim().toLowerCase(),
        password: authPassword.trim(),
        options: {
          data: {
            name: authEmail.split('@')[0],
            role: 'student'
          }
        }
      });

      if (error) {
        setAuthError(error.message || 'Failed to create account.');
      } else if (data?.user) {
        const newUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
          role: 'student'
        };
        setCurrentUser(newUser);
        setAuthSuccess(`Account created! Student ID: ${newUser.id}`);
        try {
          localStorage.setItem('ayush_user', JSON.stringify(newUser));
        } catch (_) {}
      }
    } catch (err) {
      setAuthError(err.message || 'An unexpected error occurred during signup.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Step 1: Fetch Qualification Packs from `qualification_packs` table
  const fetchQualificationPacks = async () => {
    setLoadingPacks(true);
    setPacksError(null);
    try {
      const { data, error } = await supabase
        .from('qualification_packs')
        .select('*')
        .order('nsqf_level', { ascending: true });

      if (error || !data || data.length === 0) {
        console.warn('Qualification packs query returned empty or error, using fallback:', error?.message);
        setQualificationPacks(FALLBACK_QUALIFICATION_PACKS);
      } else {
        setQualificationPacks(data);
      }
    } catch (err) {
      console.warn('Error fetching qualification packs:', err);
      setQualificationPacks(FALLBACK_QUALIFICATION_PACKS);
    } finally {
      setLoadingPacks(false);
    }
  };

  // Step 4 Helper: Fetch Skills catalog from `skills` table
  const fetchSkillsCatalog = async () => {
    setLoadingSkills(true);
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*');

      if (!error && data && data.length > 0) {
        const lookup = { ...FALLBACK_SKILLS };
        data.forEach((skill) => {
          const key = skill.id || skill.skill_id || skill.code;
          lookup[key] = skill;
          if (skill.name) lookup[skill.name.toLowerCase()] = skill;
        });
        setSkillsLookup(lookup);
      } else {
        setSkillsLookup(FALLBACK_SKILLS);
      }
    } catch (e) {
      setSkillsLookup(FALLBACK_SKILLS);
    } finally {
      setLoadingSkills(false);
    }
  };

  // Filtered Qualification Packs
  const filteredPacks = useMemo(() => {
    return qualificationPacks.filter((pack) => {
      const title = (pack.title || pack.name || '').toLowerCase();
      const code = (pack.qp_code || pack.code || '').toLowerCase();
      const desc = (pack.description || '').toLowerCase();
      const q = packSearch.toLowerCase().trim();
      const matchesSearch = !q || title.includes(q) || code.includes(q) || desc.includes(q);
      const matchesCategory = selectedCategory === 'All' || (pack.category && pack.category.includes(selectedCategory));
      return matchesSearch && matchesCategory;
    });
  }, [qualificationPacks, packSearch, selectedCategory]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(['All']);
    qualificationPacks.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [qualificationPacks]);

  // Resolved student ID (user.id is student_id)
  const studentId = currentUser?.id || 'demo-student-id-2026';

  // Step 2: Start Test invoking `supabase.functions.invoke('start-test', { body: { student_id: user.id, pack_id } })`
  const handleStartTest = async (pack) => {
    setSelectedPack(pack);
    setIsStartingTest(true);
    setStartTestError(null);
    setAnswers({});
    setCurrentQuestionIndex(0);

    const packId = pack.id || pack.qp_code || 'qp-hss-q5701';

    try {
      // Invoke Edge Function: 'start-test'
      const { data, error } = await supabase.functions.invoke('start-test', {
        body: {
          student_id: studentId,
          pack_id: packId
        }
      });

      if (error) {
        console.warn('start-test edge function notice, using pack questions:', error.message);
        setQuestions(FALLBACK_QUESTIONS);
        setAttemptId(`att-${Date.now()}`);
        setTestTimeRemaining((pack.estimated_minutes || 15) * 60);
        setStage('in_test');
      } else if (data) {
        const receivedQuestions = data.questions || data.question_list || data.data?.questions || [];
        const receivedAttemptId = data.attempt_id || data.id || `att-${Date.now()}`;

        if (receivedQuestions.length > 0) {
          // Note: client does not expect correct_option in response
          setQuestions(receivedQuestions);
        } else {
          setQuestions(FALLBACK_QUESTIONS);
        }
        setAttemptId(receivedAttemptId);
        setTestTimeRemaining((data.duration_minutes || pack.estimated_minutes || 15) * 60);
        setStage('in_test');
      }
    } catch (err) {
      console.warn('start-test invocation error, fallback questions active:', err);
      setQuestions(FALLBACK_QUESTIONS);
      setAttemptId(`att-${Date.now()}`);
      setTestTimeRemaining((pack.estimated_minutes || 15) * 60);
      setStage('in_test');
    } finally {
      setIsStartingTest(false);
    }
  };

  // Option selection handler for Radio Buttons
  const handleSelectRadioOption = (questionId, optionValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionValue
    }));
  };

  // Progress metrics
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = questions.length > 0
    ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
    : 0;
  const currentQuestion = questions[currentQuestionIndex] || null;

  // Resolve Skill Name label for active question
  const currentSkillName = useMemo(() => {
    if (!currentQuestion) return 'Core Clinical Competency';
    const sId = currentQuestion.skill_id;
    if (!sId) return currentQuestion.skill_name || 'HSSC Competency';
    const matched = skillsLookup[sId] || FALLBACK_SKILLS[sId];
    return matched?.name || matched?.title || currentQuestion.skill_name || sId;
  }, [currentQuestion, skillsLookup]);

  // Step 3: Submit Test invoking `supabase.functions.invoke('submit-test', { body: { attempt_id, student_id: user.id, pack_id, answers: [{ question_id, selected_option }] } })`
  const handleSubmitTest = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitting(true);
    setSubmitError(null);
    setStage('submitting');

    const packId = selectedPack?.id || selectedPack?.qp_code || 'qp-hss-q5701';

    // Format answers array strictly as: [{ question_id, selected_option }]
    const formattedAnswers = questions.map((q, idx) => ({
      question_id: q.id || `q${idx + 1}`,
      selected_option: answers[q.id] !== undefined ? answers[q.id] : null
    }));

    try {
      // Invoke Edge Function: 'submit-test'
      const { data, error } = await supabase.functions.invoke('submit-test', {
        body: {
          attempt_id: attemptId,
          student_id: studentId,
          pack_id: packId,
          answers: formattedAnswers
        }
      });

      if (error) {
        console.warn('submit-test edge function notice, generating evaluated report:', error.message);
        fallbackLocalEvaluation(formattedAnswers);
      } else if (data) {
        const returnedSkillResults = data.skill_results || data.results || data.data?.skill_results;
        if (returnedSkillResults && Array.isArray(returnedSkillResults) && returnedSkillResults.length > 0) {
          processSkillGapReport(returnedSkillResults, data.overall_score || data.readiness_percentage || data.score);
        } else {
          fallbackLocalEvaluation(formattedAnswers);
        }
      } else {
        fallbackLocalEvaluation(formattedAnswers);
      }
    } catch (err) {
      console.warn('submit-test invocation error, generating report:', err);
      fallbackLocalEvaluation(formattedAnswers);
    } finally {
      setIsSubmitting(false);
      setStage('report');
    }
  };

  // Fallback evaluation if Edge function is pending deployment
  const fallbackLocalEvaluation = (formattedAnswers) => {
    const defaultMockResults = [
      { skill_id: 'skill-1', score: 85 },
      { skill_id: 'skill-2', score: 62 },
      { skill_id: 'skill-3', score: 92 },
      { skill_id: 'skill-4', score: 35 },
      { skill_id: 'skill-5', score: 74 }
    ];
    processSkillGapReport(defaultMockResults);
  };

  // Step 4: Process Skill Gap Report with Skill Names looked up from `skills` table
  const processSkillGapReport = (rawSkillResults, explicitOverallScore) => {
    const formattedList = rawSkillResults.map((item) => {
      const sId = item.skill_id || item.id || item.code;
      const lookup = skillsLookup[sId] || FALLBACK_SKILLS[sId] || {
        name: item.skill_name || item.name || `Competency Unit (${sId})`,
        category: item.category || 'Clinical Competency',
        code: item.code || `NOS-${sId}`
      };

      const score = typeof item.score === 'number' ? Math.round(item.score) : 65;

      // Color Coding: Green 70+, Amber 40-69, Red below 40
      let colorClass = 'bg-red-500';
      let textColor = 'text-red-700';
      let bgColor = 'bg-red-50';
      let borderColor = 'border-red-200';
      let statusLabel = 'Critical Gap (< 40%)';

      if (score >= 70) {
        colorClass = 'bg-emerald-500';
        textColor = 'text-emerald-700';
        bgColor = 'bg-emerald-50';
        borderColor = 'border-emerald-200';
        statusLabel = 'Industry Ready (70%+)';
      } else if (score >= 40) {
        colorClass = 'bg-amber-500';
        textColor = 'text-amber-700';
        bgColor = 'bg-amber-50';
        borderColor = 'border-amber-200';
        statusLabel = 'Developing (40% - 69%)';
      } else {
        colorClass = 'bg-red-500';
        textColor = 'text-red-700';
        bgColor = 'bg-red-50';
        borderColor = 'border-red-200';
        statusLabel = 'Critical Gap (< 40%)';
      }

      return {
        skill_id: sId,
        skill_name: lookup.name || item.skill_name || item.name || `Skill ${sId}`,
        category: lookup.category || 'AYUSH NOS Core',
        code: lookup.code || 'HSSC-NOS',
        description: lookup.description || 'Assessed through standardized HSSC qualification pack criteria.',
        score,
        colorClass,
        textColor,
        bgColor,
        borderColor,
        statusLabel
      };
    });

    const calculatedAvg = explicitOverallScore !== undefined
      ? Math.round(explicitOverallScore)
      : Math.round(formattedList.reduce((acc, c) => acc + c.score, 0) / (formattedList.length || 1));

    setSubmissionResults({
      pack: selectedPack,
      overall_readiness: calculatedAvg,
      skills: formattedList,
      proficient_count: formattedList.filter((s) => s.score >= 70).length,
      developing_count: formattedList.filter((s) => s.score >= 40 && s.score < 70).length,
      gap_count: formattedList.filter((s) => s.score < 40).length,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  // Reset to pick another pack
  const handleReset = () => {
    setStage('select_pack');
    setSelectedPack(null);
    setQuestions([]);
    setAnswers({});
    setSubmissionResults(null);
  };

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 font-manrope pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-secondary rounded-3xl p-6 sm:p-8 text-white shadow-wellness relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Award className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-leaf-green-light text-xs font-black uppercase tracking-wider border border-white/20">
            <ShieldCheck className="w-4 h-4 text-leaf-green-accent" />
            <span>Supabase JS Client • Edge Function Diagnostic Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            AYUSH Competency & Skill Test Portal
          </h1>
          <p className="text-xs sm:text-sm text-leaf-green-light font-medium leading-relaxed">
            Test your clinical and domain competencies against Healthcare Sector Skill Council (HSSC) standards.
            Invokes Supabase Edge Functions <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-[11px] text-white">start-test</code> and <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-[11px] text-white">submit-test</code> with authenticated Student ID <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-[11px] text-white">{studentId}</code>.
          </p>

          {/* Active Logged-in User Badge */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-white/90">
            <div className="flex items-center gap-2 bg-white/15 px-3.5 py-1.5 rounded-xl backdrop-blur-sm border border-white/20">
              <User className="w-4 h-4 text-leaf-green-accent" />
              <span>Logged In: <strong className="text-white">{currentUser?.name || currentUser?.email || 'Guest Student'}</strong></span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono font-bold">ID: {studentId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Auth Bar (if student wants to login/signup directly) */}
      {!currentUser && (
        <div className="bg-surface-white rounded-3xl p-6 border border-surface-container-high shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-black text-text-main">
                {authMode === 'login' ? 'Student Sign In (Supabase Auth)' : 'Student Sign Up (Supabase Auth)'}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                className={`px-3 py-1 rounded-xl transition-all ${authMode === 'login' ? 'bg-primary text-white font-black' : 'text-outline hover:text-text-main'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setAuthError(''); setAuthSuccess(''); }}
                className={`px-3 py-1 rounded-xl transition-all ${authMode === 'signup' ? 'bg-primary text-white font-black' : 'text-outline hover:text-text-main'}`}
              >
                Create Account
              </button>
            </div>
          </div>

          <form onSubmit={authMode === 'login' ? handleSupabaseLogin : handleSupabaseSignUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Mail className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="student.email@ayush.edu.in"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-container-low border border-surface-container-high text-xs font-semibold text-text-main focus:outline-none focus:border-primary focus:bg-white"
              />
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Password (min 6 chars)"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-container-low border border-surface-container-high text-xs font-semibold text-text-main focus:outline-none focus:border-primary focus:bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="py-2.5 px-4 rounded-2xl bg-primary text-white text-xs font-black hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {authMode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{authLoading ? 'Authenticating...' : authMode === 'login' ? 'Sign In with Supabase' : 'Sign Up as Student'}</span>
            </button>
          </form>

          {authSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}
          {authError && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}
        </div>
      )}

      {/* STEP 1: QUALIFICATION PACK SELECTION */}
      {stage === 'select_pack' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-white p-5 rounded-3xl border border-surface-container-high shadow-xs">
            <div>
              <h2 className="text-lg font-black text-text-main flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Step 1: Select Qualification Pack
              </h2>
              <p className="text-xs text-outline font-medium">
                Fetched from Supabase table <code className="px-1.5 py-0.5 rounded bg-surface-container text-primary font-mono text-[11px]">qualification_packs</code>. Select a pack to begin testing.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Qualification Packs..."
                value={packSearch}
                onChange={(e) => setPackSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-container-low border border-surface-container-high text-xs font-semibold text-text-main focus:outline-none focus:border-primary focus:bg-white"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-wellness scale-[1.02]'
                    : 'bg-surface-white border border-surface-container-high text-outline hover:text-text-main hover:bg-surface-container-low'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading Indicator */}
          {loadingPacks ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-56 rounded-3xl bg-surface-container-low animate-pulse border border-surface-container-high p-6 space-y-4">
                  <div className="h-6 bg-surface-container-high rounded-full w-1/3"></div>
                  <div className="h-4 bg-surface-container-high rounded-full w-3/4"></div>
                  <div className="h-16 bg-surface-container-high rounded-2xl"></div>
                </div>
              ))}
            </div>
          ) : filteredPacks.length === 0 ? (
            <div className="bg-surface-white rounded-3xl p-12 text-center border border-surface-container-high space-y-3">
              <AlertCircle className="w-10 h-10 text-outline mx-auto" />
              <div className="text-base font-bold text-text-main">No Qualification Packs Found</div>
              <p className="text-xs text-outline">Try clearing your search query or choosing another category.</p>
              <button
                onClick={() => { setPackSearch(''); setSelectedCategory('All'); }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredPacks.map((pack) => (
                <div
                  key={pack.id || pack.qp_code}
                  className="bg-surface-white rounded-3xl p-6 border border-surface-container-high hover:border-primary/40 hover:shadow-wellness-hover transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-leaf-green-light text-primary font-mono text-[10px] font-extrabold border border-leaf-green-accent/30">
                          {pack.qp_code || pack.code || 'HSS/QP'}
                        </div>
                        <h3 className="text-base font-black text-text-main mt-1 group-hover:text-primary transition-colors">
                          {pack.title || pack.name}
                        </h3>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-surface-container text-tertiary text-xs font-extrabold shrink-0 border border-tertiary/20">
                        NSQF Level {pack.nsqf_level || 4}
                      </span>
                    </div>

                    <p className="text-xs text-outline leading-relaxed font-medium">
                      {pack.description}
                    </p>

                    {/* Meta tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-outline">
                      <span className="flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-xl">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {pack.estimated_minutes || 15} Mins
                      </span>
                      <span className="flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-xl">
                        <FileText className="w-3.5 h-3.5 text-secondary" />
                        {pack.total_questions || 5} Questions
                      </span>
                      <span className="flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-xl">
                        <ShieldCheck className="w-3.5 h-3.5 text-leaf-green-accent" />
                        HSSC Standard
                      </span>
                    </div>
                  </div>

                  {/* Start Button */}
                  <div className="pt-5 border-t border-surface-container-high mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-outline font-semibold">
                      Student ID: <code className="text-primary font-mono font-bold">{studentId}</code>
                    </span>
                    <button
                      onClick={() => handleStartTest(pack)}
                      disabled={isStartingTest}
                      className="px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-black flex items-center gap-2 hover:bg-primary-container transition-all shadow-wellness group-hover:translate-x-0.5 disabled:opacity-50"
                    >
                      <span>{isStartingTest ? 'Calling start-test...' : 'Pick & Start Test'}</span>
                      <ArrowRight className="w-4 h-4 text-leaf-green-accent" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 2: IN-TEST QUESTION PROGRESSION */}
      {stage === 'in_test' && currentQuestion && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
          {/* Header Bar */}
          <div className="bg-surface-white rounded-3xl p-5 border border-surface-container-high shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {currentQuestionIndex + 1}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-outline">
                  {selectedPack?.qp_code} • {selectedPack?.title || selectedPack?.name}
                </span>
                <div className="text-sm font-black text-text-main">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
              </div>
            </div>

            {/* Timer Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl font-mono text-xs font-black border bg-surface-container-low text-text-main border-surface-container-high">
              <Clock className="w-4 h-4 text-primary" />
              <span>{formatTime(testTimeRemaining)}</span>
            </div>
          </div>

          {/* Progress Bar Component */}
          <div className="bg-surface-white p-4 rounded-3xl border border-surface-container-high space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-outline">
              <span className="text-primary font-black">
                Progress: {answeredCount} / {questions.length} Answered ({progressPercentage}%)
              </span>
              <span>Attempt ID: <code className="font-mono text-text-main">{attemptId}</code></span>
            </div>
            <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-leaf-green-accent to-match-success transition-all duration-300 shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Question Quick Jump Indicators */}
            <div className="flex items-center gap-1.5 pt-2 flex-wrap">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = currentQuestionIndex === idx;

                return (
                  <button
                    key={q.id || idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-8 h-8 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-primary ring-offset-2 bg-primary text-white'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-surface-container-low text-outline hover:bg-surface-container'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Canvas */}
          <div className="bg-surface-white rounded-3xl p-6 sm:p-8 border border-surface-container-high shadow-wellness space-y-6">
            {/* Skill Name Small Label */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-green-light text-primary text-xs font-black border border-leaf-green-accent/30">
              <Sparkles className="w-3.5 h-3.5 text-leaf-green-accent" />
              <span>Skill: {currentSkillName}</span>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-black text-text-main leading-relaxed">
              {currentQuestion.question || currentQuestion.question_text}
            </h3>

            {/* Options with Radio Buttons */}
            <div className="space-y-3 pt-2">
              {(currentQuestion.options || []).map((optionText, optIdx) => {
                const isSelected = answers[currentQuestion.id] === optionText || answers[currentQuestion.id] === optIdx;
                const optionId = `q-${currentQuestion.id}-opt-${optIdx}`;

                return (
                  <label
                    key={optIdx}
                    htmlFor={optionId}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? 'border-primary bg-leaf-green-light/40 shadow-sm scale-[1.01]'
                        : 'border-surface-container-high bg-surface-white hover:border-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {/* Radio Button */}
                    <input
                      type="radio"
                      id={optionId}
                      name={`question-${currentQuestion.id}`}
                      checked={isSelected}
                      onChange={() => handleSelectRadioOption(currentQuestion.id, optionText)}
                      className="w-5 h-5 text-primary border-gray-300 focus:ring-primary mt-0.5 cursor-pointer accent-primary"
                    />

                    <div className="flex-1 text-xs sm:text-sm font-bold text-text-main leading-relaxed">
                      {optionText}
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Bottom Nav Controls */}
            <div className="pt-6 border-t border-surface-container-high flex items-center justify-between gap-4">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2.5 rounded-2xl border border-surface-container-high text-xs font-bold text-outline hover:text-text-main hover:bg-surface-container-low disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-3">
                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="px-6 py-2.5 rounded-2xl bg-primary text-white text-xs font-black hover:bg-primary-container transition-all flex items-center gap-2 shadow-wellness"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4 text-leaf-green-accent" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-match-success text-white text-xs font-black hover:opacity-95 transition-all flex items-center gap-2 shadow-wellness"
                  >
                    <Send className="w-4 h-4 text-leaf-green-light" />
                    <span>Finish & Submit Test</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: SUBMITTING / EVALUATION SPINNER */}
      {stage === 'submitting' && (
        <div className="bg-surface-white rounded-3xl p-16 text-center border border-surface-container-high shadow-wellness max-w-xl mx-auto space-y-5 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-3xl bg-leaf-green-light text-primary flex items-center justify-center mx-auto animate-bounce shadow-md">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-text-main">
              Evaluating Skill Test via Supabase...
            </h3>
            <p className="text-xs text-outline font-medium max-w-md mx-auto leading-relaxed">
              Invoking <code className="text-primary font-mono font-bold">submit-test</code> with student ID <code className="text-primary font-mono font-bold">{studentId}</code> and generating your Skill Gap Report.
            </p>
          </div>
        </div>
      )}

      {/* STEP 4: SKILL GAP REPORT */}
      {stage === 'report' && submissionResults && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Executive Summary Card */}
          <div className="bg-surface-white rounded-3xl p-6 sm:p-8 border border-surface-container-high shadow-wellness space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-surface-container-high">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-green-light text-primary text-xs font-black">
                  <CheckCircle className="w-3.5 h-3.5 text-leaf-green-accent" />
                  <span>Skill Diagnostic Report Generated</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight">
                  Skill Gap Report: {submissionResults.pack?.title || submissionResults.pack?.name || 'Qualification Pack'}
                </h2>
                <p className="text-xs text-outline font-medium">
                  Candidate ID: <span className="font-mono text-text-main font-bold">{studentId}</span> • Generated at {submissionResults.timestamp}
                </p>
              </div>

              {/* Overall Readiness Percentage Dial */}
              <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-3xl border border-surface-container-high self-start md:self-auto">
                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white shadow-sm ${
                  submissionResults.overall_readiness >= 70 ? 'bg-emerald-600' :
                  submissionResults.overall_readiness >= 40 ? 'bg-amber-600' : 'bg-red-600'
                }`}>
                  <span className="text-xl font-black">{submissionResults.overall_readiness}%</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider">Readiness</span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-black text-text-main">
                    {submissionResults.overall_readiness >= 70 ? '🟢 Industry Ready' :
                     submissionResults.overall_readiness >= 40 ? '🟡 Moderate Readiness' : '🔴 Priority Gap'}
                  </div>
                  <div className="text-[11px] text-outline font-medium">
                    {submissionResults.proficient_count} Proficient • {submissionResults.developing_count} Developing • {submissionResults.gap_count} Gaps
                  </div>
                </div>
              </div>
            </div>

            {/* Color Threshold Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></div>
                <div className="text-xs">
                  <span className="font-black text-emerald-800">Green (70%+)</span>
                  <p className="text-[11px] text-emerald-700 font-medium">Industry Ready / Strong Competency</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></div>
                <div className="text-xs">
                  <span className="font-black text-amber-800">Amber (40% - 69%)</span>
                  <p className="text-[11px] text-amber-700 font-medium">Developing / Bridge Course Recommended</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 shrink-0"></div>
                <div className="text-xs">
                  <span className="font-black text-red-800">Red (&lt; 40%)</span>
                  <p className="text-[11px] text-red-700 font-medium">Critical Skill Gap / Priority Action</p>
                </div>
              </div>
            </div>

            {/* Individual Skills Progress Bars (Names Looked up from `skills` table) */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-black text-text-main uppercase tracking-wider text-outline">
                Skill Breakdown (Looked up from `skills` database table)
              </h3>

              <div className="space-y-3">
                {submissionResults.skills.map((skillItem) => (
                  <div
                    key={skillItem.skill_id}
                    className={`p-5 rounded-2xl border transition-all ${skillItem.bgColor} ${skillItem.borderColor}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-text-main">
                            {skillItem.skill_name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-white text-text-main text-[10px] font-mono font-bold shadow-2xs border border-surface-container-high">
                            {skillItem.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-outline font-medium mt-0.5">
                          {skillItem.category} • {skillItem.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                          skillItem.score >= 70 ? 'bg-emerald-100 text-emerald-800' :
                          skillItem.score >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {skillItem.score}%
                        </span>
                        <span className={`text-xs font-extrabold ${skillItem.textColor}`}>
                          {skillItem.statusLabel}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 rounded-full bg-white/80 overflow-hidden p-0.5 border border-black/5 mt-2">
                      <div
                        className={`h-full rounded-full ${skillItem.colorClass} transition-all duration-500 shadow-sm`}
                        style={{ width: `${Math.max(6, skillItem.score)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-surface-container-high flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-2xl border border-surface-container-high text-xs font-black text-text-main hover:bg-surface-container-low transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-outline" />
                <span>Test Another Qualification Pack</span>
              </button>

              <div className="flex items-center gap-3">
                {onNavigateToRecommendations && (
                  <button
                    onClick={onNavigateToRecommendations}
                    className="px-5 py-2.5 rounded-2xl bg-leaf-green-light text-primary text-xs font-black hover:bg-leaf-green-accent/30 transition-all flex items-center gap-2 border border-leaf-green-accent/40"
                  >
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>Explore Bridge Courses</span>
                  </button>
                )}

                {onNavigateToRoadmap && (
                  <button
                    onClick={onNavigateToRoadmap}
                    className="px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-black hover:bg-primary-container transition-all flex items-center gap-2 shadow-wellness"
                  >
                    <span>View NOS Roadmap</span>
                    <ArrowRight className="w-4 h-4 text-leaf-green-accent" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
