-- KEMRI Reproductive Health Survey Database Schema
-- This script creates the database and tables for the survey system

CREATE DATABASE IF NOT EXISTS kemri_rh_survey;
USE kemri_rh_survey;

CREATE TABLE respondents (
    id INT AUTO_INCREMENT PRIMARY KEY,

    serial_no VARCHAR(20) NOT NULL UNIQUE,
    school_name VARCHAR(100) NOT NULL,
    supervisor_name VARCHAR(100) NOT NULL,
    collection_date DATE NOT NULL,

    age INT NOT NULL CHECK (age BETWEEN 15 AND 19),

    stay_with INT NOT NULL CHECK (stay_with BETWEEN 1 AND 4),

    guardian_occupation INT NOT NULL CHECK (guardian_occupation BETWEEN 1 AND 5),
    guardian_occupation_other VARCHAR(100),

    guardian_education INT NOT NULL CHECK (guardian_education BETWEEN 1 AND 4),

    religion INT NOT NULL CHECK (religion BETWEEN 1 AND 5),

    family_size INT NOT NULL CHECK (family_size > 0),

    older_siblings TINYINT NOT NULL CHECK (older_siblings IN (0, 1)),
    siblings_have_partners TINYINT CHECK (siblings_have_partners IN (0, 1)),

    parents_give_pocket_money TINYINT NOT NULL CHECK (parents_give_pocket_money IN (0, 1)),
    pocket_money_adequate TINYINT CHECK (pocket_money_adequate IN (0, 1)),

    financial_support_source INT NOT NULL CHECK (financial_support_source BETWEEN 1 AND 4),

    guardian_visits TINYINT NOT NULL CHECK (guardian_visits IN (0, 1)),
    school_visitor INT CHECK (school_visitor BETWEEN 1 AND 5),

    has_rh_info TINYINT NOT NULL CHECK (has_rh_info IN (0, 1)),

    rh_teacher TINYINT DEFAULT 0 CHECK (rh_teacher IN (0, 1)),
    rh_parents TINYINT DEFAULT 0 CHECK (rh_parents IN (0, 1)),
    rh_health_worker TINYINT DEFAULT 0 CHECK (rh_health_worker IN (0, 1)),
    rh_friends TINYINT DEFAULT 0 CHECK (rh_friends IN (0, 1)),
    rh_media TINYINT DEFAULT 0 CHECK (rh_media IN (0, 1)),

    topic_sexuality TINYINT DEFAULT 0 CHECK (topic_sexuality IN (0, 1)),
    topic_abstinence TINYINT DEFAULT 0 CHECK (topic_abstinence IN (0, 1)),
    topic_condoms TINYINT DEFAULT 0 CHECK (topic_condoms IN (0, 1)),
    topic_sti_hiv TINYINT DEFAULT 0 CHECK (topic_sti_hiv IN (0, 1)),
    topic_relationships TINYINT DEFAULT 0 CHECK (topic_relationships IN (0, 1)),

    info_adequate TINYINT NOT NULL CHECK (info_adequate IN (0, 1)),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_serial_no (serial_no),
    INDEX idx_school_name (school_name),
    INDEX idx_collection_date (collection_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Create audit log table for tracking changes
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    respondent_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    changed_fields JSON,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (respondent_id) REFERENCES respondents(id) ON DELETE CASCADE,
    INDEX idx_respondent_id (respondent_id),
    INDEX idx_changed_at (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
