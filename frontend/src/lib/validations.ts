import { z } from 'zod';

export const respondentSchema = z.object({
  serial_no: z.string().min(1, 'Serial number is required').max(20),
  school_name: z.string().min(1, 'School name is required').max(100),
  supervisor_name: z.string().min(1, 'Supervisor name is required').max(100),
  collection_date: z.string().min(1, 'Collection date is required'),
  age: z.number().int().min(15).max(19),
  stay_with: z.number().int().min(1).max(4),
  guardian_occupation: z.number().int().min(1).max(5),
  guardian_occupation_other: z.string().max(100).optional(),
  guardian_education: z.number().int().min(1).max(4),
  religion: z.number().int().min(1).max(5),
  family_size: z.number().int().min(1),
  older_siblings: z.number().int().refine((val) => val === 0 || val === 1),
  siblings_have_partners: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  parents_give_pocket_money: z.number().int().refine((val) => val === 0 || val === 1),
  pocket_money_adequate: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  financial_support_source: z.number().int().min(1).max(4),
  guardian_visits: z.number().int().refine((val) => val === 0 || val === 1),
  school_visitor: z.preprocess(
    (value) => {
      if (value === '' || value === null || value === undefined) {
        return undefined;
      }
      return Number(value);
    },
    z.number().int().min(1).max(5).optional()
  ),
  has_rh_info: z.number().int().refine((val) => val === 0 || val === 1),
  rh_teacher: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  rh_parents: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  rh_health_worker: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  rh_friends: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  rh_media: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  topic_sexuality: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  topic_abstinence: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  topic_condoms: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  topic_sti_hiv: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  topic_relationships: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  info_adequate: z.number().int().refine((val) => val === 0 || val === 1),
});

export type RespondentFormData = z.infer<typeof respondentSchema>;
