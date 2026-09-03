-- ==============================================================================
-- Bhoomi Mithra — Cloudflare D1 Presentation Seed Data (Anekal, Bengaluru Urban)
-- All mock records are explicitly tagged as DEMO
-- ==============================================================================

-- Clear previous demo data
DELETE FROM farmers WHERE id LIKE 'df_%' OR id LIKE 'farmer-%';
DELETE FROM labor_workers WHERE id LIKE 'dl_%' OR id LIKE 'labor-%';
DELETE FROM marketplace_listings WHERE id LIKE 'dm_%' OR id LIKE 'mkt-%';
DELETE FROM agricultural_services WHERE id LIKE 'ds_%' OR id LIKE 'svc-%';

-- 1. Farmers Registry (DEMO PROFILES - 5 Records)
INSERT OR REPLACE INTO farmers (id, name, location, latitude, longitude, crops, problems, experience_years, land_size_acres, phone_masked, bio, verification_status, status)
VALUES
('farmer-001', 'Ravi K. (DEMO)', 'Anekal, Bengaluru Urban, Karnataka', 12.7109, 77.6946, '["paddy", "ragi", "tomato"]', '["water management", "weed control", "monsoon flooding"]', 12, 4.5, '+91 98450 XXXXX', 'Paddy and vegetable farmer near Anekal with focus on water management.', 'verified', 'active'),
('farmer-002', 'Manjunath R. (DEMO)', 'Anekal, Bengaluru Urban, Karnataka', 12.7050, 77.6880, '["ragi", "groundnut", "vegetables"]', '["drip irrigation setup", "soil fertility", "pest control"]', 9, 3.0, '+91 94480 XXXXX', 'Drip irrigation practitioner growing ragi and groundnut in Anekal.', 'verified', 'active'),
('farmer-003', 'Geetha S. (DEMO)', 'Jigani, Bengaluru Urban, Karnataka', 12.7780, 77.6420, '["tomato", "beans", "capsicum"]', '["protected cultivation", "leaf curl virus", "market access"]', 11, 2.5, '+91 97410 XXXXX', 'Protected cultivation specialist growing tomato and beans near Jigani.', 'verified', 'active'),
('farmer-004', 'Prakash M. (DEMO)', 'Attibele, Bengaluru Urban, Karnataka', 12.7770, 77.7730, '["paddy", "ragi", "maize"]', '["organic transition", "soil health", "input costs"]', 15, 6.0, '+91 99010 XXXXX', 'Experienced organic-transitioning farmer in Attibele with paddy and ragi.', 'verified', 'active'),
('farmer-005', 'Lakshmi N. (DEMO)', 'Chandapura, Bengaluru Urban, Karnataka', 12.8050, 77.6870, '["vegetables", "marigold", "spinach"]', '["pest management", "flower quality", "urban market access"]', 8, 1.5, '+91 98800 XXXXX', 'Flower and vegetable farmer in Chandapura supplying Bengaluru urban markets.', 'verified', 'active');

-- 2. Agricultural Labor Workers (DEMO WORKERS - 8 Records)
INSERT OR REPLACE INTO labor_workers (id, name, location, latitude, longitude, skills, daily_rate_inr, rating, jobs_completed, phone_masked, verification_status, status)
VALUES
('labor-001', 'Ramu B. (DEMO)', 'Anekal, Bengaluru Urban', 12.7120, 77.6950, '["general farm labour", "weeding", "harvesting"]', 550, 4.9, 85, '+91 94480 XXXXX', 'verified', 'available'),
('labor-002', 'Savitha D. (DEMO)', 'Anekal, Bengaluru Urban', 12.7080, 77.6910, '["paddy transplanting", "weeding", "grading"]', 520, 4.8, 62, '+91 98800 XXXXX', 'verified', 'available'),
('labor-003', 'Basavaraju M. (DEMO)', 'Anekal, Bengaluru Urban', 12.7060, 77.7000, '["tractor assistance", "land preparation", "irrigation maintenance"]', 850, 4.9, 140, '+91 97400 XXXXX', 'verified', 'available'),
('labor-004', 'Nirmala K. (DEMO)', 'Jigani, Bengaluru Urban', 12.7150, 77.6870, '["vegetable harvesting", "packing", "sorting"]', 500, 4.7, 48, '+91 91640 XXXXX', 'verified', 'available'),
('labor-005', 'Venkatesh R. (DEMO)', 'Anekal, Bengaluru Urban', 12.7200, 77.6960, '["spraying", "fertilizer application", "drip installation"]', 700, 4.8, 92, '+91 98452 XXXXX', 'verified', 'available'),
('labor-006', 'Pushpa S. (DEMO)', 'Chandapura, Bengaluru Urban', 12.8050, 77.6880, '["weeding", "transplanting", "general farm labour"]', 500, 4.8, 55, '+91 99015 XXXXX', 'verified', 'available'),
('labor-007', 'Shivanna P. (DEMO)', 'Attibele, Bengaluru Urban', 12.7770, 77.7730, '["drip installation", "irrigation maintenance", "spraying"]', 750, 4.9, 110, '+91 98458 XXXXX', 'verified', 'available'),
('labor-008', 'Kavitha R. (DEMO)', 'Anekal, Bengaluru Urban', 12.7100, 77.6930, '["vegetable harvesting", "flower picking", "post-harvest handling"]', 520, 4.7, 39, '+91 97412 XXXXX', 'verified', 'available');

-- 3. Marketplace Listings (DEMO LISTINGS - 8 Records)
INSERT OR REPLACE INTO marketplace_listings (id, title, description, category, price_inr, unit, location, seller_name, seller_phone_masked, available, tags, verification_status)
VALUES
('mkt-001', 'Urea Fertilizer — 50 kg Bag (DEMO)', 'Granular urea (46% N). Standard quality for paddy, ragi, and vegetables. Minimum order 2 bags.', 'fertilizers', 295, '50 kg bag', 'Anekal, Bengaluru Urban', 'Anekal Agri Inputs (DEMO)', '+91 98450 XXXXX', 1, '["urea", "nitrogen", "fertilizer", "DEMO"]', 'verified'),
('mkt-002', '19:19:19 NPK Water-Soluble Fertilizer (DEMO)', 'Balanced NPK suitable for fertigation and foliar spray. Good for tomato and flower crops.', 'fertilizers', 1450, '25 kg bag', 'Jigani, Bengaluru Urban', 'Jigani Crop Inputs (DEMO)', '+91 94481 XXXXX', 1, '["NPK", "water-soluble", "fertigation", "DEMO"]', 'verified'),
('mkt-003', 'Vermicompost — 25 kg Bag (DEMO)', 'Certified vermicompost. Improves soil structure and beneficial microbes. Safe for all crops.', 'fertilizers', 350, '25 kg bag', 'Anekal, Bengaluru Urban', 'Anekal Organic Inputs (DEMO)', '+91 97412 XXXXX', 1, '["organic", "vermicompost", "soil-health", "DEMO"]', 'verified'),
('mkt-004', 'Hybrid Tomato Seeds — 10g Packet (DEMO)', 'Heat-tolerant hybrid tomato seeds. High yield, disease-resistant variety for Bengaluru area.', 'seeds', 280, '10g packet', 'Anekal, Bengaluru Urban', 'Anekal Seed Centre (DEMO)', '+91 99015 XXXXX', 1, '["tomato", "hybrid", "seeds", "DEMO"]', 'verified'),
('mkt-005', 'Ragi (Finger Millet) Seeds — 5 kg (DEMO)', 'Certified GPU-28 ragi seeds. Drought-tolerant. Ideal for red sandy loam soils.', 'seeds', 160, '5 kg bag', 'Attibele, Bengaluru Urban', 'Attibele Seed House (DEMO)', '+91 91645 XXXXX', 1, '["ragi", "finger millet", "seeds", "DEMO"]', 'verified'),
('mkt-006', 'Neem-Based Bio Pesticide — 1 Litre (DEMO)', 'Azadirachtin-based biopesticide. Effective against aphids, whitefly, and mites.', 'pesticides', 420, '1 litre', 'Jigani, Bengaluru Urban', 'Jigani Bio Inputs (DEMO)', '+91 98458 XXXXX', 1, '["neem", "biopesticide", "organic", "DEMO"]', 'verified'),
('mkt-007', 'Drip Irrigation Kit — 0.5 Acre (DEMO)', 'Complete drip kit for 0.5 acre. Includes main line, laterals, inline drippers, Y-filter and reducer.', 'equipment', 13500, 'unit kit', 'Anekal, Bengaluru Urban', 'Anekal Irrigation Supplies (DEMO)', '+91 98800 XXXXX', 1, '["drip", "irrigation", "water-saving", "DEMO"]', 'verified'),
('mkt-008', 'Fresh Ragi — Farmer Lot (50 kg) (DEMO)', 'Freshly harvested ragi (GPU-28). Clean, dry, moisture < 12%. Direct from farm.', 'produce', 3800, '50 kg bag', 'Anekal, Bengaluru Urban', 'Anekal Farmers Collective (DEMO)', '+91 97400 XXXXX', 1, '["ragi", "produce", "farm-fresh", "DEMO"]', 'verified');

-- 4. Agricultural Services (5 Records: 4 Real Public Listings + 1 KVK)
INSERT OR REPLACE INTO agricultural_services (id, provider_name, category, location, latitude, longitude, phone_masked, operating_radius_km, services, tariff_description, verification_status, status)
VALUES
('svc-001', 'Sri Manjunatha Enterprises (Sonalika Dealer)', 'machinery', 'Vishwakarma Nilaya, Chandapura Main Road, Shivaji Circle, Rudrappa Layout, Anekal', 12.7109, 77.6946, 'Public Listing', 35, '["Sonalika Tractor Sales & Service", "Rotavators", "Tillage Equipment", "Original Spare Parts"]', 'Official Sonalika Dealer Tariffs', 'verified', 'active'),
('svc-002', 'MS Agri Clinic', 'machinery', 'Anekal Town, Bengaluru Urban', 12.7100, 77.6940, 'Public Listing', 25, '["Fertilizer Dealer", "Agricultural Equipment Dealer", "Agricultural Sprayer Sales & Repair"]', 'Standard Retail Tariffs', 'verified', 'active'),
('svc-003', 'RCM Agriculture Products', 'lab', 'Anekal, Bengaluru Urban', 12.7120, 77.6955, 'Public Listing', 25, '["Soil Health Products", "Fertilizers", "Spray Adjuvants", "Plant Growth Regulators"]', 'Standard Tariffs', 'verified', 'active'),
('svc-004', 'Sri Lakshmi Seeds & Fertilizers', 'machinery', 'Anekal Market Road, Bengaluru Urban', 12.7090, 77.6930, 'Public Listing', 20, '["Seeds Retail", "Plant Protection Chemicals", "Bio-Fertilizers", "Knapsack Sprayers"]', 'Standard Retail Tariffs', 'verified', 'active'),
('svc-005', 'Anekal Krishi Vigyan Kendra Support (DEMO)', 'lab', 'Bengaluru Urban, Karnataka', 12.7500, 77.6500, 'Public Listing', 50, '["14-Parameter Soil Health Card Testing", "Farmer Training", "Pest Diagnosis Advisory", "Crop Planning"]', 'Government Subsidized / Free', 'verified', 'active');
