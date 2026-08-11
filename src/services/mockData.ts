/**
 * SIMP Mock Data — Sandbox / Offline Mode
 * Used when token === 'mock_jwt_token_for_development'
 * Covers: student, coordinator, organization, admin roles
 */

// ── Student ──────────────────────────────────────────────────────────────────

export const mockStudentProfile = {
  _id: 'mock_student_id',
  name: 'Arjun Mehta',
  email: 'arjun.mehta@student.edu',
  studentId: 'CS2022041',
  department: 'Computer Science & Engineering',
  placementStatus: 'placed',
  currentInternship: {
    _id: 'int_001',
    title: 'Full Stack Developer Intern',
    organization: { _id: 'org_001', name: 'InnovateTech Solutions Pvt. Ltd.' },
    startDate: '2024-06-01',
    endDate: '2024-11-30',
    stipend: 15000,
  },
  assignedCoordinator: {
    name: 'Dr. Priya Ramachandran',
    department: 'Computer Science & Engineering',
  },
};

export const mockStudentReports = [
  {
    _id: 'log_001',
    weekNumber: 1,
    startDate: '2024-06-03',
    endDate: '2024-06-07',
    hoursLogged: 40,
    tasksCompleted: 'Onboarding, environment setup, codebase walkthrough, Git workflow orientation.',
    challengesFaced: 'Understanding the existing monorepo structure took some time.',
    status: 'approved',
    comments: 'Good start! Keep it up.',
  },
  {
    _id: 'log_002',
    weekNumber: 2,
    startDate: '2024-06-10',
    endDate: '2024-06-14',
    hoursLogged: 42,
    tasksCompleted: 'Implemented REST API endpoints for user authentication module, wrote unit tests.',
    challengesFaced: 'JWT refresh token rotation edge case was tricky to debug.',
    status: 'approved',
    comments: 'Excellent technical depth.',
  },
  {
    _id: 'log_003',
    weekNumber: 3,
    startDate: '2024-06-17',
    endDate: '2024-06-21',
    hoursLogged: 38,
    tasksCompleted: 'Worked on dashboard UI components using React + MUI. Integrated chart libraries.',
    challengesFaced: 'Performance optimization for large datasets.',
    status: 'approved',
    comments: 'Well done on the UI work.',
  },
  {
    _id: 'log_004',
    weekNumber: 4,
    startDate: '2024-06-24',
    endDate: '2024-06-28',
    hoursLogged: 45,
    tasksCompleted: 'Database schema design for notifications module, wrote migration scripts.',
    challengesFaced: 'Handling concurrent writes in MongoDB required careful indexing.',
    status: 'pending',
    comments: '',
  },
  {
    _id: 'log_005',
    weekNumber: 5,
    startDate: '2024-07-01',
    endDate: '2024-07-05',
    hoursLogged: 40,
    tasksCompleted: 'Implemented file upload service using Multer + AWS S3 integration.',
    challengesFaced: 'S3 bucket policy configuration and CORS setup was complex.',
    status: 'pending',
    comments: '',
  },
  {
    _id: 'log_006',
    weekNumber: 6,
    startDate: '2024-07-08',
    endDate: '2024-07-12',
    hoursLogged: 36,
    tasksCompleted: 'Code review sessions, refactoring legacy modules, documentation updates.',
    challengesFaced: 'Legacy code lacked tests — incremental refactoring was necessary.',
    status: 'rejected',
    comments: 'Please provide more specific task details and hours breakdown.',
  },
];

export const mockStudentApplications = [
  {
    _id: 'app_001',
    internship: {
      _id: 'int_001',
      title: 'Full Stack Developer Intern',
      organization: { name: 'InnovateTech Solutions Pvt. Ltd.' },
    },
    status: 'accepted',
    appliedDate: '2024-05-10',
  },
  {
    _id: 'app_002',
    internship: {
      _id: 'int_002',
      title: 'React Native Mobile Developer Intern',
      organization: { name: 'AppVenture Labs' },
    },
    status: 'rejected',
    appliedDate: '2024-05-08',
  },
  {
    _id: 'app_003',
    internship: {
      _id: 'int_003',
      title: 'Data Engineering Intern',
      organization: { name: 'DataStream Analytics' },
    },
    status: 'shortlisted',
    appliedDate: '2024-05-14',
  },
];

export const mockStudentDocuments = [
  {
    _id: 'doc_001',
    category: 'resume',
    originalName: 'Arjun_Mehta_Resume_2024.pdf',
    url: '#',
    uploadedAt: '2024-05-01',
  },
  {
    _id: 'doc_002',
    category: 'offer_letter',
    originalName: 'InnovateTech_Offer_Letter.pdf',
    url: '#',
    uploadedAt: '2024-05-20',
  },
];

// ── Coordinator ───────────────────────────────────────────────────────────────

export const mockCoordinatorDashboard = {
  totalStudents: 58,
  placedStudents: 41,
  pendingApplications: 14,
  pendingReports: 7,
  // students array — consumed by CoordinatorDashboard as dashRes.data.students
  students: [
    {
      _id: 'mock_student_id',
      name: 'Arjun Mehta',
      email: 'arjun@student.edu',
      studentId: 'CS2022041',
      department: 'Computer Science & Engineering',
      placementStatus: 'placed',
      currentInternship: { _id: 'int_001', title: 'Full Stack Developer Intern', organization: { name: 'InnovateTech Solutions' } },
    },
    {
      _id: 'mock_student_id_2',
      name: 'Kavya Sharma',
      email: 'kavya@student.edu',
      studentId: 'CS2022057',
      department: 'Computer Science & Engineering',
      placementStatus: 'placed',
      currentInternship: { _id: 'int_002', title: 'Cloud Infrastructure Intern', organization: { name: 'DataStream Analytics' } },
    },
    {
      _id: 'mock_student_id_3',
      name: 'Vikram Iyer',
      email: 'vikram@student.edu',
      studentId: 'CS2022019',
      department: 'Computer Science & Engineering',
      placementStatus: 'placed',
      currentInternship: { _id: 'int_003', title: 'ML Engineer Intern', organization: { name: 'NeuralWorks AI' } },
    },
    {
      _id: 'mock_student_id_4',
      name: 'Preethi Subramaniam',
      email: 'preethi@student.edu',
      studentId: 'CS2022033',
      department: 'Computer Science & Engineering',
      placementStatus: 'searching',
      currentInternship: null,
    },
    {
      _id: 'mock_student_id_5',
      name: 'Suresh Babu',
      email: 'suresh@student.edu',
      studentId: 'CS2022044',
      department: 'Computer Science & Engineering',
      placementStatus: 'not_started',
      currentInternship: null,
    },
  ],
  recentActivity: [
    { type: 'report_submitted', student: 'Arjun Mehta', details: 'Week 5 log submitted', time: '2 hours ago' },
    { type: 'application_received', student: 'Kavya Sharma', details: 'Applied to DataStream Analytics', time: '5 hours ago' },
    { type: 'report_submitted', student: 'Rahul Nair', details: 'Week 4 log submitted', time: '1 day ago' },
  ],
};

export const mockCoordinatorApplications = [
  {
    _id: 'capp_001',
    student: { name: 'Kavya Sharma', studentId: 'CS2022057', email: 'kavya@student.edu' },
    internship: { title: 'Cloud Infrastructure Intern', organization: { name: 'DataStream Analytics' } },
    status: 'pending',
    appliedDate: '2024-07-15',
    coverLetter: 'I am highly motivated to contribute to cloud infrastructure projects...',
  },
  {
    _id: 'capp_002',
    student: { name: 'Vikram Iyer', studentId: 'CS2022019', email: 'vikram@student.edu' },
    internship: { title: 'ML Engineer Intern', organization: { name: 'NeuralWorks AI' } },
    status: 'pending',
    appliedDate: '2024-07-14',
    coverLetter: 'My background in Python and PyTorch makes me a strong candidate...',
  },
  {
    _id: 'capp_003',
    student: { name: 'Preethi Subramaniam', studentId: 'CS2022033', email: 'preethi@student.edu' },
    internship: { title: 'Backend Developer Intern', organization: { name: 'FinEdge Technologies' } },
    status: 'approved',
    appliedDate: '2024-07-10',
    coverLetter: 'Extensive experience with Node.js microservices...',
  },
  {
    _id: 'capp_004',
    student: { name: 'Suresh Babu', studentId: 'CS2022044', email: 'suresh@student.edu' },
    internship: { title: 'UI/UX Design Intern', organization: { name: 'CreativeNest Studios' } },
    status: 'rejected',
    appliedDate: '2024-07-08',
    coverLetter: 'Passionate about creating intuitive user experiences...',
  },
];

export const mockCoordinatorReports = [
  {
    _id: 'crep_001',
    student: { name: 'Arjun Mehta', studentId: 'CS2022041' },
    internship: { title: 'Full Stack Developer Intern', organization: { name: 'InnovateTech Solutions' } },
    weekNumber: 5,
    startDate: '2024-07-01',
    endDate: '2024-07-05',
    hoursLogged: 40,
    tasksCompleted: 'Implemented file upload service using Multer + AWS S3 integration.',
    challengesFaced: 'S3 bucket policy configuration and CORS setup was complex.',
    status: 'pending',
  },
  {
    _id: 'crep_002',
    student: { name: 'Kavya Sharma', studentId: 'CS2022057' },
    internship: { title: 'Cloud Infrastructure Intern', organization: { name: 'DataStream Analytics' } },
    weekNumber: 3,
    startDate: '2024-06-17',
    endDate: '2024-06-21',
    hoursLogged: 42,
    tasksCompleted: 'Set up Terraform scripts for AWS infrastructure, wrote CI/CD pipeline configurations.',
    challengesFaced: 'IAM role permissions management was complex.',
    status: 'pending',
  },
  {
    _id: 'crep_003',
    student: { name: 'Vikram Iyer', studentId: 'CS2022019' },
    internship: { title: 'ML Engineer Intern', organization: { name: 'NeuralWorks AI' } },
    weekNumber: 2,
    startDate: '2024-06-10',
    endDate: '2024-06-14',
    hoursLogged: 45,
    tasksCompleted: 'Trained custom CNN model for image classification, achieved 94% accuracy.',
    challengesFaced: 'GPU memory constraints during batch training.',
    status: 'approved',
    comments: 'Outstanding technical achievement.',
  },
];

// ── Organization ──────────────────────────────────────────────────────────────

export const mockOrgDashboard = {
  // stats consumed by OrganizationDashboard as statsRes.data
  activeListings: 4,
  totalApplicants: 23,
  internsPlaced: 6,
  pendingReviews: 8,
  totalPostings: 4,
  selectedStudents: 6,
  pendingApplications: 8,
  activeInternsCount: 6,
  // activeInterns array — consumed as statsRes.data.activeInterns
  activeInterns: [
    {
      _id: 'mock_student_id',
      name: 'Arjun Mehta',
      phone: '+91 98765 43210',
      cgpa: 8.7,
      skills: ['React', 'Node.js', 'MongoDB'],
      currentInternship: { _id: 'int_001', title: 'Full Stack Developer Intern' },
    },
    {
      _id: 'mock_student_id_2',
      name: 'Kavya Sharma',
      phone: '+91 87654 32109',
      cgpa: 9.1,
      skills: ['AWS', 'Terraform', 'Docker'],
      currentInternship: { _id: 'int_002', title: 'Cloud Infrastructure Intern' },
    },
    {
      _id: 'mock_student_id_3',
      name: 'Vikram Iyer',
      phone: '+91 76543 21098',
      cgpa: 8.4,
      skills: ['Python', 'PyTorch', 'MLflow'],
      currentInternship: { _id: 'int_003', title: 'ML Engineer Intern' },
    },
  ],
};

export const mockOrgInternships = [
  {
    _id: 'oint_001',
    title: 'Full Stack Developer Intern',
    department: 'Engineering',
    location: 'Bangalore (Hybrid)',
    stipend: 15000,
    duration: '6 months',
    openings: 3,
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    description: 'Work on building scalable web applications and contribute to the product roadmap.',
    status: 'active',
    applicationsCount: 12,
    postedDate: '2024-05-01',
    deadline: '2024-05-31',
  },
  {
    _id: 'oint_002',
    title: 'Cloud Infrastructure Intern',
    department: 'DevOps',
    location: 'Remote',
    stipend: 12000,
    duration: '4 months',
    openings: 2,
    skills: ['AWS', 'Terraform', 'Docker', 'Kubernetes'],
    description: 'Support the infrastructure team in deploying and managing cloud resources.',
    status: 'active',
    applicationsCount: 7,
    postedDate: '2024-05-05',
    deadline: '2024-06-10',
  },
  {
    _id: 'oint_003',
    title: 'Data Analytics Intern',
    department: 'Business Intelligence',
    location: 'Chennai (On-site)',
    stipend: 10000,
    duration: '3 months',
    openings: 2,
    skills: ['Python', 'SQL', 'Tableau', 'Pandas'],
    description: 'Help build data pipelines and generate insights from large datasets.',
    status: 'closed',
    applicationsCount: 4,
    postedDate: '2024-04-15',
    deadline: '2024-05-15',
  },
  {
    _id: 'oint_004',
    title: 'UI/UX Design Intern',
    department: 'Product',
    location: 'Bangalore (On-site)',
    stipend: 11000,
    duration: '4 months',
    openings: 1,
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    description: 'Design user-centered interfaces for our SaaS products.',
    status: 'active',
    applicationsCount: 0,
    postedDate: '2024-07-01',
    deadline: '2024-07-31',
  },
];

export const mockOrgApplicants = [
  {
    _id: 'oappl_001',
    student: { name: 'Arjun Mehta', studentId: 'CS2022041', email: 'arjun@student.edu', department: 'CSE' },
    internship: { _id: 'oint_001', title: 'Full Stack Developer Intern' },
    status: 'accepted',
    appliedDate: '2024-05-10',
    coverLetter: 'Strong background in full-stack development using MERN stack...',
  },
  {
    _id: 'oappl_002',
    student: { name: 'Preethi Subramaniam', studentId: 'CS2022033', email: 'preethi@student.edu', department: 'CSE' },
    internship: { _id: 'oint_001', title: 'Full Stack Developer Intern' },
    status: 'pending',
    appliedDate: '2024-05-12',
    coverLetter: 'Experience with React and backend APIs in academic projects...',
  },
  {
    _id: 'oappl_003',
    student: { name: 'Kavya Sharma', studentId: 'CS2022057', email: 'kavya@student.edu', department: 'CSE' },
    internship: { _id: 'oint_002', title: 'Cloud Infrastructure Intern' },
    status: 'shortlisted',
    appliedDate: '2024-05-14',
    coverLetter: 'Hands-on experience with AWS and Terraform from open source contributions...',
  },
  {
    _id: 'oappl_004',
    student: { name: 'Vikram Iyer', studentId: 'CS2022019', email: 'vikram@student.edu', department: 'CSE' },
    internship: { _id: 'oint_001', title: 'Full Stack Developer Intern' },
    status: 'rejected',
    appliedDate: '2024-05-09',
    coverLetter: 'Proficient in Python and JavaScript...',
  },
];

// ── Admin ─────────────────────────────────────────────────────────────────────

export const mockAdminUsers = [
  { _id: 'u_001', name: 'Arjun Mehta', email: 'arjun@student.edu', role: 'student', department: 'CSE', isActive: true, createdAt: '2023-06-01' },
  { _id: 'u_002', name: 'Kavya Sharma', email: 'kavya@student.edu', role: 'student', department: 'CSE', isActive: true, createdAt: '2023-06-01' },
  { _id: 'u_003', name: 'Vikram Iyer', email: 'vikram@student.edu', role: 'student', department: 'CSE', isActive: true, createdAt: '2023-06-01' },
  { _id: 'u_004', name: 'Dr. Priya Ramachandran', email: 'priya@university.edu', role: 'coordinator', department: 'CSE', isActive: true, createdAt: '2022-07-15' },
  { _id: 'u_005', name: 'Prof. Anand Kumar', email: 'anand@university.edu', role: 'coordinator', department: 'IT', isActive: true, createdAt: '2022-07-15' },
  { _id: 'u_006', name: 'InnovateTech HR', email: 'hr@innovatetech.com', role: 'organization', department: '', isActive: true, createdAt: '2023-01-10' },
  { _id: 'u_007', name: 'DataStream Recruiter', email: 'recruit@datastream.com', role: 'organization', department: '', isActive: false, createdAt: '2023-02-20' },
];

export const mockAdminInternships = [
  { _id: 'oint_001', title: 'Full Stack Developer Intern', organization: { name: 'InnovateTech Solutions' }, status: 'active', applicationsCount: 12, postedDate: '2024-05-01' },
  { _id: 'oint_002', title: 'Cloud Infrastructure Intern', organization: { name: 'DataStream Analytics' }, status: 'active', applicationsCount: 7, postedDate: '2024-05-05' },
  { _id: 'oint_003', title: 'Data Analytics Intern', organization: { name: 'DataStream Analytics' }, status: 'closed', applicationsCount: 4, postedDate: '2024-04-15' },
  { _id: 'oint_004', title: 'UI/UX Design Intern', organization: { name: 'InnovateTech Solutions' }, status: 'pending_review', applicationsCount: 0, postedDate: '2024-07-01' },
  { _id: 'oint_005', title: 'ML Engineer Intern', organization: { name: 'NeuralWorks AI' }, status: 'active', applicationsCount: 9, postedDate: '2024-05-20' },
];

export const mockAdminApplications = [
  ...mockOrgApplicants,
  {
    _id: 'oappl_005',
    student: { name: 'Suresh Babu', studentId: 'CS2022044', email: 'suresh@student.edu', department: 'CSE' },
    internship: { _id: 'oint_004', title: 'UI/UX Design Intern' },
    status: 'pending',
    appliedDate: '2024-07-08',
    coverLetter: 'Passionate about design systems...',
  },
];

// Admin summary statistics — consumed by AdminDashboard as reportsRes.data
export const mockAdminStats = {
  totalStudents: 58,
  placedStudents: 41,
  completedStudents: 12,
  totalCoordinators: 5,
  totalOrgs: 8,
  totalInternships: 23,
  totalApplications: 87,
  placementRate: '70.7%',
};

export const mockAdminReports = [
  ...mockCoordinatorReports,
  {
    _id: 'crep_004',
    student: { name: 'Preethi Subramaniam', studentId: 'CS2022033' },
    internship: { title: 'Backend Developer Intern', organization: { name: 'FinEdge Technologies' } },
    weekNumber: 1,
    startDate: '2024-06-03',
    endDate: '2024-06-07',
    hoursLogged: 40,
    tasksCompleted: 'Onboarding and initial project setup.',
    challengesFaced: 'Getting familiar with microservices architecture.',
    status: 'approved',
    comments: 'Good first week.',
  },
];

// ── Notifications (all roles) ─────────────────────────────────────────────────

export const mockNotifications = [
  {
    _id: 'notif_001',
    type: 'success' as const,
    title: 'Log Sheet Approved',
    message: 'Your Week 3 log sheet has been approved by Dr. Priya Ramachandran.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    _id: 'notif_002',
    type: 'info' as const,
    title: 'Application Update',
    message: 'Your application to DataStream Analytics has been shortlisted.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    _id: 'notif_003',
    type: 'warning' as const,
    title: 'Log Sheet Due',
    message: 'Your Week 5 log sheet is due for submission before end of day.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    _id: 'notif_004',
    type: 'error' as const,
    title: 'Log Sheet Rejected',
    message: 'Your Week 6 log sheet requires revision. Please provide more details.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

// ── Internship Listings (public search) ───────────────────────────────────────

export const mockInternshipListings = [
  {
    _id: 'oint_001',
    title: 'Full Stack Developer Intern',
    organization: { _id: 'org_001', name: 'InnovateTech Solutions Pvt. Ltd.', industry: 'Software Development' },
    location: 'Bangalore (Hybrid)',
    stipend: 15000,
    duration: '6 months',
    openings: 3,
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    description: 'Work on building scalable web applications and contribute to the product roadmap. You will collaborate closely with senior engineers and gain end-to-end exposure.',
    status: 'active',
    deadline: '2024-08-31',
    postedDate: '2024-07-01',
  },
  {
    _id: 'oint_002',
    title: 'Cloud Infrastructure Intern',
    organization: { _id: 'org_002', name: 'DataStream Analytics', industry: 'Data & Analytics' },
    location: 'Remote',
    stipend: 12000,
    duration: '4 months',
    openings: 2,
    skills: ['AWS', 'Terraform', 'Docker', 'Kubernetes'],
    description: 'Support the infrastructure team in deploying and managing cloud resources, automating deployments with CI/CD pipelines.',
    status: 'active',
    deadline: '2024-08-15',
    postedDate: '2024-07-05',
  },
  {
    _id: 'oint_005',
    title: 'Machine Learning Intern',
    organization: { _id: 'org_003', name: 'NeuralWorks AI', industry: 'Artificial Intelligence' },
    location: 'Hyderabad (On-site)',
    stipend: 18000,
    duration: '6 months',
    openings: 2,
    skills: ['Python', 'PyTorch', 'Scikit-learn', 'MLflow'],
    description: 'Work alongside research scientists to build and optimize ML models for production deployment.',
    status: 'active',
    deadline: '2024-09-01',
    postedDate: '2024-07-10',
  },
  {
    _id: 'oint_006',
    title: 'Cybersecurity Intern',
    organization: { _id: 'org_004', name: 'SecureNet Dynamics', industry: 'Cybersecurity' },
    location: 'Chennai (On-site)',
    stipend: 14000,
    duration: '5 months',
    openings: 2,
    skills: ['Network Security', 'Penetration Testing', 'SIEM', 'Python'],
    description: 'Assist the security operations center in threat analysis, vulnerability assessments, and incident response.',
    status: 'active',
    deadline: '2024-08-20',
    postedDate: '2024-07-12',
  },
  {
    _id: 'oint_007',
    title: 'Product Management Intern',
    organization: { _id: 'org_005', name: 'FinEdge Technologies', industry: 'FinTech' },
    location: 'Mumbai (Hybrid)',
    stipend: 20000,
    duration: '4 months',
    openings: 1,
    skills: ['Product Strategy', 'JIRA', 'Data Analysis', 'User Research'],
    description: 'Work with the product team to define roadmaps, write specifications, and analyze user feedback for fintech products.',
    status: 'active',
    deadline: '2024-08-10',
    postedDate: '2024-07-08',
  },
  {
    _id: 'oint_004',
    title: 'UI/UX Design Intern',
    organization: { _id: 'org_001', name: 'InnovateTech Solutions Pvt. Ltd.', industry: 'Software Development' },
    location: 'Bangalore (On-site)',
    stipend: 11000,
    duration: '4 months',
    openings: 1,
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    description: 'Design user-centered interfaces and conduct usability testing for enterprise SaaS products.',
    status: 'active',
    deadline: '2024-07-31',
    postedDate: '2024-07-01',
  },
];
