import commonQuestionsData from './commonQuestions.json';
import savingsFAQData from './savingsFAQ.json';
import creditFAQData from './creditFAQ.json';
import insuranceFAQData from './insuranceFAQ.json';
import pensionFAQData from './pensionFAQ.json';
import socialSecurityFAQData from './socialSecurityFAQ.json';

// Extract greeting and thanks responses
const commonData = commonQuestionsData;
export const GREETING_RESPONSE = commonData.greetings[0]?.response || "Hello! Welcome to FinTech AI Assistant.";
export const THANKS_RESPONSE = commonData.thanks[0]?.response || "You're welcome! Happy to assist.";
export const AMBIGUOUS_RESPONSE = "Please ask about Savings, Credit, Insurance, Pension, or Social Security services available on this platform.";
export const UNRELATED_RESPONSE = "I can only assist with FinTech services available on this platform.";
export const CONSECUTIVE_UNRELATED_RESPONSE = "I can only assist with FinTech services available on this platform.";
export const UNAVAILABLE_RESPONSE = "I can only assist with FinTech services available on this platform.";

export const CONSECUTIVE_UNRELATED_LIMIT = 3;

// Flatten all greeting keywords
export const GREETING_KEYWORDS = commonData.greetings[0]?.keywords || [];

// Flatten all thanks keywords
export const THANKS_KEYWORDS = commonData.thanks[0]?.keywords || [];

// Flatten all common FAQ keywords
export const HELP_KEYWORDS = [
  "help", "what can you do", "how can you help", "what do you do",
  "show options", "menu", "capabilities", "features",
];

// Build comprehensive FINANCIAL_SERVICES from all categories
export const FINANCIAL_SERVICES = [];

// Add common questions
if (commonData.commonFAQ) {
  commonData.commonFAQ.forEach(faq => {
    FINANCIAL_SERVICES.push({
      id: faq.id,
      name: faq.id.replace(/_/g, ' '),
      category: 'FAQ',
      keywords: faq.keywords || [],
      response: faq.response,
    });
  });
}

// Add Savings FAQ
if (savingsFAQData.questions) {
  savingsFAQData.questions.forEach(q => {
    FINANCIAL_SERVICES.push({
      id: q.id,
      name: q.id.replace(/_/g, ' '),
      category: 'Savings',
      keywords: q.keywords || [],
      response: q.response,
    });
  });
}

// Add Credit FAQ
if (creditFAQData.questions) {
  creditFAQData.questions.forEach(q => {
    FINANCIAL_SERVICES.push({
      id: q.id,
      name: q.id.replace(/_/g, ' '),
      category: 'Credit',
      keywords: q.keywords || [],
      response: q.response,
    });
  });
}

// Add Insurance FAQ
if (insuranceFAQData.questions) {
  insuranceFAQData.questions.forEach(q => {
    FINANCIAL_SERVICES.push({
      id: q.id,
      name: q.id.replace(/_/g, ' '),
      category: 'Insurance',
      keywords: q.keywords || [],
      response: q.response,
    });
  });
}

// Add Pension FAQ
if (pensionFAQData.questions) {
  pensionFAQData.questions.forEach(q => {
    FINANCIAL_SERVICES.push({
      id: q.id,
      name: q.id.replace(/_/g, ' '),
      category: 'Pension',
      keywords: q.keywords || [],
      response: q.response,
    });
  });
}

// Add Social Security FAQ
if (socialSecurityFAQData.questions) {
  socialSecurityFAQData.questions.forEach(q => {
    FINANCIAL_SERVICES.push({
      id: q.id,
      name: q.id.replace(/_/g, ' '),
      category: 'Social',
      keywords: q.keywords || [],
      response: q.response,
    });
  });
}

export function findService(message) {
  const lower = message.toLowerCase().trim();

  for (const service of FINANCIAL_SERVICES) {
    for (const keyword of service.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        return service;
      }
    }
  }

  return null;
}

export function isGreeting(message) {
  const lower = message.toLowerCase().trim();
  if (GREETING_KEYWORDS.length === 0) return false;
  return GREETING_KEYWORDS.some((k) => lower.includes(k.toLowerCase()));
}

export function isThanks(message) {
  const lower = message.toLowerCase().trim();
  if (THANKS_KEYWORDS.length === 0) return false;
  return THANKS_KEYWORDS.some((k) => lower.includes(k.toLowerCase()));
}

export function isHelpRequest(message) {
  const lower = message.toLowerCase().trim();
  return HELP_KEYWORDS.some((k) => lower.includes(k.toLowerCase()));
}
