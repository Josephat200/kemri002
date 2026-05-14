import apiClient from './client';
import { IRespondent, IRespondentCreateRequest } from '@/types/respondent';
import { IApiResponse } from '@/types/api';
import { RespondentFormData } from '@/lib/validations';

const normalizeCheckbox = (value: unknown): number => (value ? 1 : 0);

const normalizeOptionalNumber = (value: unknown): number | undefined => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? undefined : numericValue;
};

const normalizeCreatePayload = (
  data: RespondentFormData
): IRespondentCreateRequest => ({
  ...data,
  older_siblings: normalizeCheckbox(data.older_siblings),
  siblings_have_partners: normalizeOptionalNumber(data.siblings_have_partners),
  parents_give_pocket_money: normalizeCheckbox(data.parents_give_pocket_money),
  pocket_money_adequate: normalizeOptionalNumber(data.pocket_money_adequate),
  guardian_visits: normalizeCheckbox(data.guardian_visits),
  has_rh_info: normalizeCheckbox(data.has_rh_info),
  rh_teacher: normalizeCheckbox(data.rh_teacher),
  rh_parents: normalizeCheckbox(data.rh_parents),
  rh_health_worker: normalizeCheckbox(data.rh_health_worker),
  rh_friends: normalizeCheckbox(data.rh_friends),
  rh_media: normalizeCheckbox(data.rh_media),
  topic_sexuality: normalizeCheckbox(data.topic_sexuality),
  topic_abstinence: normalizeCheckbox(data.topic_abstinence),
  topic_condoms: normalizeCheckbox(data.topic_condoms),
  topic_sti_hiv: normalizeCheckbox(data.topic_sti_hiv),
  topic_relationships: normalizeCheckbox(data.topic_relationships),
  info_adequate: normalizeCheckbox(data.info_adequate),
  school_visitor: normalizeOptionalNumber(data.school_visitor),
  guardian_occupation_other:
    data.guardian_occupation_other?.trim() || undefined,
});

export const respondentAPI = {
  // Create a new respondent
  create: async (data: RespondentFormData) => {
    const payload = normalizeCreatePayload(data);
    const response = await apiClient.post<IApiResponse<IRespondent>>(
      '/respondents',
      payload
    );
    return response.data.data;
  },

  // Get all respondents with pagination
  getAll: async (page: number = 1, limit: number = 20) => {
    const response = await apiClient.get<IApiResponse<{
      respondents: IRespondent[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>>('/respondents', {
      params: { page, limit },
    });
    return response.data.data;
  },

  // Get respondent by ID
  getById: async (id: number) => {
    const response = await apiClient.get<IApiResponse<IRespondent>>(
      `/respondents/${id}`
    );
    return response.data.data;
  },

  // Update respondent
  update: async (id: number, data: Partial<IRespondent>) => {
    const response = await apiClient.put<IApiResponse<IRespondent>>(
      `/respondents/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete respondent
  delete: async (id: number) => {
    const response = await apiClient.delete<IApiResponse<null>>(
      `/respondents/${id}`
    );
    return response.data;
  },

  // Get respondents by school
  getBySchool: async (schoolName: string) => {
    const response = await apiClient.get<IApiResponse<IRespondent[]>>(
      `/respondents/school/${encodeURIComponent(schoolName)}`
    );
    return response.data.data;
  },

  // Get respondents by date range
  getByDateRange: async (startDate: string, endDate: string) => {
    const response = await apiClient.get<IApiResponse<IRespondent[]>>(
      '/respondents/stats/date-range',
      {
        params: { startDate, endDate },
      }
    );
    return response.data.data;
  },

  // Get statistics
  getStatistics: async () => {
    const response = await apiClient.get<IApiResponse<any>>(
      '/respondents/stats/summary'
    );
    return response.data.data;
  },
};
