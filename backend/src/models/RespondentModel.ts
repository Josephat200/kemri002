import pool from '../config/database';
import { IRespondent, IRespondentCreateRequest } from '../types/respondent';

export class RespondentModel {
  /**
   * Create a new respondent record
   */
  static async create(respondent: IRespondentCreateRequest): Promise<number> {
    const connection = await pool.getConnection();
    try {
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

      const [result] = await connection.execute(query, values);
      return (result as any).insertId;
    } finally {
      connection.release();
    }
  }

  /**
   * Get respondent by ID
   */
  static async getById(id: number): Promise<IRespondent | null> {
    const connection = await pool.getConnection();
    try {
      const query = 'SELECT * FROM respondents WHERE id = ?';
      const [rows] = await connection.execute(query, [id]);
      const respondents = rows as IRespondent[];
      return respondents.length > 0 ? respondents[0] : null;
    } finally {
      connection.release();
    }
  }

  /**
   * Get all respondents with pagination
   */
  static async getAll(
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: IRespondent[]; total: number }> {
    const connection = await pool.getConnection();
    try {
      const offset = (page - 1) * limit;
      
      // Ensure limit and offset are safe integers
      const safeLimit = Math.max(1, Math.min(100, Math.floor(limit)));
      const safeOffset = Math.max(0, Math.floor(offset));

      // Get total count
      const [countResult] = await connection.execute(
        'SELECT COUNT(*) as total FROM respondents'
      );
      const total = (countResult as any)[0].total;

      // Get paginated data - use string interpolation for LIMIT/OFFSET since they must be integers
      const query = `SELECT * FROM respondents ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;
      const [rows] = await connection.execute(query);

      return {
        data: rows as IRespondent[],
        total,
      };
    } finally {
      connection.release();
    }
  }

  /**
   * Update respondent
   */
  static async update(id: number, respondent: Partial<IRespondent>): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
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
      const query = `UPDATE respondents SET ${fields.join(', ')} WHERE id = ?`;
      const [result] = await connection.execute(query, values);

      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  /**
   * Delete respondent
   */
  static async delete(id: number): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const query = 'DELETE FROM respondents WHERE id = ?';
      const [result] = await connection.execute(query, [id]);
      return (result as any).affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  /**
   * Get respondents by school
   */
  static async getBySchool(schoolName: string): Promise<IRespondent[]> {
    const connection = await pool.getConnection();
    try {
      const query = 'SELECT * FROM respondents WHERE school_name = ? ORDER BY created_at DESC';
      const [rows] = await connection.execute(query, [schoolName]);
      return rows as IRespondent[];
    } finally {
      connection.release();
    }
  }

  /**
   * Get respondents by collection date range
   */
  static async getByDateRange(startDate: string, endDate: string): Promise<IRespondent[]> {
    const connection = await pool.getConnection();
    try {
      const query = `
        SELECT * FROM respondents 
        WHERE collection_date BETWEEN ? AND ? 
        ORDER BY collection_date DESC
      `;
      const [rows] = await connection.execute(query, [startDate, endDate]);
      return rows as IRespondent[];
    } finally {
      connection.release();
    }
  }

  /**
   * Check if serial number exists
   */
  static async serialNumberExists(serialNo: string): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      const query = 'SELECT COUNT(*) as count FROM respondents WHERE serial_no = ?';
      const [rows] = await connection.execute(query, [serialNo]);
      return (rows as any)[0].count > 0;
    } finally {
      connection.release();
    }
  }
}
