-- ==============================================================================
-- Bhoomi Mithra — Cloudflare D1 Demo Seed Data (Mandya, Karnataka Cluster)
-- All artificial records are explicitly tagged with '(DEMO)'
-- ==============================================================================

-- 1. Farmers Registry (DEMO)
INSERT OR REPLACE INTO farmers (id, name, location, latitude, longitude, crops, problems, experience_years, land_size_acres, phone_masked, bio, verification_status, status)
VALUES
('df_001', 'Suresh Gowda (DEMO)', 'Hulivana, Mandya, Karnataka', 12.522, 76.898, '["Finger Millet (Ragi)", "Sugarcane"]', '["Stem borer", "Drip blockage"]', 14, 3.5, '+91 98450 XXXXX', 'Specializes in dryland Ragi and systemic drip fertigation in Mandya basin.', 'verified', 'active'),
('df_002', 'Anusuya Devi (DEMO)', 'Maddur, Mandya, Karnataka', 12.584, 77.045, '["Paddy", "Groundnut"]', '["Blast disease", "Water logging"]', 11, 4.0, '+91 94480 XXXXX', 'Practicing system of rice intensification (SRI) and organic groundnut rotation.', 'verified', 'active'),
('df_003', 'Chennappa Swamy (DEMO)', 'Pandavapura, Mandya, Karnataka', 12.498, 76.671, '["Tomato", "Chili"]', '["Leaf curl virus", "Mites"]', 9, 2.0, '+91 97410 XXXXX', 'Intensive vegetable polyhouse and open-field trellis cultivation expert.', 'verified', 'active'),
('df_004', 'Manjunath K. (DEMO)', 'Srirangapatna, Mandya, Karnataka', 12.418, 76.695, '["Banana", "Paddy"]', '["Panama wilt", "Fertilizer dosage"]', 16, 5.0, '+91 99010 XXXXX', 'Cauvery delta fruit grower with experience in tissue culture Grand Naine banana.', 'verified', 'active');

-- 2. Agricultural Labor Workers (DEMO)
INSERT OR REPLACE INTO labor_workers (id, name, location, latitude, longitude, skills, daily_rate_inr, rating, jobs_completed, phone_masked, verification_status, status)
VALUES
('dl_001', 'Gowda Labor Team (4 Workers) (DEMO)', 'Mandya East (1.8 km)', 12.524, 76.899, '["Trenching & Drainage", "Weeding", "Harvesting"]', 600, 4.9, 142, '+91 94480 XXXXX', 'verified', 'available'),
('dl_002', 'Murugesan Agro Gang (5 Workers) (DEMO)', 'Maddur North (3.5 km)', 12.531, 76.910, '["Foliar Spraying", "Pesticide Application", "Tilling"]', 650, 4.8, 98, '+91 98800 XXXXX', 'verified', 'available'),
('dl_003', 'Ravi Kumar (Specialist) (DEMO)', 'Srirangapatna Road (2.2 km)', 12.518, 76.892, '["Drip Irrigation Setup", "Trellis Construction"]', 750, 4.9, 210, '+91 97400 XXXXX', 'verified', 'available'),
('dl_004', 'Cauvery Labor Collective (6 Workers) (DEMO)', 'Mandya Rural (4.0 km)', 12.505, 76.885, '["Transplanting", "Paddy Harvesting", "Pruning"]', 600, 4.7, 85, '+91 91640 XXXXX', 'verified', 'available'),
('dl_005', 'Basava Earthworks & Labor Crew (DEMO)', 'Sugar Town, Mandya (2.9 km)', 12.529, 76.888, '["Land Bunding", "Canal Furrowing", "Deep Tilling"]', 700, 4.8, 160, '+91 98452 XXXXX', 'verified', 'available');

-- 3. Marketplace Listings (DEMO)
INSERT OR REPLACE INTO marketplace_listings (id, title, description, category, price_inr, unit, location, seller_name, seller_phone_masked, available, tags, verification_status)
VALUES
('dm_001', 'Certified Ragi Seed (GPU-28) (DEMO)', 'State certified high-germination seed bag with blast tolerance.', 'seeds', 1850, 'bag (25kg)', 'Mandya APMC Mandi', 'Kaveri Seeds Agency (DEMO)', '+91 98450 XXXXX', 1, '["DEMO", "Certified", "High-Yield"]', 'verified'),
('dm_002', 'Neem Coated Urea (DEMO)', 'Govt subsidized neem coated urea with slow nitrogen release.', 'fertilizers', 266, 'bag (45kg)', 'Sugar Town Co-Op, Mandya', 'Mandya PACS Centre (DEMO)', '+91 94481 XXXXX', 1, '["DEMO", "Subsidized", "Soil Health"]', 'verified'),
('dm_003', 'Cold-Pressed Groundnut Oil Cake (DEMO)', 'High protein organic fertilizer & dairy cattle supplement.', 'produce', 4200, 'quintal', 'Maddur Oil Mills', 'Maddur Agro Processing (DEMO)', '+91 97412 XXXXX', 1, '["DEMO", "Organic", "Cattle Feed"]', 'verified'),
('dm_004', 'Multi-Crop Power Reaper (DEMO)', 'Walk-behind reaper for quick paddy and ragi harvest. 5HP diesel.', 'equipment', 75000, 'unit', 'Pandavapura Workshop', 'Kisan Machinery Works (DEMO)', '+91 99015 XXXXX', 1, '["DEMO", "Mechanized", "Harvester"]', 'verified'),
('dm_005', 'Bio-Trichoderma Viride Bio-Fungicide (DEMO)', 'Controls root rot and wilt in solanaceous vegetables and pulses.', 'pesticides', 180, 'kg', 'KVK Mandya Extension', 'BioCore Agro Inputs (DEMO)', '+91 91645 XXXXX', 1, '["DEMO", "Bio-Control", "Organic"]', 'verified'),
('dm_006', 'Drip Lateral Pipes 16mm Class-2 (DEMO)', 'UV stabilized inline emitter tubing 400m coil, 40cm spacing.', 'equipment', 3400, 'bundle (400m)', 'Srirangapatna Irrigation Depot', 'Cauvery Micro-Agri (DEMO)', '+91 98458 XXXXX', 1, '["DEMO", "Water-Saving", "Drip"]', 'verified');

-- 4. Agricultural Services (DEMO)
INSERT OR REPLACE INTO agricultural_services (id, provider_name, category, location, latitude, longitude, phone_masked, operating_radius_km, services, tariff_description, verification_status, status)
VALUES
('ds_001', 'Mandya Precision Drone Spraying (DEMO)', 'drone', 'Mandya Central', 12.522, 76.898, '+91 98450 XXXXX', 25, '["Drone foliar spray", "NDVI canopy analysis", "Nano-urea dispersion"]', '₹450 / acre', 'verified', 'active'),
('ds_002', 'Cauvery Custom Hiring Centre (CHSC) (DEMO)', 'machinery', 'Maddur Hub', 12.584, 77.045, '+91 94480 XXXXX', 30, '["45HP 4WD Tractor", "Rotavator", "Laser Land Leveller", "Paddy Combine"]', '₹900 - ₹1,800 / hour', 'verified', 'active'),
('ds_003', 'Krishi Vigyan Kendra Soil Testing Lab (DEMO)', 'lab', 'V.C. Farm, Mandya', 12.560, 76.850, '+91 97410 XXXXX', 50, '["14-Parameter NPK & Micronutrient Profile", "EC/pH Soil Test", "Fertilizer Card"]', '₹150 / sample', 'verified', 'active'),
('ds_004', 'Dr. Anand Mobile Veterinary Clinic (DEMO)', 'veterinary', 'Pandavapura / Mandya', 12.498, 76.671, '+91 99010 XXXXX', 20, '["Hallikar Breed Health Check", "Mastitis Screening", "Artificial Insemination", "Vaccination"]', '₹200 visit + medicine', 'verified', 'active');
