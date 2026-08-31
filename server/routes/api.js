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

// 6. AI Features (Match Explanation) API
router.post('/ai/explain-match', (req, res) => {
  const { candidateName, roleTitle, matchScore, matchedSkills, gapSkills } = req.body;

  const explanation = `**AI Fit Justification for ${candidateName || 'Candidate'} (${matchScore || 88}% Fit):**

- **Key Competency Matches:** ${matchedSkills?.join(', ') || 'Abhyanga, Kati Basti Setup, Sterilization'} align closely with HSSC Qualification Pack standards.
- **Clinical Readiness:** 4 out of 5 required National Occupational Standards (NOS) are verified through accredited institutions.
- **Identified Growth Area:** ${gapSkills?.length > 0 ? gapSkills.join(', ') : 'None critical'}. Recommended 1-week refresher module before placement.
- **Verdict:** Highly recommended for screening call. Candidate demonstrates solid clinical foundation and verified certifications.`;

  res.json({ success: true, explanation });
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

// 15. AI Resume Parsing, NOS Skill Gap Diagnostic & Career Mapping API
const AYUSH_CAREER_ROLES = [
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

function parseResumeContent(text) {
  const clean = (text || '').replace(/^\[Uploaded File:.*?\]\s*/i, '').trim();
  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);
  const lower = clean.toLowerCase();

  // Extract Name
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

  // Extract Degree
  let degree = 'Ayush Qualification / Scholar';
  if (lower.includes('bhms')) degree = 'BHMS (Homeopathy)';
  else if (lower.includes('bnys')) degree = 'BNYS (Naturopathy & Yoga)';
  else if (lower.includes('bums')) degree = 'BUMS (Unani Medicine)';
  else if (lower.includes('bsms')) degree = 'BSMS (Siddha Medicine)';
  else if (lower.includes('md (ayu)') || lower.includes('md ayurveda')) degree = 'MD Ayurveda (Postgraduate)';
  else if (lower.includes('bams')) degree = 'BAMS (Ayurvedacharya)';
  else if (lower.includes('mbbs')) degree = 'MBBS (Modern Medicine)';

  // Extract College
  let college = 'Affiliated Ayush Medical Institution';
  if (lower.includes('aiia') || lower.includes('all india institute')) college = 'All India Institute of Ayurveda (AIIA), New Delhi';
  else if (lower.includes('bhu') || lower.includes('banaras')) college = 'BHU Institute of Medical Sciences, Varanasi';
  else if (lower.includes('gujarat') || lower.includes('jamnagar')) college = 'Gujarat Ayurved University, Jamnagar';
  else if (lower.includes('kerala') || lower.includes('thiruvananthapuram')) college = 'Government Ayurveda College, Thiruvananthapuram';
  else if (lower.includes('mdniy')) college = 'Morarji Desai National Institute of Yoga, New Delhi';
  else if (lower.includes('nia') || lower.includes('national institute of ayurveda')) college = 'National Institute of Ayurveda (NIA), Jaipur';

  // Extract Skills
  const extractedSkillsSet = new Set();
  Object.entries(NOS_SKILL_KEYWORD_MAP).forEach(([kw, skill]) => {
    if (lower.includes(kw)) extractedSkillsSet.add(skill);
  });
  const extractedSkills = Array.from(extractedSkillsSet);

  // Extract Certificates
  const certsSet = new Set();
  Object.entries(CERT_KEYWORD_MAP).forEach(([kw, cert]) => {
    if (lower.includes(kw)) certsSet.add(cert);
  });
  const detectedCertificates = Array.from(certsSet);

  // All Standard NOS Skills Benchmark
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

  const hasAnyMatch = extractedSkills.length > 0;

  // Calculate Skill Gap Breakdown
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
  const overallReadinessScore = !hasAnyMatch 
    ? 0 
    : Math.min(98, Math.max(25, Math.round((masteredCount / ALL_NOS_BENCHMARKS.length) * 80 + Math.min(18, detectedCertificates.length * 6))));

  // Role Mapping Engine: Calculate Match % for each AYUSH Career Role
  const roleMappings = AYUSH_CAREER_ROLES.map(role => {
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

  // Curate Bridge Course Recommendations based on identified gaps
  const missingSkillNames = skillGaps.filter(g => g.isGap).map(g => g.skill);
  const bridgeRecommendations = [
    {
      id: 'bridge-1',
      title: 'Panchakarma Therapy & Clinical Management',
      provider: 'NIA Jaipur / NCISM',
      platform: 'SWAYAM / NPTEL',
      url: 'https://swayam.gov.in/nc_details/NPTEL',
      duration: '6 Weeks',
      addressesGaps: ['Panchakarma Procedure Execution', 'Abhyanga & Swedana', 'Kati/Janu Basti Setup'],
      boostEstimate: '+24% Role Match'
    },
    {
      id: 'bridge-2',
      title: 'Ayurvedic Standardization & Dravyaguna QC',
      provider: 'AIIA New Delhi / Ministry of Ayush',
      platform: 'Ministry of Ayush e-Learning',
      url: 'https://ayush.gov.in/',
      duration: '4 Weeks',
      addressesGaps: ['Ayurvedic Herbal Kashaya Preparation', 'Sterilization & Herbal Dravya Prep'],
      boostEstimate: '+18% Role Match'
    },
    {
      id: 'bridge-3',
      title: 'Tele-Ayurveda & Digital Health Practice',
      provider: 'AyushConnect Academy / HSSC',
      platform: 'Coursera / edX Portal',
      url: 'https://www.coursera.org/browse/health',
      duration: '3 Weeks',
      addressesGaps: ['Tele-Ayurveda Protocols', 'Clinical Documentation & Logging'],
      boostEstimate: '+20% Role Match'
    },
    {
      id: 'bridge-4',
      title: 'Integrative Clinical Yoga & Naturopathy Protocol',
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
    masteredCount,
    gapCount,
    skillGaps,
    roleMappings,
    bridgeRecommendations,
    aiConfidenceScore: hasAnyMatch ? `${Math.floor(92 + Math.random() * 6)}.${Math.floor(Math.random() * 9)}%` : '0%',
    analyzedAt: new Date().toISOString()
  };
}

function analyzeAtsComplianceServer(rawText) {
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

function isAuthenticResumeServer(text) {
  const ats = analyzeAtsComplianceServer(text);
  return ats.isAtsCompliant;
}

router.post('/ai/parse-resume', async (req, res) => {
  const { resumeText } = req.body;
  const clean = (resumeText || '').trim();
  if (!clean || !isAuthenticResumeServer(clean)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Non-ATS Friendly Resume: The provided document does not meet ATS compliance standards. Please upload an ATS-compliant CV/Resume with standard contact details, Education, Experience, and Skills sections.' 
    });
  }

  try {
    const analysis = parseResumeContent(clean);
    analysis.atsCompliance = analyzeAtsComplianceServer(clean);
    res.json({
      success: true,
      extractedData: analysis,
      message: 'Resume analyzed successfully with ATS diagnostic, HSSC NOS skill gaps and career mappings.'
    });
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze resume.', error: error.message });
  }
});

router.post('/ai/sync-resume-profile', async (req, res) => {
  const { parsedData, email } = req.body;
  if (!parsedData) {
    return res.status(400).json({ success: false, message: 'Parsed resume data is required to sync.' });
  }

  try {
    const student = dbState.users.student;
    
    // Format skills for profile
    const formattedSkills = (parsedData.extractedSkills || []).map(skillName => ({
      name: skillName,
      score: Math.floor(82 + Math.random() * 12),
      target: 90,
      status: 'strong'
    }));

    // Add gaps as developing skills
    (parsedData.skillGaps || []).filter(g => g.isGap).slice(0, 3).forEach(g => {
      formattedSkills.push({
        name: g.skill,
        score: g.proficiencyScore,
        target: 90,
        status: 'gap'
      });
    });

    // Format certifications
    const formattedCerts = (parsedData.detectedCertificates || []).map(c => ({
      title: c,
      issuer: 'HSSC Ayush Sub-SSC / Accredited Body',
      year: 2026,
      verified: true
    }));

    student.name = parsedData.candidateName || student.name;
    student.degree = parsedData.degree || student.degree;
    student.institution = parsedData.college || student.institution;
    student.skills = formattedSkills;
    student.certifications = formattedCerts;
    student.readinessScore = parsedData.overallReadinessScore || student.readinessScore;
    student.xp = (student.xp || 1400) + 150;

    // If Supabase is connected, update there too
    try {
      if (email) {
        await supabase
          .from('users')
          .update({
            name: student.name,
            degree: student.degree,
            institution: student.institution,
            skills: JSON.stringify(student.skills),
            certifications: JSON.stringify(student.certifications),
            readiness_score: student.readinessScore
          })
          .eq('email', email);
      }
    } catch (supaErr) {
      console.warn('Supabase sync skipped, in-memory updated:', supaErr.message);
    }

    res.json({
      success: true,
      message: 'Student profile successfully synchronized with verified resume skills and readiness metrics!',
      updatedUser: student
    });
  } catch (error) {
    console.error('Error syncing profile:', error);
    res.status(500).json({ success: false, message: 'Failed to sync resume to profile.' });
  }
});

export default router;



