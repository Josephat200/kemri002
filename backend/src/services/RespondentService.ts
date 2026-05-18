import { ApiError } from '../middleware/errorHandler';
import { IRespondent, IRespondentCreateRequest } from '../types/respondent';
import { supabase } from '../config/supabase';
import logger from '../config/logger';

const TABLE = 'respondents';

const normalizeOptionalFields = <T extends Record<string, any>>(data: T): T => {
  const normalized = { ...data };

  Object.entries(normalized).forEach(([key, value]) => {
    if (value === undefined || value === '') {
      (normalized as any)[key] = null;
    }
  });

  return normalized;
};

const mapSupabaseError = (error: any): ApiError => {
  if (!error) {
    return new ApiError(500, 'Unknown Supabase error');
  }

  if (error.code === '23505') {
    return new ApiError(409, 'Serial number already exists');
  }

  return new ApiError(500, error.message || 'Supabase request failed');
};

export class RespondentService {
  static async createRespondent(data: IRespondentCreateRequest): Promise<IRespondent> {
    const payload = normalizeOptionalFields(data);

    const { data: inserted, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      logger.error(`Error creating respondent: ${error.message}`);
      throw mapSupabaseError(error);
    }

    return inserted as IRespondent;
  }

  static async getRespondent(id: number): Promise<IRespondent> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw mapSupabaseError(error);
    }

    if (!data) {
      throw new ApiError(404, `Respondent with ID ${id} not found`);
    }

    return data as IRespondent;
  }

  static async getAllRespondents(page: number = 1, limit: number = 20) {
    if (page < 1 || limit < 1) {
      throw new ApiError(400, 'Page and limit must be positive integers');
    }

    const offset = (page - 1) * limit;

    const { data, count, error } = await supabase
      .from(TABLE)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw mapSupabaseError(error);
    }

    return {
      data: (data || []) as IRespondent[],
      total: count || 0,
    };
  }

  static async updateRespondent(id: number, data: Partial<IRespondent>): Promise<IRespondent> {
    await this.getRespondent(id);

    const payload = normalizeOptionalFields(data);
    delete (payload as any).id;
    delete (payload as any).created_at;
    delete (payload as any).updated_at;

    const { data: updated, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw mapSupabaseError(error);
    }

    return updated as IRespondent;
  }

  static async deleteRespondent(id: number): Promise<boolean> {
    await this.getRespondent(id);

    const { error } = await supabase.from(TABLE).delete().eq('id', id);
    if (error) {
      throw mapSupabaseError(error);
    }

    return true;
  }

  static async getBySchool(schoolName: string): Promise<IRespondent[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('school_name', schoolName)
      .order('created_at', { ascending: false });

    if (error) {
      throw mapSupabaseError(error);
    }

    return (data || []) as IRespondent[];
  }

  static async getByDateRange(startDate: string, endDate: string): Promise<IRespondent[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .gte('collection_date', startDate)
      .lte('collection_date', endDate)
      .order('collection_date', { ascending: false });

    if (error) {
      throw mapSupabaseError(error);
    }

    return (data || []) as IRespondent[];
  }

  static async getAllForExport(): Promise<IRespondent[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw mapSupabaseError(error);
    }

    return (data || []) as IRespondent[];
  }

  static async getStatistics() {
    const respondents = await this.getAllForExport();

    const bySchool = respondents.reduce<Record<string, number>>((accumulator, respondent) => {
      accumulator[respondent.school_name] = (accumulator[respondent.school_name] || 0) + 1;
      return accumulator;
    }, {});

    const byAge = respondents.reduce<Record<string, number>>((accumulator, respondent) => {
      const ageKey = String(respondent.age);
      accumulator[ageKey] = (accumulator[ageKey] || 0) + 1;
      return accumulator;
    }, {});

    const rhInfoAdequacy = respondents.reduce<Record<string, number>>((accumulator, respondent) => {
      const key = respondent.info_adequate === 1 ? 'adequate' : 'not_adequate';
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    return {
      totalRespondents: respondents.length,
      bySchool,
      byAge,
      rhInfoAdequacy,
    };
  }
}
