import { allQuery, getQuery, runQuery } from '../config/sqlite';
import { IRespondent, IRespondentCreateRequest } from '../types/respondent';

const normalizeCollectionDate = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    const numericValue = Number(value);
    if (!Number.isNaN(numericValue)) {
      const date = new Date(numericValue);
      if (!Number.isNaN(date.getTime())) {
        return date.toISOString().slice(0, 10);
      }
    }

    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().slice(0, 10);
    }
  }

  if (typeof value === 'number') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }
  }

  return String(value);
};

const normalizeRespondent = (respondent: any): IRespondent => ({
  ...respondent,
  collection_date: normalizeCollectionDate(respondent.collection_date),
});

export class RespondentModel {
  /**
   * Create a new respondent record
   */
  static async create(respondent: IRespondentCreateRequest): Promise<number> {
    const query = `
      INSERT INTO respondents (
        serial_no, school_name, supervisor_name, collection_date, age, stay_with,
        guardian_occupation, guardian_occupation_other, guardian_education, religion,
        family_size, older_siblings, siblings_have_partners, parents_give_pocket_money,
        pocket_money_adequate, financial_support_source, guardian_visits, school_visitor,
        has_rh_info, rh_teacher, rh_parents, rh_health_worker, rh_friends, rh_media,
        topic_sexuality, topic_abstinence, topic_condoms, topic_sti_hiv, topic_relationships,
        info_adequate
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?
      )
    `;

    const values = [
      respondent.serial_no,
      respondent.school_name,
      respondent.supervisor_name,
      respondent.collection_date,
      respondent.age,
      respondent.stay_with,
      respondent.guardian_occupation,
      respondent.guardian_occupation_other || null,
      respondent.guardian_education,
      respondent.religion,
      respondent.family_size,
      respondent.older_siblings,
      respondent.siblings_have_partners || null,
      respondent.parents_give_pocket_money,
      respondent.pocket_money_adequate || null,
      respondent.financial_support_source,
      respondent.guardian_visits,
      respondent.school_visitor || null,
      respondent.has_rh_info,
      respondent.rh_teacher || 0,
      respondent.rh_parents || 0,
      respondent.rh_health_worker || 0,
      respondent.rh_friends || 0,
      respondent.rh_media || 0,
      respondent.topic_sexuality || 0,
      respondent.topic_abstinence || 0,
      respondent.topic_condoms || 0,
      respondent.topic_sti_hiv || 0,
      respondent.topic_relationships || 0,
      respondent.info_adequate,
    ];

    const result = await runQuery(query, values);
    return result.id;
  }

  /**
   * Get respondent by ID
   */
  static async getById(id: number): Promise<IRespondent | null> {
    const query = 'SELECT * FROM respondents WHERE id = ?';
    const respondent = await getQuery(query, [id]);
    return respondent ? normalizeRespondent(respondent) : null;
  }

  /**
   * Get all respondents with pagination
   */
  static async getAll(
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: IRespondent[]; total: number }> {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM respondents';
    const countResult = await getQuery(countQuery);
    const total = countResult?.total || 0;

    // Get paginated data
    const query = 'SELECT * FROM respondents ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const data = (await allQuery(query, [limit, offset])).map(normalizeRespondent);

    return { data, total };
  }

  /**
   * Update respondent
   */
  static async update(id: number, respondent: Partial<IRespondent>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    // Build dynamic update query
    Object.entries(respondent).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const query = `UPDATE respondents SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const result = await runQuery(query, values);

    return result.changes > 0;
  }

  /**
   * Delete respondent
   */
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM respondents WHERE id = ?';
    const result = await runQuery(query, [id]);
    return result.changes > 0;
  }

  /**
   * Get respondents by school
   */
  static async getBySchool(schoolName: string): Promise<IRespondent[]> {
    const query = 'SELECT * FROM respondents WHERE school_name = ? ORDER BY created_at DESC';
    return (await allQuery(query, [schoolName])).map(normalizeRespondent);
  }

  /**
   * Get respondents by collection date range
   */
  static async getByDateRange(startDate: string, endDate: string): Promise<IRespondent[]> {
    const query = `
      SELECT * FROM respondents 
      WHERE collection_date BETWEEN ? AND ? 
      ORDER BY collection_date DESC
    `;
    return (await allQuery(query, [startDate, endDate])).map(normalizeRespondent);
  }

  /**
   * Check if serial number exists
   */
  static async serialNumberExists(serialNo: string): Promise<boolean> {
    const query = 'SELECT COUNT(*) as count FROM respondents WHERE serial_no = ?';
    const result = await getQuery(query, [serialNo]);
    return (result?.count || 0) > 0;
  }

  /**
   * Get statistics
   */
  static async getStatistics(): Promise<any> {
    const totalQuery = 'SELECT COUNT(*) as total FROM respondents';
    const total = await getQuery(totalQuery);

    const bySchoolQuery = `
      SELECT school_name, COUNT(*) as count 
      FROM respondents 
      GROUP BY school_name
    `;
    const bySchool = await allQuery(bySchoolQuery);

    const byAgeQuery = `
      SELECT age, COUNT(*) as count 
      FROM respondents 
      GROUP BY age
    `;
    const byAge = await allQuery(byAgeQuery);

    return {
      total: total?.total || 0,
      bySchool,
      byAge,
    };
  }
}
