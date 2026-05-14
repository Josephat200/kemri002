export const RESPONDENT_CONSTANTS = {
  STAY_WITH: {
    1: 'Both Parents',
    2: 'Mother Only',
    3: 'Father Only',
    4: 'Others',
  },
  GUARDIAN_OCCUPATION: {
    1: 'Employed',
    2: 'Self-Employed',
    3: 'Unemployed',
    4: 'Retired',
    5: 'Other',
  },
  GUARDIAN_EDUCATION: {
    1: 'No Formal Education',
    2: 'Primary',
    3: 'Secondary',
    4: 'Tertiary',
  },
  RELIGION: {
    1: 'Catholic',
    2: 'Protestant',
    3: 'Muslim',
    4: 'Traditional',
    5: 'Other',
  },
  FINANCIAL_SUPPORT: {
    1: 'Parents',
    2: 'Relatives',
    3: 'Guardians',
    4: 'Other',
  },
  SCHOOL_VISITOR: {
    1: 'Daily',
    2: 'Weekly',
    3: 'Monthly',
    4: 'Rarely',
    5: 'Never',
  },
};

export const AGE_OPTIONS = [15, 16, 17, 18, 19];
export const FAMILY_SIZE_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 1);
