-- ==============================================================================
-- Bhoomi Mithra — Cloudflare D1 Database Schema
-- ==============================================================================
--
-- This schema provisions production tables for farmers, labor workers,
-- labor requests, marketplace listings, agricultural services, users,
-- sessions, and persistent farm profiles.
--
-- To provision locally:
--   npx wrangler d1 execute DB --local --file=./schema.sql
--
-- To provision in Cloudflare:
--   npx wrangler d1 execute DB --remote --file=./schema.sql
-- ==============================================================================

-- 1. Farmers Registry
CREATE TABLE IF NOT EXISTS farmers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  crops TEXT NOT NULL, -- JSON array of strings
  problems TEXT NOT NULL, -- JSON array of strings
  experience_years INTEGER NOT NULL DEFAULT 0,
  land_size_acres REAL NOT NULL DEFAULT 1.0,
  phone_masked TEXT NOT NULL,
  bio TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'verified',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_farmers_location ON farmers(location);

-- 2. Agricultural Labor Workers
CREATE TABLE IF NOT EXISTS labor_workers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  skills TEXT NOT NULL, -- JSON array of strings
  daily_rate_inr INTEGER NOT NULL DEFAULT 600,
  rating REAL NOT NULL DEFAULT 4.8,
  jobs_completed INTEGER NOT NULL DEFAULT 0,
  phone_masked TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'verified',
  status TEXT NOT NULL DEFAULT 'available',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_labor_location ON labor_workers(latitude, longitude);

-- 3. Labor Dispatch Requests
CREATE TABLE IF NOT EXISTS labor_requests (
  id TEXT PRIMARY KEY,
  farmer_name TEXT NOT NULL,
  farmer_phone TEXT NOT NULL,
  location TEXT NOT NULL,
  skill TEXT NOT NULL,
  worker_id TEXT,
  start_date TEXT NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'assigned' | 'completed' | 'cancelled'
  notes TEXT,
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (worker_id) REFERENCES labor_workers(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_labor_requests_status ON labor_requests(status);

-- 4. Farm Marketplace Listings
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'seeds' | 'fertilizers' | 'pesticides' | 'equipment' | 'produce' | 'services'
  price_inr REAL NOT NULL,
  unit TEXT NOT NULL,
  location TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  seller_phone_masked TEXT NOT NULL,
  available INTEGER NOT NULL DEFAULT 1,
  tags TEXT, -- JSON array of strings
  verification_status TEXT NOT NULL DEFAULT 'verified',
  posted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_marketplace_cat ON marketplace_listings(category, available);
CREATE INDEX IF NOT EXISTS idx_marketplace_loc ON marketplace_listings(location);

-- 5. Agricultural Extension & Machinery Services
CREATE TABLE IF NOT EXISTS agricultural_services (
  id TEXT PRIMARY KEY,
  provider_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'drone' | 'machinery' | 'storage' | 'lab' | 'veterinary'
  location TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  phone_masked TEXT NOT NULL,
  operating_radius_km REAL DEFAULT 15.0,
  services TEXT NOT NULL,
  tariff_description TEXT,
  rating REAL NOT NULL DEFAULT 4.8,
  verification_status TEXT NOT NULL DEFAULT 'verified',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agri_services_cat ON agricultural_services(category);

-- 6. Users (Real Farmer Authentication)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mobile TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 7. Sessions (Secure Session Management)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- 8. Farm Profiles (Persistent Agro-Context linked to user)
CREATE TABLE IF NOT EXISTS farm_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  village TEXT,
  district TEXT,
  state TEXT,
  location TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  land_size_acres REAL NOT NULL DEFAULT 1.0,
  soil_type TEXT NOT NULL,
  water_availability TEXT NOT NULL,
  current_crop TEXT NOT NULL,
  season TEXT NOT NULL,
  farming_goal TEXT NOT NULL,
  livestock TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_farm_profiles_user ON farm_profiles(user_id);
