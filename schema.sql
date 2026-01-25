-- Database Schema for Vexcel Portal

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles Enum
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'parent');

-- Document Types Enum
CREATE TYPE document_type AS ENUM ('screening', 'monthly', 'quarterly', 'iep');

-- Document Status Enum
CREATE TYPE document_status AS ENUM ('pending', 'processed', 'error');

-- Table: Students
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    ipp_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(20),
    address TEXT,
    parent_names VARCHAR(255),
    parent_contact VARCHAR(50),
    disability_type VARCHAR(100),
    referral_doctor VARCHAR(255),
    active_status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role user_role NOT NULL,
    linked_student_id INT REFERENCES students(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Documents
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    type document_type NOT NULL,
    uploaded_by INT NOT NULL REFERENCES users(id),
    status document_status DEFAULT 'pending',
    extracted_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: RecordVersions (Generic versioning for normalized data)
CREATE TABLE record_versions (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- e.g., 'clinical_history', 'milestones'
    entity_id INT NOT NULL,
    version_number INT NOT NULL,
    data JSONB NOT NULL,
    changed_by INT REFERENCES users(id),
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: ClinicalHistory (Normalized Current State)
CREATE TABLE clinical_history (
    id SERIAL PRIMARY KEY,
    student_id INT UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    siblings_details TEXT,
    family_structure VARCHAR(50),
    home_language VARCHAR(50),
    consanguinity BOOLEAN DEFAULT false,
    pregnancy_duration VARCHAR(50),
    delivery_nature VARCHAR(50),
    birth_weight VARCHAR(20),
    birth_cry VARCHAR(50),
    history_seizures BOOLEAN DEFAULT false,
    history_respiratory BOOLEAN DEFAULT false,
    current_medications TEXT,
    allergies TEXT,
    age_disability_noticed VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: DevelopmentalMilestones
CREATE TABLE developmental_milestones (
    id SERIAL PRIMARY KEY,
    student_id INT UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    social_smile VARCHAR(50),
    neck_control VARCHAR(50),
    sitting VARCHAR(50),
    crawling VARCHAR(50),
    standing VARCHAR(50),
    walking VARCHAR(50),
    speech_initiation VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: DailyLivingSkills
CREATE TABLE daily_living_skills (
    id SERIAL PRIMARY KEY,
    student_id INT UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    eating VARCHAR(50),
    dressing VARCHAR(50),
    toileting VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: ClinicalObservations
CREATE TABLE clinical_observations (
    id SERIAL PRIMARY KEY,
    student_id INT UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    general_appearance TEXT,
    psychomotor_skills TEXT,
    sensory_issues TEXT,
    cognition_memory TEXT,
    communication_expressive TEXT,
    communication_receptive TEXT,
    social_interaction TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for performance
CREATE INDEX idx_documents_student_id ON documents(student_id);
CREATE INDEX idx_record_versions_lookup ON record_versions(entity_type, entity_id);
CREATE INDEX idx_users_email ON users(email);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_students_modtime BEFORE UPDATE ON students FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_documents_modtime BEFORE UPDATE ON documents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_clinical_history_modtime BEFORE UPDATE ON clinical_history FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_milestones_modtime BEFORE UPDATE ON developmental_milestones FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_adl_modtime BEFORE UPDATE ON daily_living_skills FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_observations_modtime BEFORE UPDATE ON clinical_observations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
