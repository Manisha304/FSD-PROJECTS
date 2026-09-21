-- Initial migration gener ated from schema.prisma (2026-06-22)

-- Enum types
CREATE TYPE "UserRole" AS ENUM ('CLIENT','AGENT','ADMIN');
CREATE TYPE "ServiceCategory" AS ENUM ('CREDIT','SAVINGS','INSURANCE','PENSION','SOCIAL');
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED','AGENT_REVIEW','DOCUMENTS_PENDING','DOCUMENTS_VERIFIED','ADMIN_REVIEW','BANK_SELECTION','SENT_TO_BANK','UNDER_BANK_REVIEW','APPROVED','REJECTED','COMPLETED');
CREATE TYPE "DocumentVerificationStatus" AS ENUM ('PENDING','VERIFIED','REJECTED');
CREATE TYPE "ReviewType" AS ENUM ('AGENT_REVIEW','ADMIN_REVIEW','BANK_REVIEW');
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING','APPROVED','REJECTED');
CREATE TYPE "NotificationType" AS ENUM ('INFO','WARNING','SUCCESS','ERROR');
CREATE TYPE "EligibilityStatus" AS ENUM ('ELIGIBLE','INELIGIBLE','PENDING');
CREATE TYPE "LoanType" AS ENUM ('PERSONAL_LOAN','HOME_LOAN','EDUCATION_LOAN','BUSINESS_LOAN');
CREATE TYPE "SavingsType" AS ENUM ('FD_RD','SENIOR_CITIZEN_SAVINGS','GOAL_BASED_INVESTMENTS','TAX_SAVING_INVESTMENTS');
CREATE TYPE "InsuranceType" AS ENUM ('LIFE_INSURANCE','HEALTH_INSURANCE','VEHICLE_INSURANCE','TERM_INSURANCE');
CREATE TYPE "PensionType" AS ENUM ('NPS','APY','PM_SYM','SENIOR_CITIZEN_PENSION');
CREATE TYPE "SocialSchemeType" AS ENUM ('ESHRAM','PM_KISAN','LABOUR_WELFARE','SCHOLARSHIP_SCHEMES');

-- Core tables

CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  role "UserRole" NOT NULL DEFAULT 'CLIENT',
  "dateOfBirth" TIMESTAMPTZ,
  gender TEXT,
  city TEXT,
  state TEXT,
  "profilePicture" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Service" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category "ServiceCategory" NOT NULL,
  "eligibilityRules" TEXT,
  "requiredDocuments" TEXT,
  "optionalDocuments" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Service_name_category_unique" UNIQUE (name, category)
);

CREATE TABLE "BankPartner" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  "contactPerson" TEXT,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  "bankCode" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "registeredAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "lastInteractionAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "FormSchema" (
  id TEXT PRIMARY KEY,
  "serviceId" TEXT NOT NULL UNIQUE,
  "fieldGroups" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "FormSchema_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" (id) ON DELETE CASCADE
);

CREATE TABLE "Application" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "serviceCategory" "ServiceCategory" NOT NULL,
  "assignedAgentId" TEXT,
  "bankPartnerId" TEXT,
  status "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
  "formData" TEXT,
  "currentRemarks" TEXT,
  "eligibilityStatus" "EligibilityStatus" NOT NULL DEFAULT 'PENDING',
  "approvalPercentage" INTEGER DEFAULT 0,
  "estimatedAmount" NUMERIC(15,2),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Application_user_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE,
  CONSTRAINT "Application_service_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" (id) ON DELETE CASCADE,
  CONSTRAINT "Application_assignedAgent_fkey" FOREIGN KEY ("assignedAgentId") REFERENCES "User" (id) ON DELETE SET NULL,
  CONSTRAINT "Application_bankPartner_fkey" FOREIGN KEY ("bankPartnerId") REFERENCES "BankPartner" (id) ON DELETE SET NULL
);

-- Credit / Loan models

CREATE TABLE "LoanData" (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL UNIQUE,
  "loanType" "LoanType" NOT NULL,
  "loanAmount" NUMERIC(15,2) NOT NULL,
  "loanTenure" INTEGER NOT NULL,
  purpose TEXT,
  "employmentType" TEXT,
  "companyName" TEXT,
  occupation TEXT,
  "workExperience" INTEGER,
  "monthlyIncome" NUMERIC(15,2),
  "existingEmi" NUMERIC(15,2),
  "existingLoans" TEXT,
  "creditScore" INTEGER,
  "bankName" TEXT,
  "loanSpecificDetails" TEXT,
  "propertyType" TEXT,
  "propertyValue" NUMERIC(15,2),
  "propertyAge" INTEGER,
  "propertyLocation" TEXT,
  "courseName" TEXT,
  "institutionName" TEXT,
  "admissionYear" INTEGER,
  "courseDuration" INTEGER,
  "totalFees" NUMERIC(15,2),
  "businessName" TEXT,
  "businessType" TEXT,
  "businessVintage" INTEGER,
  "annualTurnover" NUMERIC(15,2),
  gstin TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "LoanData_application_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" (id) ON DELETE CASCADE
);

CREATE TABLE "LoanCalculation" (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL,
  "monthlyEmi" NUMERIC(15,2) NOT NULL,
  "totalInterest" NUMERIC(15,2) NOT NULL,
  "totalPayment" NUMERIC(15,2) NOT NULL,
  "maxEligibleAmount" NUMERIC(15,2) NOT NULL,
  "interestRate" NUMERIC(5,2) NOT NULL,
  "recommendedBanks" TEXT,
  "approvalProbability" INTEGER,
  "riskLevel" TEXT,
  "calculatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "LoanCalculation_application_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" (id) ON DELETE CASCADE
);

-- Savings models

CREATE TABLE "SavingsData" (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL UNIQUE,
  "savingsType" "SavingsType" NOT NULL,
  "depositAmount" NUMERIC(15,2) NOT NULL,
  tenure INTEGER NOT NULL,
  "interestPayout" TEXT,
  "bankAccount" TEXT,
  "ifscCode" TEXT,
  "nomineeName" TEXT,
  "nomineeRelation" TEXT,
  "investmentType" TEXT,
  "goalName" TEXT,
  "targetAmount" NUMERIC(15,2),
  "timeHorizon" INTEGER,
  "monthlyInvestmentCapacity" NUMERIC(15,2),
  "riskTolerance" TEXT,
  "taxRegime" TEXT,
  "panNumber" TEXT,
  "ageProof" INTEGER,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "SavingsData_application_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" (id) ON DELETE CASCADE
);

CREATE TABLE "SavingsCalculation" (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL,
  "totalInvestment" NUMERIC(15,2) NOT NULL,
  "maturityAmount" NUMERIC(15,2) NOT NULL,
  "estimatedReturns" NUMERIC(15,2) NOT NULL,
  "taxSaved" NUMERIC(15,2),
  "interestEarned" NUMERIC(15,2) NOT NULL,
  "monthlyInvestment" NUMERIC(15,2),
  "calculatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "SavingsCalculation_application_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" (id) ON DELETE CASCADE
);

-- Insurance models

CREATE TABLE "InsuranceData" (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL UNIQUE,
  "insuranceType" "InsuranceType" NOT NULL,
  "policyType" TEXT,
  "sumAssured" NUMERIC(15,2) NOT NULL,
  "policyTerm" INTEGER NOT NULL,
  "nomineeName" TEXT,
  "nomineeRelation" TEXT,
  "coverageAmount" NUMERIC(15,2),
  "familySize" INTEGER,
  "preExistingDiseases" TEXT,
  "smokerStatus" TEXT,
  "policyTypeHealth" TEXT,
  "cashlessNetwork" TEXT,
  "vehicleType" TEXT,
  "vehicleMake" TEXT,
  "vehicleModel" TEXT,
  "mfgYear" INTEGER,
  "registrationNo" TEXT,
  idv NUMERIC(15,2),
  "existingPolicy" TEXT,
  "insuranceTypeVehicle" TEXT,
  "premiumPaymentMode" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "InsuranceData_application_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" (id) ON DELETE CASCADE
);

CREATE TABLE "InsuranceCalculation" (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL,
  "premiumAmount" NUMERIC(15,2) NOT NULL,
  "coverageAmount" NUMERIC(15,2) NOT NULL,
  "claimSettlementRatio" NUMERIC(5,2) NOT NULL,
  "totalCostAtMaturity" NUMERIC(15,2),
  "calculatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "InsuranceCalculation_application_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" (id) ON DELETE CASCADE
);

-- Pension models

CREATE TABLE "PensionData" (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL UNIQUE,
  "pensionType" "PensionType" NOT NULL,
  "monthlyContribution" NUMERIC(15,2),
  "pranNumber" TEXT,
  "investmentPattern" TEXT,
  "subscriberType" TEXT,
  "assetAllocation" TEXT,
  "desiredPensionAmount" INTEGER,
  "monthlyIncome" NUMERIC(15,2),
  "cscVleId" TEXT,
  "spouseName" TEXT,
  "age" INTEGER,
  "existingPension" TEXT,
  "nomineeName" TEXT,
  "nomineeRelation" TEXT,
  "bankAccount" TEXT,
  "ifscCode" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "PensionData_application_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" (id) ON DELETE CASCADE
);

CREATE TABLE "PensionCalculation" (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL,
  "monthlyPension" NUMERIC(15,2) NOT NULL,
  "totalCorpus" NUMERIC(15,2) NOT NULL,
  "withdrawalAmount" NUMERIC(15,2),
  "yearsOfPension" INTEGER,
  "calculatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "PensionCalculation_application_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" (id) ON DELETE CASCADE
);

-- Social scheme models

CREATE TABLE "SocialData" (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL UNIQUE,
  "schemeType" "SocialSchemeType" NOT NULL,
  "occupationCode" TEXT,
  "skillCertificate" TEXT,
  "bloodGroup" TEXT,
  "bankLinked" BOOLEAN,
  "landSize" NUMERIC(10,2),
  "cropType" TEXT,
  "aadhaarLinked" BOOLEAN,
  "labourCategory" TEXT,
  "unionRegistration" TEXT,
  "yearsInProfession" INTEGER,
  "monthlyWage" NUMERIC(15,2),
  "educationLevel" TEXT,
  "institutionName" TEXT,
  "courseName" TEXT,
  "annualFamilyIncome" NUMERIC(15,2),
  "previousYearMarks" NUMERIC(5,2),
  category TEXT,
  "bankAccount" TEXT,
  "ifscCode" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "SocialData_application_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" (id) ON DELETE CASCADE
);

-- Documents, Eligibility, Reviews, Notifications

CREATE TABLE "Document" (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "documentType" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "fileSize" INTEGER,
  "fileType" TEXT NOT NULL,
  "verificationStatus" "DocumentVerificationStatus" NOT NULL DEFAULT 'PENDING',
  "rejectionReason" TEXT,
  "verifiedAt" TIMESTAMPTZ,
  "verifiedBy" TEXT,
  "verificationNotes" TEXT,
  "uploadedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Document_application_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" (id) ON DELETE CASCADE,
  CONSTRAINT "Document_user_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE
);

CREATE TABLE "Eligibility" (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL UNIQUE,
  "isEligible" BOOLEAN NOT NULL,
  "eligibilityScore" INTEGER NOT NULL,
  "eligibilityReasons" TEXT,
  "rejectionReasons" TEXT,
  "requiredDocuments" TEXT,
  "missingDocuments" TEXT,
  "checkedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "expiryDate" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Eligibility_application_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" (id) ON DELETE CASCADE
);

CREATE TABLE "ApplicationReview" (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL,
  "reviewerId" TEXT NOT NULL,
  "reviewType" "ReviewType" NOT NULL,
  status "ReviewStatus" NOT NULL DEFAULT 'PENDING',
  comments TEXT,
  "recommendedAmount" NUMERIC(15,2),
  rating INTEGER,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "ApplicationReview_application_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" (id) ON DELETE CASCADE,
  CONSTRAINT "ApplicationReview_reviewer_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" (id) ON DELETE CASCADE
);

CREATE TABLE "Notification" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "applicationId" TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type "NotificationType" NOT NULL DEFAULT 'INFO',
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "actionUrl" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Notification_user_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE,
  CONSTRAINT "Notification_application_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" (id) ON DELETE SET NULL
);

-- Indexes for performance (examples)
CREATE INDEX "idx_application_user" ON "Application" ("userId");
CREATE INDEX "idx_application_status" ON "Application" (status);
CREATE INDEX "idx_document_application" ON "Document" ("applicationId");

-- End of migration
