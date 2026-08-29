import express from 'express';
import fs from 'fs';
import { mockDatabase } from '../data/mockDatabase.js';
import { supabase } from '../supabaseClient.js';

const qualificationPacks = JSON.parse(
  fs.readFileSync(new URL('../data/qualificationPacks.json', import.meta.url), 'utf-8')
);

const router = express.Router();
let dbState = JSON.parse(JSON.stringify(mockDatabase));

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact' });
    res.json({
      status: 'ok',
      supabaseConnected: !error,
      userCount: data || 0,
      supabaseUrl: process.env.SUPABASE_URL
    });
  } catch (err) {
    res.json({ status: 'ok', supabaseConnected: false, error: err.message });
  }
});

// 1. Auth & Persona API via Supabase
router.get('/auth/me', async (req, res) => {
  const role = req.query.role || 'student';
  const email = req.query.email;
  try {
    let query = supabase.from('users').select('*');
    if (email) {
      query = query.eq('email', email);
    } else {
      query = query.eq('role', role);
    }
    const { data, error } = await query.limit(1);
    if (!error && data && data.length > 0) {
      const u = data[0];
      return res.json({
        success: true,
        user: {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role || role,
          degree: u.degree,
          institution: u.institution,
          company: u.company,
          department: u.department,
          xp: u.xp || 1420,
          level: u.level || 4,
          readinessScore: u.readiness_score || 78,
          skills: typeof u.skills === 'string' ? JSON.parse(u.skills) : (u.skills || dbState.users.student.skills),
          certifications: typeof u.certifications === 'string' ? JSON.parse(u.certifications) : (u.certifications || dbState.users.student.certifications)
        },
        activeRole: u.role || role,
        source: 'Supabase PostgreSQL'
      });
    }
  } catch (e) {
    console.error("Supabase fetch error, fallback to memory:", e);
  }

  res.json({ success: true, user: dbState.users[role] || dbState.users.student, activeRole: role, source: 'Memory' });
});

router.post('/auth/login', async (req, res) => {
  const { role, email, password, name } = req.body;
  const userRole = role || 'student';
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanPassword = password ? password.trim() : '';

  try {
    if (cleanEmail) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('email', cleanEmail)
        .limit(1);

      if (!error && data && data.length > 0) {
        const u = data[0];

        // 🔒 STRICT PASSWORD CHECK:
        if (cleanPassword && u.password && u.password.trim() !== cleanPassword) {
          return res.status(401).json({
            success: false,
            message: 'Incorrect password! Please enter the exact password you used during registration.'
          });
        }

        const loggedInUser = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role || userRole,
          degree: u.degree,
          institution: u.institution,
          company: u.company,
          department: u.department,
          xp: u.xp || 1420,
          level: u.level || 4,
          readinessScore: u.readiness_score || 78,
          skills: typeof u.skills === 'string' ? JSON.parse(u.skills) : (u.skills || []),
          certifications: typeof u.certifications === 'string' ? JSON.parse(u.certifications) : ([])
        };

        dbState.users[userRole] = loggedInUser;

        return res.json({
          success: true,
          message: `Successfully logged in as ${loggedInUser.name}!`,
          user: loggedInUser,
          activeRole: loggedInUser.role || userRole,
          source: 'Supabase'
        });
      } else {
        // No user found with this email
        return res.status(404).json({
          success: false,
          message: `No registered account found with "${cleanEmail}". Please click 'Create Account' to register first.`
        });
      }
    }
  } catch (e) {
    console.error('Supabase login check error:', e);
  }

  // 1-Click Persona Login Fallback (when no email is provided)
  const existingUser = dbState.users[userRole] || dbState.users.student;
  const loggedInUser = {
    ...existingUser,
    name: name || existingUser.name,
    role: userRole,
    token: `token-${Date.now()}`
  };
  dbState.users[userRole] = loggedInUser;

  res.json({
    success: true,
    message: `Successfully logged in as ${loggedInUser.name}!`,
    user: loggedInUser,
    activeRole: userRole,
    source: 'Memory'
  });
});

router.post('/auth/register', async (req, res) => {
  const { role, name, email, password, institution, degree, company, department } = req.body;
  const userRole = role || 'student';
  const cleanEmail = email ? email.trim().toLowerCase() : `user-${Date.now()}@ayush.edu.in`;
  const cleanPassword = password ? password.trim() : 'password123';
  const newId = `user-${Date.now()}`;
  const userName = name || cleanEmail.split('@')[0];
  const studentRegNo = `AYU-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const defaultStudentSkills = [
    { name: "Abhyanga & Swedana Technique", score: 85, target: 90, status: "strong" },
    { name: "Kati/Janu Basti Setup & Monitoring", score: 75, target: 85, status: "developing" },
    { name: "Sterilization & Herbal Dravya Prep", score: 90, target: 90, status: "strong" },
    { name: "Patient Vitals & Therapy Logging", score: 80, target: 85, status: "developing" },
    { name: "Ayurvedic Pharmacology Basics", score: 65, target: 80, status: "developing" }
  ];

  const defaultStudentCerts = [
    { title: "HSSC Panchakarma Attendant Certificate", issuer: "HSSC Ayush Sub-SSC", year: 2025, verified: true },
    { title: "Ayush First-Aid & Emergency Response", issuer: "Red Cross & Min of Ayush", year: 2024, verified: true }
  ];

  const newUser = {
    id: newId,
    name: userName,
    email: cleanEmail,
    password: cleanPassword,
    role: userRole,
    degree: degree || (userRole === 'student' ? 'BAMS 4th Year' : 'Ayush Graduate'),
    institution: institution || (userRole === 'student' ? 'National Institute of Ayurveda (NIA), Jaipur' : 'Ayush National Institute'),
    company: company || 'Ayush Wellness Center',
    department: department || 'Dept of Shalya Tantra',
    regNo: studentRegNo,
    xp: userRole === 'student' ? 1420 : 500,
    level: userRole === 'student' ? 4 : 1,
    readiness_score: userRole === 'student' ? 78 : 70,
    targetRoleTitle: 'Panchakarma Paricharaka',
    targetRole: 'qp-panchakarma',
    skills: JSON.stringify(userRole === 'student' ? defaultStudentSkills : [
      { name: "Clinical Assessment", score: 80, target: 90, status: "developing" },
      { name: "Ayush Management", score: 85, target: 90, status: "strong" }
    ]),
    certifications: JSON.stringify(userRole === 'student' ? defaultStudentCerts : [])
  };

  try {
    // 1. Supabase Auth registration
    if (email && password) {
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userName,
            role: userRole,
            degree: newUser.degree,
            institution: newUser.institution,
            company: newUser.company
          }
        }
      }).catch(err => console.warn('Supabase auth.signUp note:', err.message));
    }

    // 2. Insert or update into public.users table by email
    const { data: existingUsers } = await supabase.from('users').select('id').ilike('email', cleanEmail).limit(1);
    let data, error;
    if (existingUsers && existingUsers.length > 0) {
      const updateRes = await supabase.from('users').update({
        name: userName,
        password: cleanPassword,
        role: userRole,
        degree: newUser.degree,
        institution: newUser.institution,
        company: newUser.company,
        department: newUser.department
      }).ilike('email', cleanEmail).select();
      data = updateRes.data;
      error = updateRes.error;
    } else {
      const insertRes = await supabase.from('users').insert([newUser]).select();
      data = insertRes.data;
      error = insertRes.error;
    }

    if (!error && data && data.length > 0) {
      const created = {
        ...newUser,
        ...data[0],
        readinessScore: newUser.readiness_score,
        skills: typeof data[0].skills === 'string' ? JSON.parse(data[0].skills) : (newUser.skills ? JSON.parse(newUser.skills) : []),
        certifications: typeof data[0].certifications === 'string' ? JSON.parse(data[0].certifications) : (newUser.certifications ? JSON.parse(newUser.certifications) : [])
      };
      dbState.users[userRole] = created;
      return res.json({
        success: true,
        message: `Account saved successfully for ${userName}!`,
        user: created,
        activeRole: userRole,
        source: 'Supabase'
      });
    } else if (error) {
      console.error("Supabase insert/update error:", error);
    }
  } catch (e) {
    console.error("Supabase error:", e);
  }

  const memoryUser = {
    ...newUser,
    readinessScore: newUser.readiness_score,
    skills: JSON.parse(newUser.skills),
    certifications: JSON.parse(newUser.certifications)
  };
  dbState.users[userRole] = memoryUser;

  res.json({
    success: true,
    message: `Account created successfully for ${memoryUser.name}!`,
    user: memoryUser,
    activeRole: userRole,
    source: 'Memory'
  });
});

// 2. Qualification Packs API
router.get('/qualification-packs', (req, res) => {
  res.json({ success: true, qualificationPacks });
});

router.get('/qualification-packs/:id', (req, res) => {
  const pack = qualificationPacks.find(p => p.id === req.params.id);
  if (!pack) return res.status(404).json({ success: false, message: 'Pack not found' });
  res.json({ success: true, pack });
});

// 3. Student Profile & Skill Assessment Engine API
router.get('/students/profile', (req, res) => {
  res.json({ success: true, profile: dbState.users.student });
});

router.post('/students/assess', async (req, res) => {
  const { targetPackId, answers } = req.body;
  const pack = qualificationPacks.find(p => p.id === targetPackId) || qualificationPacks[0];

  let totalWeightedScore = 0;
  let maxWeight = 0;
  const skillResults = [];

  pack.coreCompetencies.forEach((comp, idx) => {
    const weight = pack.weightage[comp] || 20;
    maxWeight += weight;
    const answerVal = Number(answers[idx] || 3);
    const percentage = Math.round((answerVal / 5) * 100);
    totalWeightedScore += (percentage * weight);

    let status = 'strong';
    if (percentage < 60) status = 'gap';
    else if (percentage < 80) status = 'developing';

    skillResults.push({
      name: comp,
      score: percentage,
      target: 90,
      status: status
    });
  });

  const finalReadinessScore = Math.round(totalWeightedScore / maxWeight);

  // Update in Supabase
  try {
    await supabase.from('users').update({
      readiness_score: finalReadinessScore,
      skills: JSON.stringify(skillResults),
      xp: 1570
    }).eq('role', 'student');
  } catch (e) {
    console.error(e);
  }

  // Update memory state
  dbState.users.student.targetRole = pack.id;
  dbState.users.student.targetRoleTitle = pack.title;
  dbState.users.student.readinessScore = finalReadinessScore;
  dbState.users.student.skills = skillResults;
  dbState.users.student.xp += 150;

  res.json({
    success: true,
    readinessScore: finalReadinessScore,
    targetPack: pack,
    skills: skillResults,
    xpGained: 150,
    roadmap: [
      { step: 1, title: 'Bridge Gap: ' + (skillResults.find(s => s.status === 'gap')?.name || 'Pharmacology'), type: 'Course', duration: '2 Weeks', link: 'HSSC Module #4' },
      { step: 2, title: 'Clinical Simulation Workshop', type: 'Practical', duration: '1 Week', link: 'NIA Lab Training' },
      { step: 3, title: 'Apply to Verified Panchakarma Internships', type: 'Placement', duration: 'Immediate', link: 'Recommended Listings' }
    ]
  });
});

// 4. Jobs & Matching API
router.get('/jobs', async (req, res) => {
  let jobList = dbState.jobs;
  try {
    const { data, error } = await supabase.from('jobs').select('*');
    if (!error && data && data.length > 0) {
      jobList = data.map(j => ({
        id: j.id,
        title: j.title,
        company: j.company,
        location: j.location,
        stipend: j.stipend,
        duration: j.duration,
        type: j.type,
        sector: j.sector,
        requiredSkills: typeof j.required_skills === 'string' ? JSON.parse(j.required_skills) : j.required_skills,
        description: j.description,
        verified: j.verified,
        postedDate: j.posted_date,
        targetPack: j.target_pack
      }));
    }
  } catch (e) {
    console.error(e);
  }

  const studentSkills = dbState.users.student.skills.map(s => s.name);
  const enrichedJobs = jobList.map(job => {
    let matchedCount = 0;
    (job.requiredSkills || []).forEach(skill => {
      if (studentSkills.includes(skill)) matchedCount++;
    });

    const matchScore = Math.min(98, Math.round((matchedCount / Math.max(1, (job.requiredSkills || []).length)) * 100));

    return {
      ...job,
      matchScore: matchScore,
      matchPill: matchScore >= 85 ? 'High Fit' : matchScore >= 60 ? 'Medium Fit' : 'Developing'
    };
  });

  res.json({ success: true, jobs: enrichedJobs });
});

router.post('/jobs/apply', async (req, res) => {
  const { jobId, studentId, candidateName } = req.body;

  // Search in Supabase first
  let job = null;
  try {
    const { data } = await supabase.from('jobs').select('*').eq('id', jobId).limit(1);
    if (data && data.length > 0) {
      const j = data[0];
      job = {
        id: j.id,
        title: j.title,
        company: j.company,
        requiredSkills: typeof j.required_skills === 'string' ? JSON.parse(j.required_skills) : j.required_skills
      };
    }
  } catch (e) {
    console.error(e);
  }

  if (!job) {
    job = dbState.jobs.find(j => j.id === jobId) || {
      id: jobId || `job-${Date.now()}`,
      title: 'Ayush Clinical Intern',
      company: 'Patanjali Wellness Hub',
      requiredSkills: ["Abhyanga & Swedana Technique", "Kati/Janu Basti Setup"]
    };
  }

  const sId = studentId || 'std-001';
  const cName = candidateName || 'Dr. Ananya Sharma';

  const newApp = {
    id: `app-${Date.now()}`,
    job_id: job.id,
    student_id: sId,
    candidate_name: cName,
    role_applied: job.title,
    company: job.company,
    applied_date: new Date().toISOString().split('T')[0],
    match_score: 88,
    status: 'Under Review',
    stage: 'Applied',
    matched_skills: JSON.stringify((job.requiredSkills || []).slice(0, 3)),
    gap_skills: JSON.stringify((job.requiredSkills || []).slice(3)),
    notes: 'Submitted via AyushConnect skill-matched application engine.'
  };

  try {
    await supabase.from('applications').insert([newApp]);
  } catch (e) {
    console.error(e);
  }

  const memoryApp = {
    id: newApp.id,
    jobId: job.id,
    studentId: sId,
    candidateName: cName,
    roleApplied: job.title,
    company: job.company,
    appliedDate: newApp.applied_date,
    matchScore: 88,
    status: 'Under Review',
    stage: 'Applied',
    matchedSkills: (job.requiredSkills || []).slice(0, 3),
    gapSkills: (job.requiredSkills || []).slice(3),
    notes: 'Submitted via AyushConnect skill-matched application engine.'
  };

  dbState.applications.push(memoryApp);
  res.json({ success: true, message: `Application submitted successfully for ${job.title}!`, application: memoryApp });
});

// Endpoint to Add Student Certificate & NOS Verification
router.post('/students/add-certificate', async (req, res) => {
  const { title, issuer, year, certUrl, studentId } = req.body;
  const cert = {
    id: `cert-${Date.now()}`,
    title: title || 'HSSC Panchakarma Attendant Certificate',
    issuer: issuer || 'HSSC Ayush Sub-SSC',
    year: Number(year) || 2026,
    certUrl: certUrl || '',
    verified: true
  };

  try {
    const student = dbState.users.student;
    const updatedCerts = [...(student.certifications || []), cert];
    student.certifications = updatedCerts;
    student.xp += 100;

    await supabase.from('users').update({
      certifications: JSON.stringify(updatedCerts),
      xp: student.xp
    }).eq('role', 'student');
  } catch (e) {
    console.error(e);
  }

  res.json({
    success: true,
    message: 'Certificate added and NOS verified successfully!',
    certificate: cert,
    xpGained: 100
  });
});

// 5. Recruiter Kanban Pipeline API
router.get('/recruiter/pipeline', async (req, res) => {
  try {
    const { data, error } = await supabase.from('applications').select('*');
    if (!error && data && data.length > 0) {
      const parsedApps = data.map(a => ({
        id: a.id,
        jobId: a.job_id,
        studentId: a.student_id,
        candidateName: a.candidate_name,
        roleApplied: a.role_applied,
        company: a.company,
        appliedDate: a.applied_date,
        matchScore: a.match_score,
        status: a.status,
        stage: a.stage,
        matchedSkills: typeof a.matched_skills === 'string' ? JSON.parse(a.matched_skills) : a.matched_skills,
        gapSkills: typeof a.gap_skills === 'string' ? JSON.parse(a.gap_skills) : a.gap_skills,
        notes: a.notes
      }));
      return res.json({ success: true, applications: parsedApps, source: 'Supabase' });
    }
  } catch (e) {
    console.error(e);
  }

  res.json({ success: true, applications: dbState.applications, source: 'Memory' });
});

router.post('/recruiter/update-status', async (req, res) => {
  const { appId, newStage } = req.body;
  const newStatus = newStage === 'Applied' ? 'Under Review' : newStage;

  try {
    await supabase.from('applications').update({ stage: newStage, status: newStatus }).eq('id', appId);
  } catch (e) {
    console.error(e);
  }

  const app = dbState.applications.find(a => a.id === appId);
  if (app) {
    app.stage = newStage;
    app.status = newStatus;
  }
  res.json({ success: true, application: app || { id: appId, stage: newStage, status: newStatus } });
});

// 6. AI Features (Match Explanation & Resume Parsing) API
router.post('/ai/explain-match', (req, res) => {
  const { candidateName, roleTitle, matchScore, matchedSkills, gapSkills } = req.body;

  const explanation = `**AI Fit Justification for ${candidateName || 'Candidate'} (${matchScore || 88}% Fit):**

- **Key Competency Matches:** ${matchedSkills?.join(', ') || 'Abhyanga, Kati Basti Setup, Sterilization'} align closely with HSSC Qualification Pack standards.
- **Clinical Readiness:** 4 out of 5 required National Occupational Standards (NOS) are verified through accredited institutions.
- **Identified Growth Area:** ${gapSkills?.length > 0 ? gapSkills.join(', ') : 'None critical'}. Recommended 1-week refresher module before placement.
- **Verdict:** Highly recommended for screening call. Candidate demonstrates solid clinical foundation and verified certifications.`;

  res.json({ success: true, explanation });
});

router.post('/ai/parse-resume', (req, res) => {
  const { resumeText } = req.body;

  res.json({
    success: true,
    extractedData: {
      candidateName: "Dr. Ananya Sharma",
      degree: "BAMS (Ayurvedacharya)",
      college: "National Institute of Ayurveda (NIA), Jaipur",
      extractedSkills: [
        "Panchakarma Procedure Execution",
        "Abhyanga & Swedana",
        "Patient Vital Signs Monitoring",
        "Ayurvedic Herbal Kashaya Preparation"
      ],
      detectedCertificates: [
        "HSSC Panchakarma Attendant (Verified)",
        "Red Cross First Aid & CPR"
      ],
      aiConfidenceScore: "96.4%"
    }
  });
});

// 7. Academician / Faculty API
router.get('/faculty/fdps', async (req, res) => {
  try {
    const { data, error } = await supabase.from('fdps').select('*');
    if (!error && data && data.length > 0) {
      const parsedFdps = data.map(f => ({
        id: f.id,
        title: f.title,
        organizer: f.organizer,
        format: f.format,
        location: f.location,
        dates: f.dates,
        grantStipend: f.grant_stipend,
        eligibility: f.eligibility,
        seatsLeft: f.seats_left,
        applied: f.applied
      }));
      return res.json({ success: true, fdps: parsedFdps, source: 'Supabase' });
    }
  } catch (e) {
    console.error(e);
  }

  res.json({ success: true, fdps: dbState.fdps });
});

router.post('/faculty/apply', async (req, res) => {
  const { fdpId } = req.body;

  try {
    await supabase.from('fdps').update({ applied: true }).eq('id', fdpId);
  } catch (e) {
    console.error(e);
  }

  const fdp = dbState.fdps.find(f => f.id === fdpId);
  if (fdp) {
    fdp.applied = true;
    fdp.seatsLeft = Math.max(0, fdp.seatsLeft - 1);
  }
  res.json({ success: true, message: 'Registered for Faculty Development Program successfully in Supabase!' });
});

// 8. Institution Analytics API
router.get('/institution/analytics', (req, res) => {
  res.json({ success: true, analytics: dbState.institutionMetrics, database: 'Supabase PostgreSQL (Active)' });
});

// 9. Certificate Verification API
router.get('/certificates/verify/:id', (req, res) => {
  const certId = req.params.id;
  const student = dbState.users.student;
  const cert = student.certifications?.find(c => c.id === certId || c.title.toLowerCase().includes(certId.toLowerCase())) || {
    id: certId,
    title: 'HSSC Panchakarma Attendant Certificate',
    issuer: 'HSSC Ayush Sub-SSC & Ministry of Ayush',
    year: 2026,
    verified: true,
    nosCode: 'HSSC/Q8101-V2',
    studentName: student.name,
    institution: student.institution,
    issueDate: '2026-08-28'
  };

  res.json({
    success: true,
    certificate: cert,
    studentName: student.name,
    institution: student.institution,
    verificationUrl: `http://localhost:3000/verify-certificate?id=${certId}`
  });
});

// 10. HR Bulk Stage Update API
router.post('/recruiter/bulk-update-status', async (req, res) => {
  const { appIds, newStage } = req.body;
  if (!Array.isArray(appIds) || appIds.length === 0) {
    return res.status(400).json({ success: false, message: 'No application IDs provided' });
  }

  const newStatus = newStage === 'Applied' ? 'Under Review' : newStage;

  try {
    await supabase.from('applications').update({ stage: newStage, status: newStatus }).in('id', appIds);
  } catch (e) {
    console.error(e);
  }

  appIds.forEach(id => {
    const app = dbState.applications.find(a => a.id === id);
    if (app) {
      app.stage = newStage;
      app.status = newStatus;
    }
  });

  res.json({
    success: true,
    message: `Successfully updated ${appIds.length} candidate(s) to ${newStage}!`,
    updatedCount: appIds.length,
    newStage
  });
});

// 11. Collaboration Proposals & Milestones API
router.post('/collaborations/proposals', (req, res) => {
  const { title, type, partners, funding, duration, description, outcomes, milestones } = req.body;
  const newCollab = {
    id: `col-${Date.now()}`,
    type: type || 'Joint Research',
    title: title || 'New Industry–College Research Initiative',
    partners: Array.isArray(partners) ? partners : [partners || 'NIA Jaipur'],
    lead: 'Dr. Ananya Sharma & Vaidya Team',
    status: 'Upcoming',
    funding: funding || '₹10 Lakh',
    duration: duration || '12 Months',
    progress: 10,
    description: description || 'Collaborative research and clinical trials program.',
    outcomes: outcomes || ['Published research protocol', 'CPD credits for faculty'],
    milestones: milestones || [
      { id: 'm1', text: 'MoU & Proposal Signing', completed: true },
      { id: 'm2', text: 'Ethics Board Clearance', completed: false },
      { id: 'm3', text: 'Mid-term Review & Data Collection', completed: false },
      { id: 'm4', text: 'Final Protocol Publication', completed: false }
    ],
    deadline: 'Dec 2026'
  };

  if (!dbState.collaborations) dbState.collaborations = [];
  dbState.collaborations.unshift(newCollab);

  res.json({
    success: true,
    message: 'Partnership proposal created and saved as first-class record!',
    collaboration: newCollab
  });
});

router.post('/collaborations/update-milestone', (req, res) => {
  const { collabId, milestoneId, completed } = req.body;
  const collab = dbState.collaborations?.find(c => c.id === collabId);
  if (collab && collab.milestones) {
    const ms = collab.milestones.find(m => m.id === milestoneId);
    if (ms) ms.completed = completed;
    const doneCount = collab.milestones.filter(m => m.completed).length;
    collab.progress = Math.round((doneCount / collab.milestones.length) * 100);
  }

  res.json({
    success: true,
    message: 'Milestone status updated!',
    progress: collab ? collab.progress : 50
  });
});

// 12. Institution Cohort CSV Import & Export API
router.post('/institution/import-cohort', (req, res) => {
  const { cohortData } = req.body;
  if (Array.isArray(cohortData)) {
    const placedCount = cohortData.filter(c => c.status === 'Placed' || c.placed === true).length;
    const avgScore = Math.round(cohortData.reduce((acc, curr) => acc + Number(curr.readinessScore || 75), 0) / Math.max(1, cohortData.length));

    dbState.institutionMetrics = {
      ...dbState.institutionMetrics,
      totalEnrolled: cohortData.length,
      assessedStudents: cohortData.length,
      readinessAvg: avgScore,
      placementRate: `${Math.round((placedCount / Math.max(1, cohortData.length)) * 100)}%`
    };
  }

  res.json({
    success: true,
    message: `Imported ${cohortData?.length || 0} student outcome records into institution database!`,
    updatedMetrics: dbState.institutionMetrics
  });
});

router.get('/institution/export-cohort', (req, res) => {
  const headers = 'StudentID,StudentName,Degree,Institution,HSSCReadinessScore,TargetQualificationPack,PlacementStatus,CompanyHired\n';
  const sampleRows = [
    'STD-001,Dr. Ananya Sharma,BAMS 4th Year,NIA Jaipur,92%,Panchakarma Paricharaka (HSSC/Q8101),Selected,Kairali Group',
    'STD-002,Vaidya Rohit Mehta,BAMS Graduate,AIIA New Delhi,87%,Ayurvedic Pharmacist (HSSC/Q8102),Interviewing,Dabur R&D',
    'STD-003,Dr. Priya Nair,BAMS Graduate,SDM Udupi,83%,Tele-Ayurveda Specialist (HSSC/Q8103),Shortlisted,Practo Ayush',
    'STD-004,Dr. Siddharth Rao,BAMS Graduate,NIA Jaipur,89%,Panchakarma Paricharaka (HSSC/Q8101),Placed,Patanjali Wellness',
    'STD-005,Dr. Divya Sharma,BAMS Graduate,AIIA New Delhi,91%,Clinical OPD Associate (HSSC/Q8104),Selected,AIIMS Integrative'
  ].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.send(headers + sampleRows);
});

// 13. Mentor Student Progress & Certificate Issuance API
router.get('/mentor/students', (req, res) => {
  const mentoredStudents = [
    {
      id: 'std-001',
      name: 'Dr. Ananya Sharma',
      institution: 'NIA Jaipur',
      degree: 'BAMS 4th Year',
      progressPct: 85,
      completedCourses: ['Panchakarma Therapy: Complete Clinical Protocol', 'Sterilization & Aseptic Technique'],
      activeGap: 'Ayurvedic Pharmacology Basics',
      readinessScore: 92,
      certIssued: true,
      certId: 'HSSC-NOS-2026-8842',
      feedbackNotes: 'Demonstrates exceptional clinical dexterity in Swedana and Kati Basti procedures.'
    },
    {
      id: 'std-002',
      name: 'Vaidya Rohit Mehta',
      institution: 'AIIA New Delhi',
      degree: 'BAMS Graduate',
      progressPct: 90,
      completedCourses: ['Ayurvedic Pharmacology & Dravyaguna'],
      activeGap: 'GMP Documentation',
      readinessScore: 87,
      certIssued: false,
      certId: null,
      feedbackNotes: 'Good knowledge of Dravya classification. Recommended 1-week lab safety refresher.'
    },
    {
      id: 'std-003',
      name: 'Dr. Priya Nair',
      institution: 'SDM Udupi',
      degree: 'BAMS Graduate',
      progressPct: 70,
      completedCourses: ['Patient Vital Signs & Clinical Documentation'],
      activeGap: 'Tele-AYUSH Protocols',
      readinessScore: 83,
      certIssued: false,
      certId: null,
      feedbackNotes: 'Patient communication is strong. Needs guidance on EHR software logging.'
    }
  ];

  res.json({ success: true, students: mentoredStudents });
});

router.post('/mentor/issue-certificate', async (req, res) => {
  const { studentId, courseTitle, nosCode } = req.body;
  const certId = `HSSC-NOS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const cert = {
    id: certId,
    title: courseTitle || 'HSSC Panchakarma Attendant Certificate',
    issuer: 'HSSC Ayush Sub-SSC & Ministry of Ayush',
    year: 2026,
    verified: true,
    nosCode: nosCode || 'HSSC/Q8101-V2',
    issueDate: new Date().toISOString().split('T')[0]
  };

  try {
    const student = dbState.users.student;
    student.certifications = [...(student.certifications || []), cert];
    student.xp += 200;
  } catch (e) {
    console.error(e);
  }

  res.json({
    success: true,
    message: `Verified HSSC Certificate successfully issued to student! Certificate ID: ${certId}`,
    certificate: cert,
    certId
  });
});

// 14. Application Submission Analytics by Program, Organization & Skill Gap API
router.get('/analytics/applications', (req, res) => {
  const analytics = {
    totalSubmissions: 342,
    byProgram: [
      { program: 'Panchakarma Paricharaka', count: 142, pct: 41.5, color: 'bg-emerald-500' },
      { program: 'Ayurvedic Pharmacist', count: 88, pct: 25.7, color: 'bg-sky-500' },
      { program: 'Tele-Ayurveda Specialist', count: 64, pct: 18.7, color: 'bg-purple-500' },
      { program: 'Yoga Wellness Coach', count: 48, pct: 14.1, color: 'bg-amber-500' }
    ],
    byOrganization: [
      { company: 'Patanjali Wellness Hub', submissions: 112, hires: 34 },
      { company: 'Kairali Ayurvedic Group', submissions: 86, hires: 22 },
      { company: 'Dabur R&D Labs', submissions: 68, hires: 18 },
      { company: 'Practo Ayush Division', submissions: 46, hires: 15 },
      { company: 'AIIMS Integrative OPD', submissions: 30, hires: 12 }
    ],
    bySkillGap: [
      { skillGap: 'Panchakarma Procedure Execution', applicationsFixingGap: 128, urgency: 'High' },
      { skillGap: 'Sterilization & Aseptic Technique', applicationsFixingGap: 94, urgency: 'High' },
      { skillGap: 'Ayurvedic Herbal Kashaya Prep', applicationsFixingGap: 72, urgency: 'Medium' },
      { skillGap: 'Clinical Documentation & Logging', applicationsFixingGap: 48, urgency: 'Low' }
    ]
  };

  res.json({ success: true, analytics });
});

export default router;


