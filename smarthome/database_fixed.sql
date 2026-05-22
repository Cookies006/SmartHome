-- ===========================
-- SmartHome Database Schema (PostgreSQL)
-- UTF-8 Encoding
-- ===========================

SET client_encoding = 'UTF8';

-- Drop existing objects if they exist (for reset purposes)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS invite_codes CASCADE;
DROP TABLE IF EXISTS shopping_items CASCADE;
DROP TABLE IF EXISTS shopping_lists CASCADE;
DROP TABLE IF EXISTS family_members CASCADE;
DROP TABLE IF EXISTS families CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('Parent', 'Enfant', 'Tonton', 'Tante', 'Grandmère', 'Grandpère', 'Autres');

-- Table: users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  active_family_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: families
CREATE TABLE families (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_by_user_id INTEGER NOT NULL,
  invite_code VARCHAR(10) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: family_members
CREATE TABLE family_members (
  id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL,
  user_id INTEGER,
  member_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'Autres',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  can_delete BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (family_id, user_id)
);

-- Table: shopping_lists
CREATE TABLE shopping_lists (
  id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_by_user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: shopping_items
CREATE TABLE shopping_items (
  id SERIAL PRIMARY KEY,
  shopping_list_id INTEGER NOT NULL,
  icon VARCHAR(10),
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50),
  urgent BOOLEAN DEFAULT FALSE,
  checked BOOLEAN DEFAULT FALSE,
  quantity VARCHAR(50),
  added_by_user_id INTEGER NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bought_at TIMESTAMP,
  FOREIGN KEY (shopping_list_id) REFERENCES shopping_lists(id) ON DELETE CASCADE,
  FOREIGN KEY (added_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_list_checked ON shopping_items(shopping_list_id, checked);

-- Table: activity_logs
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  item_id INTEGER,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES shopping_items(id) ON DELETE SET NULL
);

CREATE INDEX idx_family_date ON activity_logs(family_id, created_at DESC);

-- Table: invite_codes
CREATE TABLE invite_codes (
  id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
);

CREATE INDEX idx_code ON invite_codes(code);

-- ===========================
-- Indexes for Performance
-- ===========================

CREATE INDEX idx_users_family ON users(active_family_id);
CREATE INDEX idx_families_creator ON families(created_by_user_id);
CREATE INDEX idx_family_members_family ON family_members(family_id);
CREATE INDEX idx_family_members_user ON family_members(user_id);
CREATE INDEX idx_shopping_lists_family ON shopping_lists(family_id);
CREATE INDEX idx_shopping_lists_creator ON shopping_lists(created_by_user_id);
CREATE INDEX idx_shopping_items_list ON shopping_items(shopping_list_id);
CREATE INDEX idx_shopping_items_user ON shopping_items(added_by_user_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_item ON activity_logs(item_id);

-- ===========================
-- Sample Data (Optional)
-- ===========================

-- Insert test user
INSERT INTO users (username, email, password_hash, display_name) 
VALUES ('micheal', 'micheal@example.com', 'hashed_password_123', 'Michael');

-- Insert family
INSERT INTO families (name, description, created_by_user_id, invite_code)
VALUES ('Famille Faye', 'Famille principale', 1, 'FAYE2024');

-- Insert family members
INSERT INTO family_members (family_id, user_id, member_name, role, can_delete)
VALUES 
  (1, 1, 'Papa (Vous)', 'Parent', FALSE),
  (1, NULL, 'Maman', 'Parent', TRUE),
  (1, NULL, 'Fatou', 'Enfant', TRUE);

-- Insert shopping list
INSERT INTO shopping_lists (family_id, name, created_by_user_id)
VALUES (1, 'Courses hebdomadaires', 1);

-- Insert shopping items
INSERT INTO shopping_items (shopping_list_id, icon, name, category, urgent, added_by_user_id)
VALUES 
  (1, '🍼', 'Lait 1er age', 'Bebe', TRUE, 1),
  (1, '🧻', 'Papier toilette (x12)', 'Entretien & Hygiene', FALSE, 1),
  (1, '🍎', 'Pommes (1kg)', 'Fruits & Legumes', FALSE, 1);
