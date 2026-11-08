const en = {
  // ---- Brand / Nav ----
  brand: 'G-Scores',
  nav: {
    dashboard: 'Dashboard',
    search: 'Search Scores',
    reports: 'Reports',
  },
  sidebarNote:
    'Based on 1,061,605 candidates from the 2024 national high school exam.',

  // ---- Dashboard ----
  dashboard: {
    title: 'Top students, group A',
    description: 'The ten highest combined scores in Math, Physics and Chemistry.',
    loading: 'Loading top students. The first load can take a few seconds.',
    colRank: 'Rank',
    colSbd: 'Registration number',
    colMath: 'Math',
    colPhysics: 'Physics',
    colChemistry: 'Chemistry',
    colTotal: 'Total',
  },

  // ---- Search ----
  search: {
    title: 'Search scores',
    description:
      "Enter an 8-digit registration number to see that student's results in every subject.",
    labelSbd: 'Registration number',
    placeholder: 'e.g. 01000001',
    buttonLookup: 'Look up scores',
    buttonLoading: 'Looking up...',
    hintNoNumber: 'No number handy?',
    hintUse: 'Use {{sbd}}',
    validationLength: 'Enter all {{n}} digits of the registration number.',
    loadingScores: 'Looking up scores...',
    emptyState: 'Scores appear here once you look up a registration number.',
    labelRegNumber: 'Registration number',
    labelForeignCode: 'Foreign language code',
    slipNote: 'The ticks on each bar mark the 4, 6 and 8 point levels.',
    notTaken: 'Not taken',
  },

  // ---- Subjects ----
  subjects: {
    math: 'Math',
    literature: 'Literature',
    foreignLanguage: 'Foreign Language',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    history: 'History',
    geography: 'Geography',
    civicEducation: 'Civic Education',
  },

  // ---- Reports ----
  reports: {
    title: 'Score distribution',
    description:
      'How many students fall into each score level, by subject. Students who did not take a subject are left out of its count.',
    loading: 'Counting scores. The first load can take a few seconds.',
    scrollHint: 'Swipe sideways to see all subjects.',
    viewNumbers: 'View the numbers',
    colSubject: 'Subject',
    colStudents: 'Students',
  },

  // ---- Levels ----
  levels: {
    excellent: 'Excellent',
    good: 'Good',
    average: 'Average',
    poor: 'Poor',
    ranges: {
      excellent: '8 and above',
      good: '6 to under 8',
      average: '4 to under 6',
      poor: 'Below 4',
    },
  },

  // ---- Shared ----
  shared: {
    tryAgain: 'Try again',
    errorServer: 'Cannot reach the server. It may be waking up, please try again.',
  },
} as const

export default en

