export const iconSVG = {
  savings: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 20s8-4.5 8-10V6l-8-3-8 3v4c0 5.5 8 10 8 10z"/>`,
  credit: `<path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>`,
  insurance: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>`,
  pension: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
  social: `<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>`,
};

const FIELD_GROUPS = {
  personalInfo: [
    { n: 'fullName', l: 'Full Name', t: 'text' },
    { n: 'mobileNumber', l: 'Mobile Number', t: 'tel' },
    { n: 'email', l: 'Email', t: 'email' },
    { n: 'dateOfBirth', l: 'Date Of Birth', t: 'date' },
    { n: 'gender', l: 'Gender', t: 'select', o: ['Male', 'Female', 'Other'] },
    { n: 'city', l: 'City', t: 'text' },
    { n: 'state', l: 'State', t: 'text' },
  ],
  employmentInfo: [
    { n: 'employmentType', l: 'Employment Type', t: 'select', o: ['Salaried', 'Self-Employed', 'Business Owner', 'Freelancer', 'Unemployed', 'Retired'] },
    { n: 'companyName', l: 'Company Name', t: 'text' },
    { n: 'occupation', l: 'Occupation', t: 'text' },
    { n: 'workExperience', l: 'Work Experience (Years)', t: 'number' },
  ],
  financialInfo: [
    { n: 'monthlyIncome', l: 'Monthly Income (₹)', t: 'number' },
    { n: 'existingEmi', l: 'Existing EMI (₹)', t: 'number' },
    { n: 'existingLoans', l: 'Existing Loans', t: 'select', o: ['None', 'Home Loan', 'Vehicle Loan', 'Personal Loan', 'Education Loan', 'Multiple'] },
    { n: 'creditScore', l: 'Credit Score', t: 'number' },
    { n: 'bankName', l: 'Bank Name', t: 'text' },
  ],
  loanInfo: [
    { n: 'loanAmount', l: 'Loan Amount (₹)', t: 'number' },
    { n: 'loanTenure', l: 'Loan Tenure (Months)', t: 'number' },
    { n: 'purpose', l: 'Purpose of Loan', t: 'text' },
  ],
  savingsInfo: [
    { n: 'investmentAmount', l: 'Investment Amount (₹)', t: 'number' },
    { n: 'tenure', l: 'Tenure (Months)', t: 'number' },
    { n: 'nomineeName', l: 'Nominee Name', t: 'text' },
    { n: 'nomineeRelation', l: 'Nominee Relationship', t: 'text' },
  ],
  insuranceInfo: [
    { n: 'coverageAmount', l: 'Coverage Amount (₹)', t: 'number' },
    { n: 'familySize', l: 'Family Size', t: 'number' },
    { n: 'preExistingDiseases', l: 'Pre-existing Diseases', t: 'select', o: ['None', 'Diabetes', 'Heart Disease', 'Asthma', 'Other'] },
    { n: 'smokerStatus', l: 'Smoker Status', t: 'select', o: ['Yes', 'No'] },
  ],
  pensionInfo: [
    { n: 'desiredPension', l: 'Desired Monthly Pension (₹)', t: 'number' },
    { n: 'currentAge', l: 'Current Age', t: 'number' },
    { n: 'retirementAge', l: 'Expected Retirement Age', t: 'number' },
    { n: 'existingPension', l: 'Existing Pension Scheme', t: 'select', o: ['None', 'NPS', 'APY', 'Other'] },
  ],
  socialInfo: [
    { n: 'workerCategory', l: 'Worker Category', t: 'text' },
    { n: 'schemeType', l: 'Scheme Type', t: 'text' },
    { n: 'bankAccount', l: 'Bank Account Number', t: 'text' },
    { n: 'ifscCode', l: 'IFSC Code', t: 'text' },
  ],
  addressInfo: [
    { n: 'address', l: 'Full Address', t: 'textarea' },
    { n: 'pincode', l: 'Pincode', t: 'text' },
  ],
  nomineeInfo: [
    { n: 'nomineeName', l: 'Nominee Name', t: 'text' },
    { n: 'nomineeRelation', l: 'Nominee Relationship', t: 'text' },
  ],
};

export const DOCUMENTS = {
  aadhaarFront: { id: 'aadhaarFront', label: 'Aadhaar Card (Front)', type: 'image' },
  aadhaarBack: { id: 'aadhaarBack', label: 'Aadhaar Card (Back)', type: 'image' },
  panCard: { id: 'panCard', label: 'PAN Card', type: 'image' },
  passportPhoto: { id: 'passportPhoto', label: 'Passport Size Photo', type: 'image' },
  salarySlip: { id: 'salarySlip', label: 'Salary Slip (Last 3 Months)', type: 'image' },
  bankStatement: { id: 'bankStatement', label: 'Bank Statement (Last 6 Months)', type: 'image' },
  propertyDocs: { id: 'propertyDocs', label: 'Property Documents', type: 'image' },
  vehicleQuotation: { id: 'vehicleQuotation', label: 'Vehicle Quotation', type: 'image' },
  goldPhotos: { id: 'goldPhotos', label: 'Gold Ornament Photos', type: 'image' },
  admissionLetter: { id: 'admissionLetter', label: 'Admission Letter', type: 'image' },
  gstCertificate: { id: 'gstCertificate', label: 'GST Certificate', type: 'image' },
  landDocs: { id: 'landDocs', label: 'Land Documents', type: 'image' },
  incomeTaxReturns: { id: 'incomeTaxReturns', label: 'Income Tax Returns (Last 2 Years)', type: 'image' },
  udyamCertificate: { id: 'udyamCertificate', label: 'Udyam / MSME Certificate', type: 'image' },
  medicalReports: { id: 'medicalReports', label: 'Medical Reports', type: 'image' },
  hospitalBills: { id: 'hospitalBills', label: 'Hospital Bills / Estimate', type: 'image' },
  feeStructure: { id: 'feeStructure', label: 'Fee Structure from Institution', type: 'image' },
  businessProof: { id: 'businessProof', label: 'Business Proof / Trade License', type: 'image' },
  soilTestReport: { id: 'soilTestReport', label: 'Soil Test Report', type: 'image' },
  cropPhoto: { id: 'cropPhoto', label: 'Crop Photos', type: 'image' },
  deathCertificate: { id: 'deathCertificate', label: 'Death Certificate', type: 'image' },
  disabilityCertificate: { id: 'disabilityCertificate', label: 'Disability Certificate', type: 'image' },
  incomeCertificate: { id: 'incomeCertificate', label: 'Income Certificate', type: 'image' },
  casteCertificate: { id: 'casteCertificate', label: 'Caste Certificate', type: 'image' },
  domicileCertificate: { id: 'domicileCertificate', label: 'Domicile Certificate', type: 'image' },
  passbook: { id: 'passbook', label: 'Bank Passbook / Cancelled Cheque', type: 'image' },
  drivingLicense: { id: 'drivingLicense', label: 'Driving License', type: 'image' },
  rcBook: { id: 'rcBook', label: 'RC Book / Registration Certificate', type: 'image' },
  policyDoc: { id: 'policyDoc', label: 'Existing Policy Document', type: 'image' },
  buildingPlan: { id: 'buildingPlan', label: 'Building Plan / Approval', type: 'image' },
};

export const FEATURES = {
  emiCalculator: { id: 'emiCalculator', label: 'EMI Calculator', description: 'Calculate monthly installment with interest' },
  eligibilityChecker: { id: 'eligibilityChecker', label: 'Eligibility Checker', description: 'Check your loan eligibility instantly' },
  aiBankRecommendation: { id: 'aiBankRecommendation', label: 'AI Bank Recommendation', description: 'Get AI-powered bank suggestions' },
  interestRateComparison: { id: 'interestRateComparison', label: 'Interest Rate Comparison', description: 'Compare rates across banks' },
  repaymentSchedule: { id: 'repaymentSchedule', label: 'Repayment Schedule', description: 'View complete repayment timeline' },
  approvalProbability: { id: 'approvalProbability', label: 'Approval Probability', description: 'AI predicts your approval chances' },
  riskAssessment: { id: 'riskAssessment', label: 'Risk Assessment', description: 'Evaluate financial risk profile' },
  returnsCalculator: { id: 'returnsCalculator', label: 'Returns Calculator', description: 'Calculate expected returns' },
  taxBenefits: { id: 'taxBenefits', label: 'Tax Benefits Estimator', description: 'Estimate tax savings under 80C' },
  goalPlanner: { id: 'goalPlanner', label: 'Goal Based Planner', description: 'Plan investments for life goals' },
  sipCalculator: { id: 'sipCalculator', label: 'SIP Calculator', description: 'Calculate SIP returns over time' },
  lumpSumCalculator: { id: 'lumpSumCalculator', label: 'Lump Sum Calculator', description: 'Calculate one-time investment returns' },
  policyCompare: { id: 'policyCompare', label: 'Policy Comparison', description: 'Compare insurance plans side-by-side' },
  claimTracker: { id: 'claimTracker', label: 'Claim Tracker', description: 'Track your insurance claim status' },
  coverageAnalyzer: { id: 'coverageAnalyzer', label: 'Coverage Analyzer', description: 'Analyze your coverage gaps' },
  pensionCalculator: { id: 'pensionCalculator', label: 'Pension Calculator', description: 'Estimate monthly pension amount' },
  npsPortfolioTracker: { id: 'npsPortfolioTracker', label: 'NPS Portfolio Tracker', description: 'Track your NPS investment' },
  retirementPlanner: { id: 'retirementPlanner', label: 'Retirement Planner', description: 'Plan retirement corpus' },
  subsidyChecker: { id: 'subsidyChecker', label: 'Subsidy Eligibility Checker', description: 'Check eligible government subsidies' },
  benefitCalculator: { id: 'benefitCalculator', label: 'Benefit Calculator', description: 'Calculate total welfare benefits' },
};

export const RESULTS = {
  eligibilityScore: { id: 'eligibilityScore', label: 'Eligibility Score', type: 'percentage' },
  approvalProbability: { id: 'approvalProbability', label: 'Approval Probability', type: 'percentage' },
  riskLevel: { id: 'riskLevel', label: 'Risk Level', type: 'tag' },
  recommendedBanks: { id: 'recommendedBanks', label: 'Recommended Banks', type: 'list' },
  monthlyEmi: { id: 'monthlyEmi', label: 'Monthly EMI', type: 'currency' },
  maxEligibleAmount: { id: 'maxEligibleAmount', label: 'Maximum Eligible Amount', type: 'currency' },
  totalInterest: { id: 'totalInterest', label: 'Total Interest Payable', type: 'currency' },
  totalPayment: { id: 'totalPayment', label: 'Total Payment', type: 'currency' },
  maturityAmount: { id: 'maturityAmount', label: 'Maturity Amount', type: 'currency' },
  totalInvestment: { id: 'totalInvestment', label: 'Total Investment', type: 'currency' },
  estimatedReturns: { id: 'estimatedReturns', label: 'Estimated Returns', type: 'currency' },
  taxSaved: { id: 'taxSaved', label: 'Tax Saved', type: 'currency' },
  premiumAmount: { id: 'premiumAmount', label: 'Premium Amount', type: 'currency' },
  coverageAmount: { id: 'coverageAmount', label: 'Coverage Amount', type: 'currency' },
  claimSettlementRatio: { id: 'claimSettlementRatio', label: 'Claim Settlement Ratio', type: 'percentage' },
  monthlyPension: { id: 'monthlyPension', label: 'Monthly Pension', type: 'currency' },
  totalCorpus: { id: 'totalCorpus', label: 'Total Corpus', type: 'currency' },
  withdrawalAmount: { id: 'withdrawalAmount', label: 'Withdrawal Amount', type: 'currency' },
  subsidyAmount: { id: 'subsidyAmount', label: 'Eligible Subsidy Amount', type: 'currency' },
  benefitAmount: { id: 'benefitAmount', label: 'Total Benefit Amount', type: 'currency' },
  scholarshipAmount: { id: 'scholarshipAmount', label: 'Scholarship Amount', type: 'currency' },
};

function fl(groups, custom) {
  const fields = [];
  for (const g of groups || []) {
    const group = FIELD_GROUPS[g];
    if (group) fields.push(...group);
  }
  for (const c of custom || []) {
    fields.push(c);
  }
  return fields;
}

const SERVICE_LISTS = {
  credit: [
    {
      id: 'personal_loan', name: 'Personal Loan',
      groups: ['personalInfo', 'employmentInfo', 'financialInfo', 'loanInfo', 'addressInfo'],
      customFields: [],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto', 'salarySlip', 'bankStatement'],
      optionalDocs: [],
      features: ['emiCalculator', 'eligibilityChecker', 'aiBankRecommendation', 'interestRateComparison', 'repaymentSchedule', 'approvalProbability', 'riskAssessment'],
      results: ['eligibilityScore', 'approvalProbability', 'riskLevel', 'recommendedBanks', 'monthlyEmi', 'maxEligibleAmount'],
    },
    {
      id: 'home_loan', name: 'Home Loan',
      groups: ['personalInfo', 'employmentInfo', 'financialInfo', 'loanInfo', 'addressInfo'],
      customFields: [
        { n: 'propertyType', l: 'Property Type', t: 'select', o: ['Apartment', 'Independent House', 'Villa', 'Plot', 'Commercial'] },
        { n: 'propertyValue', l: 'Property Value (₹)', t: 'number' },
        { n: 'propertyAge', l: 'Property Age (Years)', t: 'number' },
        { n: 'propertyLocation', l: 'Property Location', t: 'text' },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto', 'salarySlip', 'bankStatement', 'propertyDocs'],
      optionalDocs: ['incomeTaxReturns'],
      features: ['emiCalculator', 'eligibilityChecker', 'aiBankRecommendation', 'interestRateComparison', 'repaymentSchedule', 'approvalProbability', 'riskAssessment'],
      results: ['eligibilityScore', 'approvalProbability', 'riskLevel', 'recommendedBanks', 'monthlyEmi', 'maxEligibleAmount'],
    },
    {
      id: 'education_loan', name: 'Education Loan',
      groups: ['personalInfo', 'financialInfo', 'addressInfo'],
      customFields: [
        { n: 'courseName', l: 'Course Name', t: 'text' },
        { n: 'institutionName', l: 'Institution Name', t: 'text' },
        { n: 'admissionYear', l: 'Admission Year', t: 'number' },
        { n: 'courseDuration', l: 'Course Duration (Years)', t: 'number' },
        { n: 'totalFees', l: 'Total Course Fees (₹)', t: 'number' },
        { n: 'loanAmount', l: 'Loan Amount Required (₹)', t: 'number' },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto', 'admissionLetter', 'feeStructure'],
      optionalDocs: ['incomeTaxReturns', 'bankStatement'],
      features: ['emiCalculator', 'eligibilityChecker', 'interestRateComparison', 'repaymentSchedule', 'approvalProbability'],
      results: ['eligibilityScore', 'approvalProbability', 'riskLevel', 'monthlyEmi', 'maxEligibleAmount'],
    },
    {
      id: 'business_loan', name: 'Business Loan',
      groups: ['personalInfo', 'employmentInfo', 'financialInfo', 'loanInfo', 'addressInfo'],
      customFields: [
        { n: 'businessName', l: 'Business Name', t: 'text' },
        { n: 'businessType', l: 'Business Type', t: 'select', o: ['Sole Proprietorship', 'Partnership', 'Private Limited', 'LLP', 'Others'] },
        { n: 'businessVintage', l: 'Business Vintage (Years)', t: 'number' },
        { n: 'annualTurnover', l: 'Annual Turnover (₹)', t: 'number' },
        { n: 'gstin', l: 'GSTIN', t: 'text' },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto', 'gstCertificate', 'bankStatement', 'businessProof'],
      optionalDocs: ['incomeTaxReturns', 'udyamCertificate'],
      features: ['emiCalculator', 'eligibilityChecker', 'aiBankRecommendation', 'interestRateComparison', 'repaymentSchedule', 'approvalProbability', 'riskAssessment'],
      results: ['eligibilityScore', 'approvalProbability', 'riskLevel', 'recommendedBanks', 'monthlyEmi', 'maxEligibleAmount'],
    },
    ],

  savings: [
    {
      id: 'fd_rd',name: 'FD & RD Deposits',
      groups: ['personalInfo', 'addressInfo'],
      customFields: [
        { n: 'depositAmount', l: 'Deposit Amount (₹)', t: 'number' },
        { n: 'tenure', l: 'Tenure (Months)', t: 'number' },
        { n: 'interestPayout', l: 'Interest Payout', t: 'select', o: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'At Maturity'] },
        { n: 'bankAccount', l: 'Linked Bank Account', t: 'text' },
        { n: 'ifscCode', l: 'IFSC Code', t: 'text' },
      ],
      nomineeInfo: true,
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto', 'passbook'],
      optionalDocs: [],
      features: ['returnsCalculator', 'interestRateComparison'],
      results: ['maturityAmount', 'totalInvestment', 'estimatedReturns'],
    },
    
    
    
    {
      id: 'senior_citizen_savings', name: 'Senior Citizen Savings Scheme (SCSS)',
      groups: ['personalInfo', 'addressInfo'],
      customFields: [
        { n: 'depositAmount', l: 'Deposit Amount (₹)', t: 'number' },
        { n: 'tenure', l: 'Tenure (Years)', t: 'number' },
        { n: 'bankAccount', l: 'Linked Bank Account', t: 'text' },
        { n: 'ifscCode', l: 'IFSC Code', t: 'text' },
        { n: 'nomineeName', l: 'Nominee Name', t: 'text' },
        { n: 'nomineeRelation', l: 'Nominee Relationship', t: 'text' },
        { n: 'ageProof', l: 'Age (Must be 60+)', t: 'number' },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto', 'passbook'],
      optionalDocs: [],
      features: ['returnsCalculator', 'taxBenefits'],
      results: ['maturityAmount', 'totalInvestment', 'estimatedReturns'],
    },
    {
      id: 'goal_based_investments', name: 'Goal Based Investments',
      groups: ['personalInfo', 'financialInfo', 'addressInfo'],
      customFields: [
        { n: 'goalName', l: 'Goal Name', t: 'select', o: ['Child Education', 'Retirement', 'Home Purchase', 'Wedding', 'Travel', 'Emergency Fund', 'Wealth Creation'] },
        { n: 'targetAmount', l: 'Target Amount (₹)', t: 'number' },
        { n: 'timeHorizon', l: 'Time Horizon (Years)', t: 'number' },
        { n: 'monthlyInvestment', l: 'Monthly Investment Capacity (₹)', t: 'number' },
        { n: 'riskTolerance', l: 'Risk Tolerance', t: 'select', o: ['Low', 'Medium', 'High'] },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto'],
      optionalDocs: [],
      features: ['goalPlanner', 'returnsCalculator', 'sipCalculator', 'lumpSumCalculator'],
      results: ['totalInvestment', 'estimatedReturns', 'monthlyEmi', 'maturityAmount'],
    },
    {
      id: 'tax_saving_investments', name: 'Tax Saving Investments',
      groups: ['personalInfo', 'financialInfo', 'addressInfo'],
      customFields: [
        { n: 'investmentAmount', l: 'Investment Amount (₹)', t: 'number' },
        { n: 'investmentType', l: 'Investment Type', t: 'select', o: ['ELSS', 'PPF', 'NSC', 'Tax Saving FD', 'ULIP', 'Senior Citizen Savings'] },
        { n: 'taxRegime', l: 'Tax Regime', t: 'select', o: ['Old Regime', 'New Regime'] },
        { n: 'panNumber', l: 'PAN Number', t: 'text' },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto'],
      optionalDocs: [],
      features: ['taxBenefits', 'returnsCalculator', 'goalPlanner'],
      results: ['taxSaved', 'totalInvestment', 'estimatedReturns', 'maturityAmount'],
    },
  ],

  insurance: [
    {
      id: 'life_insurance', name: 'Life Insurance',
      groups: ['personalInfo', 'employmentInfo', 'insuranceInfo', 'addressInfo'],
      customFields: [
        { n: 'policyType', l: 'Policy Type', t: 'select', o: ['Term Plan', 'Whole Life', 'Endowment', 'ULIP', 'Money Back'] },
        { n: 'sumAssured', l: 'Sum Assured (₹)', t: 'number' },
        { n: 'policyTerm', l: 'Policy Term (Years)', t: 'number' },
        { n: 'nomineeName', l: 'Nominee Name', t: 'text' },
        { n: 'nomineeRelation', l: 'Nominee Relationship', t: 'text' },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto'],
      optionalDocs: ['medicalReports', 'incomeTaxReturns'],
      features: ['policyCompare', 'coverageAnalyzer', 'claimTracker'],
      results: ['premiumAmount', 'coverageAmount', 'claimSettlementRatio'],
    },
    {
      id: 'health_insurance', name: 'Health Insurance',
      groups: ['personalInfo', 'insuranceInfo', 'addressInfo'],
      customFields: [
        { n: 'policyType', l: 'Policy Type', t: 'select', o: ['Individual', 'Family Floater', 'Critical Illness', 'Senior Citizen', 'Top-Up'] },
        { n: 'sumAssured', l: 'Sum Assured (₹)', t: 'number' },
        { n: 'policyTerm', l: 'Policy Term (Years)', t: 'number' },
        { n: 'cashlessNetwork', l: 'Prefer Cashless Network?', t: 'select', o: ['Yes', 'No'] },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto'],
      optionalDocs: ['medicalReports'],
      features: ['policyCompare', 'coverageAnalyzer', 'claimTracker'],
      results: ['premiumAmount', 'coverageAmount', 'claimSettlementRatio'],
    },
    {
      id: 'vehicle_insurance', name: 'Vehicle Insurance',
      groups: ['personalInfo', 'addressInfo'],
      customFields: [
        { n: 'insuranceType', l: 'Insurance Type', t: 'select', o: ['Third Party', 'Comprehensive', 'Own Damage'] },
        { n: 'vehicleType', l: 'Vehicle Type', t: 'select', o: ['2-Wheeler', '4-Wheeler', 'Commercial Vehicle'] },
        { n: 'vehicleMake', l: 'Vehicle Make', t: 'text' },
        { n: 'vehicleModel', l: 'Vehicle Model', t: 'text' },
        { n: 'mfgYear', l: 'Manufacturing Year', t: 'number' },
        { n: 'registrationNo', l: 'Registration Number', t: 'text' },
        { n: 'idv', l: 'Insured Declared Value (₹)', t: 'number' },
        { n: 'existingPolicy', l: 'Existing Policy?', t: 'select', o: ['Yes - Renew', 'No - New'] },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'rcBook', 'drivingLicense'],
      optionalDocs: ['policyDoc'],
      features: ['policyCompare', 'claimTracker'],
      results: ['premiumAmount', 'coverageAmount', 'claimSettlementRatio'],
    },
    {
      id: 'term_insurance', name: 'Term Insurance',
      groups: ['personalInfo', 'employmentInfo', 'insuranceInfo', 'addressInfo'],
      customFields: [
        { n: 'sumAssured', l: 'Coverage Amount (₹)', t: 'number' },
        { n: 'policyTerm', l: 'Policy Term (Years)', t: 'number' },
        { n: 'premiumPaymentMode', l: 'Premium Payment Mode', t: 'select', o: ['Yearly', 'Half-Yearly', 'Monthly'] },
        { n: 'nomineeName', l: 'Nominee Name', t: 'text' },
        { n: 'nomineeRelation', l: 'Nominee Relationship', t: 'text' },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto'],
      optionalDocs: ['medicalReports', 'incomeTaxReturns'],
      features: ['policyCompare', 'coverageAnalyzer', 'claimTracker'],
      results: ['premiumAmount', 'coverageAmount', 'claimSettlementRatio'],
    },
  ],

  pension: [
    {
      id: 'nps', name: 'National Pension System (NPS)',
      groups: ['personalInfo', 'employmentInfo', 'pensionInfo', 'addressInfo'],
      customFields: [
        { n: 'pranNumber', l: 'PRAN Number (If registered)', t: 'text' },
        { n: 'monthlyContribution', l: 'Monthly Contribution (₹)', t: 'number' },
        { n: 'investmentPattern', l: 'Investment Pattern', t: 'select', o: ['Auto Choice', 'Active Choice'] },
        { n: 'subscriberType', l: 'Subscriber Type', t: 'select', o: ['Government Sector', 'All Citizens', 'Corporate'] },
        { n: 'assetAllocation', l: 'Asset Allocation Preference', t: 'select', o: ['Aggressive', 'Moderate', 'Conservative'] },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto', 'passbook'],
      optionalDocs: [],
      features: ['pensionCalculator', 'npsPortfolioTracker', 'retirementPlanner'],
      results: ['monthlyPension', 'totalCorpus', 'withdrawalAmount'],
    },
    {
      id: 'apy', name: 'Atal Pension Yojana (APY)',
      groups: ['personalInfo', 'pensionInfo', 'addressInfo'],
      customFields: [
        { n: 'desiredPensionAmount', l: 'Desired Monthly Pension', t: 'select', o: ['1000', '2000', '3000', '4000', '5000'] },
        { n: 'bankAccount', l: 'Savings Bank Account No.', t: 'text' },
        { n: 'ifscCode', l: 'Branch IFSC Code', t: 'text' },
        { n: 'nomineeName', l: 'Nominee Name', t: 'text' },
        { n: 'nomineeRelation', l: 'Nominee Relationship', t: 'text' },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto', 'passbook'],
      optionalDocs: [],
      features: ['pensionCalculator', 'retirementPlanner'],
      results: ['monthlyPension', 'totalCorpus'],
    },
    {
      id: 'pm_sym', name: 'PM-SYM (Pradhan Mantri Shram Yogi Maandhan)',
      groups: ['personalInfo', 'employmentInfo', 'pensionInfo', 'addressInfo'],
      customFields: [
        { n: 'occupation', l: 'Occupation', t: 'text' },
        { n: 'monthlyIncome', l: 'Average Monthly Income (₹)', t: 'number' },
        { n: 'cscVleId', l: 'CSC / VLE ID (If any)', t: 'text' },
        { n: 'spouseName', l: 'Spouse Name (For Joint Benefit)', t: 'text' },
        { n: 'nomineeName', l: 'Nominee Name', t: 'text' },
        { n: 'nomineeRelation', l: 'Nominee Relationship', t: 'text' },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto', 'passbook'],
      optionalDocs: ['incomeCertificate'],
      features: ['pensionCalculator', 'benefitCalculator'],
      results: ['monthlyPension', 'totalCorpus'],
    },
    {
      id: 'senior_citizen_pension', name: 'Senior Citizen Pension',
      groups: ['personalInfo', 'pensionInfo', 'addressInfo'],
      customFields: [
        { n: 'age', l: 'Age', t: 'number' },
        { n: 'bankAccount', l: 'Bank Account Number', t: 'text' },
        { n: 'ifscCode', l: 'IFSC Code', t: 'text' },
        { n: 'existingPension', l: 'Receiving Any Other Pension?', t: 'select', o: ['No', 'Yes - Govt', 'Yes - Private'] },
        { n: 'nomineeName', l: 'Nominee Name', t: 'text' },
        { n: 'nomineeRelation', l: 'Nominee Relationship', t: 'text' },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto', 'passbook', 'incomeCertificate'],
      optionalDocs: ['domicileCertificate'],
      features: ['pensionCalculator', 'benefitCalculator', 'retirementPlanner'],
      results: ['monthlyPension', 'totalCorpus'],
    },
  ],

  social: [
    {
      id: 'eshram', name: 'E-SHRAM Registration',
      groups: ['personalInfo', 'employmentInfo', 'socialInfo', 'addressInfo'],
      customFields: [
        { n: 'occupationCode', l: 'Occupation (NCO Code)', t: 'text' },
        { n: 'skillCertificate', l: 'Skill Certificate', t: 'select', o: ['None', 'NSQF Registered', 'ITI', 'Other'] },
        { n: 'bloodGroup', l: 'Blood Group', t: 'select', o: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
        { n: 'bankLinked', l: 'Bank Account Linked?', t: 'select', o: ['Yes', 'No'] },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'passportPhoto', 'passbook'],
      optionalDocs: [],
      features: ['benefitCalculator', 'subsidyChecker'],
      results: ['benefitAmount', 'subsidyAmount'],
    },
    {
      id: 'pm_kisan', name: 'PM Kisan Samman Nidhi',
      groups: ['personalInfo', 'addressInfo'],
      customFields: [
        { n: 'landSize', l: 'Land Size (Acres)', t: 'number' },
        { n: 'cropType', l: 'Primary Crop', t: 'text' },
        { n: 'bankAccount', l: 'Bank Account Number', t: 'text' },
        { n: 'ifscCode', l: 'IFSC Code', t: 'text' },
        { n: 'aadhaarLinked', l: 'Aadhaar Linked with Bank?', t: 'select', o: ['Yes', 'No'] },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto', 'passbook', 'landDocs'],
      optionalDocs: [],
      features: ['benefitCalculator', 'subsidyChecker'],
      results: ['benefitAmount', 'subsidyAmount'],
    },
    {
      id: 'labour_welfare', name: 'Labour Welfare Schemes',
      groups: ['personalInfo', 'employmentInfo', 'socialInfo', 'addressInfo'],
      customFields: [
        { n: 'labourCategory', l: 'Labour Category', t: 'select', o: ['Construction', 'Factory', 'Mining', 'Plantation', 'Transport', 'Other'] },
        { n: 'unionRegistration', l: 'Union Registration No.', t: 'text' },
        { n: 'yearsInProfession', l: 'Years in Profession', t: 'number' },
        { n: 'monthlyWage', l: 'Monthly Wage (₹)', t: 'number' },
        { n: 'bankAccount', l: 'Bank Account Number', t: 'text' },
        { n: 'ifscCode', l: 'IFSC Code', t: 'text' },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto', 'passbook', 'incomeCertificate'],
      optionalDocs: ['domicileCertificate', 'casteCertificate'],
      features: ['benefitCalculator', 'subsidyChecker'],
      results: ['benefitAmount', 'subsidyAmount'],
    },
    {
      id: 'scholarship_schemes', name: 'Scholarship Schemes',
      groups: ['personalInfo', 'addressInfo'],
      customFields: [
        { n: 'educationLevel', l: 'Current Education Level', t: 'select', o: ['School (Class 1-8)', 'School (Class 9-12)', 'Undergraduate', 'Postgraduate', 'PhD', 'Vocational'] },
        { n: 'institutionName', l: 'Institution Name', t: 'text' },
        { n: 'courseName', l: 'Course Name', t: 'text' },
        { n: 'annualFamilyIncome', l: 'Annual Family Income (₹)', t: 'number' },
        { n: 'previousYearMarks', l: 'Previous Year Marks (%)', t: 'number' },
        { n: 'category', l: 'Category', t: 'select', o: ['General', 'SC', 'ST', 'OBC', 'EWS', 'Minority'] },
        { n: 'bankAccount', l: 'Bank Account Number', t: 'text' },
        { n: 'ifscCode', l: 'IFSC Code', t: 'text' },
      ],
      requiredDocs: ['aadhaarFront', 'aadhaarBack', 'panCard', 'passportPhoto', 'incomeCertificate', 'casteCertificate', 'passbook'],
      optionalDocs: ['domicileCertificate', 'feeStructure', 'admissionLetter'],
      features: ['benefitCalculator'],
      results: ['scholarshipAmount', 'benefitAmount'],
    },
  ],
};

function expandFields(groups, customFields) {
  const fields = [];
  for (const g of groups || []) {
    const group = FIELD_GROUPS[g];
    if (group) fields.push(...group);
  }
  for (const c of customFields || []) {
    fields.push(c);
  }
  return fields;
}

export const CATEGORIES = [
  {
    id: 'savings',
    name: 'Savings Services',
    desc: 'FDs, RDs, ELSS, SIPs, and investment plans',
    path: iconSVG.savings,
    schemes: SERVICE_LISTS.savings.map((s) => ({
      ...s,
      fields: expandFields(s.groups, s.customFields),
    })),
  },
  {
    id: 'credit',
    name: 'Credit Services',
    desc: 'Loans, credit cards, and micro-credit solutions',
    path: iconSVG.credit,
    schemes: SERVICE_LISTS.credit.map((s) => ({
      ...s,
      fields: expandFields(s.groups, s.customFields),
    })),
  },
  {
    id: 'insurance',
    name: 'Insurance Services',
    desc: 'Life, health, vehicle, travel, and crop insurance',
    path: iconSVG.insurance,
    schemes: SERVICE_LISTS.insurance.map((s) => ({
      ...s,
      fields: expandFields(s.groups, s.customFields),
    })),
  },
  {
    id: 'pension',
    name: 'Pension Services',
    desc: 'Retirement, pension, and old-age security schemes',
    path: iconSVG.pension,
    schemes: SERVICE_LISTS.pension.map((s) => ({
      ...s,
      fields: expandFields(s.groups, s.customFields),
    })),
  },
  {
    id: 'social',
    name: 'Social Security Services',
    desc: 'Welfare boards, subsidies, and E-SHRAM',
    path: iconSVG.social,
    schemes: SERVICE_LISTS.social.map((s) => ({
      ...s,
      fields: expandFields(s.groups, s.customFields),
    })),
  },
];
