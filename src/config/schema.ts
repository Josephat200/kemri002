import { getDatabase, runQuery } from './sqlite';
import logger from './logger';

export const initializeSQLiteSchema = async (): Promise<void> => {
  const db = getDatabase();

  const schema = `
    CREATE TABLE IF NOT EXISTS respondents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      serial_no TEXT NOT NULL UNIQUE,
      school_name TEXT NOT NULL,
      supervisor_name TEXT NOT NULL,
      collection_date TEXT NOT NULL,
      age INTEGER NOT NULL CHECK (age BETWEEN 15 AND 19),
      stay_with INTEGER NOT NULL CHECK (stay_with BETWEEN 1 AND 4),
      guardian_occupation INTEGER NOT NULL CHECK (guardian_occupation BETWEEN 1 AND 5),
      guardian_occupation_other TEXT,
      guardian_education INTEGER NOT NULL CHECK (guardian_education BETWEEN 1 AND 4),
      religion INTEGER NOT NULL CHECK (religion BETWEEN 1 AND 5),
      family_size INTEGER NOT NULL CHECK (family_size > 0),
      older_siblings INTEGER NOT NULL CHECK (older_siblings IN (0, 1)),
      siblings_have_partners INTEGER CHECK (siblings_have_partners IN (0, 1)),
      parents_give_pocket_money INTEGER NOT NULL CHECK (parents_give_pocket_money IN (0, 1)),
      pocket_money_adequate INTEGER CHECK (pocket_money_adequate IN (0, 1)),
      financial_support_source INTEGER NOT NULL CHECK (financial_support_source BETWEEN 1 AND 4),
      guardian_visits INTEGER NOT NULL CHECK (guardian_visits IN (0, 1)),
      school_visitor INTEGER CHECK (school_visitor BETWEEN 1 AND 5),
      has_rh_info INTEGER NOT NULL CHECK (has_rh_info IN (0, 1)),
      rh_teacher INTEGER DEFAULT 0 CHECK (rh_teacher IN (0, 1)),
      rh_parents INTEGER DEFAULT 0 CHECK (rh_parents IN (0, 1)),
      rh_health_worker INTEGER DEFAULT 0 CHECK (rh_health_worker IN (0, 1)),
      rh_friends INTEGER DEFAULT 0 CHECK (rh_friends IN (0, 1)),
      rh_media INTEGER DEFAULT 0 CHECK (rh_media IN (0, 1)),
      topic_sexuality INTEGER DEFAULT 0 CHECK (topic_sexuality IN (0, 1)),
      topic_abstinence INTEGER DEFAULT 0 CHECK (topic_abstinence IN (0, 1)),
      topic_condoms INTEGER DEFAULT 0 CHECK (topic_condoms IN (0, 1)),
      topic_sti_hiv INTEGER DEFAULT 0 CHECK (topic_sti_hiv IN (0, 1)),
      topic_relationships INTEGER DEFAULT 0 CHECK (topic_relationships IN (0, 1)),
      info_adequate INTEGER NOT NULL CHECK (info_adequate IN (0, 1)),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_serial_no ON respondents(serial_no);
    CREATE INDEX IF NOT EXISTS idx_school_name ON respondents(school_name);
    CREATE INDEX IF NOT EXISTS idx_collection_date ON respondents(collection_date);
    CREATE INDEX IF NOT EXISTS idx_created_at ON respondents(created_at);

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      respondent_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      changed_fields TEXT,
      changed_by TEXT,
      changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (respondent_id) REFERENCES respondents(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_audit_respondent_id ON audit_logs(respondent_id);
    CREATE INDEX IF NOT EXISTS idx_audit_changed_at ON audit_logs(changed_at);
  `;

  return new Promise((resolve, reject) => {
    db.exec(schema, (err) => {
      if (err) {
        logger.error(`Schema initialization error: ${err.message}`);
        reject(err);
      } else {
        logger.info('SQLite schema initialized successfully');
        resolve();
      }
    });
  });
};
