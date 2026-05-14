/**
 * Constants for Respondent Survey
 */

export const RESPONDENT_CONSTANTS = {
  // Age constraints
  MIN_AGE: 15,
  MAX_AGE: 19,

  // Stay with options
  STAY_WITH: {
    BOTH_PARENTS: 1,
    MOTHER_ONLY: 2,
    FATHER_ONLY: 3,
    OTHERS: 4,
  },

  // Guardian occupation (1-5)
  GUARDIAN_OCCUPATION: {
    EMPLOYED: 1,
    SELF_EMPLOYED: 2,
    UNEMPLOYED: 3,
    RETIRED: 4,
    OTHER: 5,
  },

  // Guardian education (1-4)
  GUARDIAN_EDUCATION: {
    NO_FORMAL: 1,
    PRIMARY: 2,
    SECONDARY: 3,
    TERTIARY: 4,
  },

  // Religion (1-5)
  RELIGION: {
    CATHOLIC: 1,
    PROTESTANT: 2,
    MUSLIM: 3,
    TRADITIONAL: 4,
    OTHER: 5,
  },

  // Financial support source (1-4)
  FINANCIAL_SUPPORT: {
    PARENTS: 1,
    RELATIVES: 2,
    GUARDIANS: 3,
    OTHER: 4,
  },

  // School visitor (1-5)
  SCHOOL_VISITOR: {
    DAILY: 1,
    WEEKLY: 2,
    MONTHLY: 3,
    RARELY: 4,
    NEVER: 5,
  },

  // RH Information sources
  RH_SOURCES: {
    TEACHER: 'rh_teacher',
    PARENTS: 'rh_parents',
    HEALTH_WORKER: 'rh_health_worker',
    FRIENDS: 'rh_friends',
    MEDIA: 'rh_media',
  },

  // RH Topics covered
  RH_TOPICS: {
    SEXUALITY: 'topic_sexuality',
    ABSTINENCE: 'topic_abstinence',
    CONDOMS: 'topic_condoms',
    STI_HIV: 'topic_sti_hiv',
    RELATIONSHIPS: 'topic_relationships',
  },

  // Boolean values
  BOOLEAN: {
    NO: 0,
    YES: 1,
  },
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};
