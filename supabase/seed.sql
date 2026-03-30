insert into profiles (id, role, display_name, preferred_language, trust_score, avatar_url, village, state, latitude, longitude, is_demo)
values
    ('11111111-1111-1111-1111-111111111111', 'farmer', 'Pak Karim', 'bm', 4.4, 'https://api.dicebear.com/9.x/lorelei/svg?seed=PakKarim', 'Kampung Titi Akar', 'Kedah', 5.6613, 100.5020, true),
    ('22222222-2222-2222-2222-222222222222', 'farmer', 'Pak Abu', 'bm', 4.8, 'https://api.dicebear.com/9.x/lorelei/svg?seed=PakAbu', 'Kampung Baru', 'Kedah', 5.6740, 100.5000, false),
    ('33333333-3333-3333-3333-333333333333', 'farmer', 'Lin Chen', 'en', 4.2, 'https://api.dicebear.com/9.x/lorelei/svg?seed=LinChen', 'Taman Seri Padi', 'Kedah', 5.6900, 100.4800, false),
    ('44444444-4444-4444-4444-444444444444', 'farmer', 'Siti Sarah', 'bm', 4.1, 'https://api.dicebear.com/9.x/lorelei/svg?seed=SitiSarah', 'Kampung Alor', 'Kedah', 5.6480, 100.5200, false),
    ('55555555-5555-5555-5555-555555555555', 'buyer', 'Mak Teh Grocer', 'bm', 4.7, 'https://api.dicebear.com/9.x/lorelei/svg?seed=MakTeh', 'Ipoh', 'Perak', 4.5975, 101.0901, false),
    ('66666666-6666-6666-6666-666666666666', 'buyer', 'Warung Nusantara', 'en', 4.6, 'https://api.dicebear.com/9.x/lorelei/svg?seed=WarungNusantara', 'George Town', 'Penang', 5.4141, 100.3288, false)
on conflict (id) do update
set role = excluded.role,
    display_name = excluded.display_name,
    preferred_language = excluded.preferred_language,
    trust_score = excluded.trust_score,
    avatar_url = excluded.avatar_url,
    village = excluded.village,
    state = excluded.state,
    latitude = excluded.latitude,
    longitude = excluded.longitude,
    is_demo = excluded.is_demo;

insert into farms (id, profile_id, farm_name, farm_type, area_hectares, latitude, longitude)
values
    ('71111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Karim Family Plot', 'paddy', 2.50, 5.6613, 100.5020),
    ('72222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Pak Abu Organics', 'mixed', 1.80, 5.6740, 100.5000),
    ('73333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Lin Nursery Block', 'nursery', 1.20, 5.6900, 100.4800),
    ('74444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Siti Packing Yard', 'horticulture', 1.00, 5.6480, 100.5200)
on conflict (id) do update
set profile_id = excluded.profile_id,
    farm_name = excluded.farm_name,
    farm_type = excluded.farm_type,
    area_hectares = excluded.area_hectares,
    latitude = excluded.latitude,
    longitude = excluded.longitude;

insert into crop_profiles (id, crop_code, label, growth_days, yield_min_kg_per_hectare, yield_max_kg_per_hectare, default_quality_band)
values
    ('81111111-1111-1111-1111-111111111111', 'paddy', 'Paddy (MR269)', 110, 5200, 6500, 'Grade A'),
    ('82222222-2222-2222-2222-222222222222', 'sweet_corn', 'Sweet Corn', 85, 7200, 9100, 'Grade A')
on conflict (crop_code) do update
set label = excluded.label,
    growth_days = excluded.growth_days,
    yield_min_kg_per_hectare = excluded.yield_min_kg_per_hectare,
    yield_max_kg_per_hectare = excluded.yield_max_kg_per_hectare,
    default_quality_band = excluded.default_quality_band;

insert into inventory_items (id, owner_profile_id, item_name, normalized_item_name, category, quantity, unit, desired_item_name, desired_priority, availability_status)
values
    ('10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Nitrogen Fertilizer', 'nitrogen_fertilizer', 'fertilizer', 5, 'bag', 'organic_pesticide', 'Ready to barter', 'available'),
    ('10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Compost Tea', 'compost_tea', 'soil_treatment', 20, 'liter', 'seedling_trays', 'Open to trade', 'available'),
    ('10000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'Organic Pesticide', 'organic_pesticide', 'pesticide', 15, 'liter', 'nitrogen_fertilizer', 'Immediate priority', 'available'),
    ('10000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'Bio-Fertilizer', 'bio_fertilizer', 'fertilizer', 8, 'bag', 'seedling_trays', 'Open to trade', 'available'),
    ('10000000-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'Seedling Trays', 'seedling_trays', 'equipment', 40, 'set', 'compost_tea', 'Immediate priority', 'available'),
    ('10000000-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333', 'Sweet Corn Seed Pack', 'seed_pack', 'seed', 25, 'pack', 'nitrogen_fertilizer', 'Open to trade', 'available'),
    ('10000000-0000-0000-0000-000000000007', '44444444-4444-4444-4444-444444444444', 'Fruit Crates', 'fruit_crates', 'packaging', 30, 'crate', 'organic_pesticide', 'Open to trade', 'available'),
    ('10000000-0000-0000-0000-000000000008', '44444444-4444-4444-4444-444444444444', 'Shovel Set', 'shovel_set', 'equipment', 3, 'set', 'nitrogen_fertilizer', 'Open to trade', 'available')
on conflict (id) do update
set owner_profile_id = excluded.owner_profile_id,
    item_name = excluded.item_name,
    normalized_item_name = excluded.normalized_item_name,
    category = excluded.category,
    quantity = excluded.quantity,
    unit = excluded.unit,
    desired_item_name = excluded.desired_item_name,
    desired_priority = excluded.desired_priority,
    availability_status = excluded.availability_status;

insert into market_price_references (id, normalized_item_name, display_name, unit, price_per_unit)
values
    ('12000000-0000-0000-0000-000000000001', 'nitrogen_fertilizer', 'Nitrogen Fertilizer', 'bag', 30.00),
    ('12000000-0000-0000-0000-000000000002', 'organic_pesticide', 'Organic Pesticide', 'liter', 50.00),
    ('12000000-0000-0000-0000-000000000003', 'bio_fertilizer', 'Bio-Fertilizer', 'bag', 28.00),
    ('12000000-0000-0000-0000-000000000004', 'seedling_trays', 'Seedling Trays', 'set', 6.00),
    ('12000000-0000-0000-0000-000000000005', 'compost_tea', 'Compost Tea', 'liter', 18.00),
    ('12000000-0000-0000-0000-000000000006', 'fruit_crates', 'Fruit Crates', 'crate', 15.00),
    ('12000000-0000-0000-0000-000000000007', 'shovel_set', 'Shovel Set', 'set', 60.00)
on conflict (normalized_item_name) do update
set display_name = excluded.display_name,
    unit = excluded.unit,
    price_per_unit = excluded.price_per_unit;

insert into meeting_points (id, name, address, latitude, longitude)
values
    ('20000000-0000-0000-0000-000000000001', 'Kampung Baru Center', 'Kampung Baru Community Hall, Kedah', 5.6688, 100.5025),
    ('20000000-0000-0000-0000-000000000002', 'Village Market Hub', 'Pasar Mini Titi Akar, Kedah', 5.6601, 100.5102),
    ('20000000-0000-0000-0000-000000000003', 'Rice Mill Junction', 'Jalan Kilang Padi, Kedah', 5.6765, 100.4920)
on conflict (id) do update
set name = excluded.name,
    address = excluded.address,
    latitude = excluded.latitude,
    longitude = excluded.longitude;

insert into barter_requests (id, farmer_profile_id, raw_text, crop_code, crop_label, timeline_label, timeline_days, radius_km, urgency, parsed_confidence, market_opportunity_count, status)
values
    ('30000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'I have bio fertilizer and need fruit crates for next week', 'paddy', 'Paddy (MR269)', 'Next Week', 7, 5, 'medium', 0.94, 1, 'planted')
on conflict (id) do update
set farmer_profile_id = excluded.farmer_profile_id,
    raw_text = excluded.raw_text,
    crop_code = excluded.crop_code,
    crop_label = excluded.crop_label,
    timeline_label = excluded.timeline_label,
    timeline_days = excluded.timeline_days,
    radius_km = excluded.radius_km,
    urgency = excluded.urgency,
    parsed_confidence = excluded.parsed_confidence,
    market_opportunity_count = excluded.market_opportunity_count,
    status = excluded.status;

insert into barter_request_items (id, request_id, item_role, normalized_name, display_name, category, quantity, unit)
values
    ('30000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000001', 'have', 'bio_fertilizer', 'Bio-Fertilizer', 'fertilizer', 4, 'bag'),
    ('30000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000001', 'need', 'fruit_crates', 'Fruit Crates', 'packaging', 12, 'crate')
on conflict (id) do update
set request_id = excluded.request_id,
    item_role = excluded.item_role,
    normalized_name = excluded.normalized_name,
    display_name = excluded.display_name,
    category = excluded.category,
    quantity = excluded.quantity,
    unit = excluded.unit;

insert into barter_matches (id, request_id, counterparty_profile_id, counterparty_inventory_item_id, exact_need_score, reciprocal_need_score, distance_score, trust_score, total_score, distance_km, rank, rationale, snapshot)
values
    ('30000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', '10000000-0000-0000-0000-000000000007', 50, 0, 12, 8, 70, 2.8, 1, 'Siti Sarah can supply Fruit Crates and is a strong fit for Pak Abu''s available Bio-Fertilizer.', '{"counterparty_name":"Siti Sarah","counterparty_avatar_url":"https://api.dicebear.com/9.x/lorelei/svg?seed=SitiSarah","offered_item_name":"Fruit Crates","offered_item_normalized_name":"fruit_crates","offered_quantity":30,"offered_unit":"crate","desired_item_name":"organic_pesticide","desired_priority":"Open to trade","insight":"Fruit Crates help Pak Abu package his paddy harvest and move produce faster."}'::jsonb)
on conflict (request_id, counterparty_inventory_item_id) do update
set counterparty_profile_id = excluded.counterparty_profile_id,
    exact_need_score = excluded.exact_need_score,
    reciprocal_need_score = excluded.reciprocal_need_score,
    distance_score = excluded.distance_score,
    trust_score = excluded.trust_score,
    total_score = excluded.total_score,
    distance_km = excluded.distance_km,
    rank = excluded.rank,
    rationale = excluded.rationale,
    snapshot = excluded.snapshot;

insert into barter_proposals (id, request_id, match_id, counterparty_profile_id, offer_item_name, offer_quantity, offer_unit, requested_item_name, requested_quantity, requested_unit, ratio_text, valuation_confidence, explanation, meeting_point_id, meeting_point_name, meeting_label, meeting_at, document_number, status, snapshot)
values
    ('30000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'Bio-Fertilizer', 4, 'bag', 'Fruit Crates', 8, 'crate', '1 bag Bio-Fertilizer = 2 crate Fruit Crates', 0.93, 'Seeded historical barter proposal.', '20000000-0000-0000-0000-000000000001', 'Kampung Baru Center', 'Tomorrow - 09:00 AM', '2026-01-09T09:00:00+08:00', 'TT-HISTORY-AI', 'accepted', '{"counterparty_name":"Siti Sarah","offer_item_name":"Bio-Fertilizer","offer_quantity":4,"offer_unit":"bag","requested_item_name":"Fruit Crates","requested_quantity":8,"requested_unit":"crate","meeting_point_name":"Kampung Baru Center","meeting_label":"Tomorrow - 09:00 AM","document_number":"TT-HISTORY-AI","explanation":"Seeded historical barter proposal."}'::jsonb)
on conflict (match_id) do update
set request_id = excluded.request_id,
    counterparty_profile_id = excluded.counterparty_profile_id,
    offer_item_name = excluded.offer_item_name,
    offer_quantity = excluded.offer_quantity,
    offer_unit = excluded.offer_unit,
    requested_item_name = excluded.requested_item_name,
    requested_quantity = excluded.requested_quantity,
    requested_unit = excluded.requested_unit,
    ratio_text = excluded.ratio_text,
    valuation_confidence = excluded.valuation_confidence,
    explanation = excluded.explanation,
    meeting_point_id = excluded.meeting_point_id,
    meeting_point_name = excluded.meeting_point_name,
    meeting_label = excluded.meeting_label,
    meeting_at = excluded.meeting_at,
    document_number = excluded.document_number,
    status = excluded.status,
    snapshot = excluded.snapshot;

insert into trades (id, proposal_id, request_id, farmer_profile_id, counterparty_profile_id, status, meeting_point_name, meeting_at, transaction_code, snapshot)
values
    ('30000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'accepted', 'Kampung Baru Center', '2026-01-09T09:00:00+08:00', 'TRD-HISTORY', '{"counterparty_name":"Siti Sarah","offer_item_name":"Bio-Fertilizer","offer_quantity":4,"offer_unit":"bag","requested_item_name":"Fruit Crates","requested_quantity":8,"requested_unit":"crate","projected_yield_uplift_pct":15,"planting_prompt":"Historical seeded trade."}'::jsonb)
on conflict (proposal_id) do update
set request_id = excluded.request_id,
    farmer_profile_id = excluded.farmer_profile_id,
    counterparty_profile_id = excluded.counterparty_profile_id,
    status = excluded.status,
    meeting_point_name = excluded.meeting_point_name,
    meeting_at = excluded.meeting_at,
    transaction_code = excluded.transaction_code,
    snapshot = excluded.snapshot;

insert into planting_records (id, trade_id, farmer_profile_id, crop_code, crop_label, planting_date, area_value, area_unit, area_hectares, input_summary, snapshot)
values
    ('30000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'paddy', 'Paddy (MR269)', '2026-01-10', 2.0, 'hectares', 2.0, 'Organic soil treatment and measured irrigation schedule.', '{"soil_vitality_label":"Optimal Nitrate","yield_probability_label":"Grade A Premium"}'::jsonb)
on conflict (trade_id) do update
set farmer_profile_id = excluded.farmer_profile_id,
    crop_code = excluded.crop_code,
    crop_label = excluded.crop_label,
    planting_date = excluded.planting_date,
    area_value = excluded.area_value,
    area_unit = excluded.area_unit,
    area_hectares = excluded.area_hectares,
    input_summary = excluded.input_summary,
    snapshot = excluded.snapshot;

insert into harvest_listings (id, planting_record_id, farmer_profile_id, crop_code, crop_label, listing_title, estimated_yield_min_kg, estimated_yield_max_kg, harvest_window_start, harvest_window_end, quality_band, confidence_score, reservation_discount_pct, early_incentive_label, listing_note, status, snapshot)
values
    ('30000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'paddy', 'Paddy (MR269)', 'Future Paddy (MR269) Supply', 10500, 12800, '2026-04-23', '2026-05-07', 'Grade A Premium', 94.8, 10, '10% off for reservations', 'Seeded future supply listing for marketplace-style previews.', 'draft', '{"soil_vitality_label":"Optimal Nitrate","yield_probability_label":"Grade A Premium"}'::jsonb)
on conflict (planting_record_id) do update
set farmer_profile_id = excluded.farmer_profile_id,
    crop_code = excluded.crop_code,
    crop_label = excluded.crop_label,
    listing_title = excluded.listing_title,
    estimated_yield_min_kg = excluded.estimated_yield_min_kg,
    estimated_yield_max_kg = excluded.estimated_yield_max_kg,
    harvest_window_start = excluded.harvest_window_start,
    harvest_window_end = excluded.harvest_window_end,
    quality_band = excluded.quality_band,
    confidence_score = excluded.confidence_score,
    reservation_discount_pct = excluded.reservation_discount_pct,
    early_incentive_label = excluded.early_incentive_label,
    listing_note = excluded.listing_note,
    status = excluded.status,
    snapshot = excluded.snapshot;

insert into listing_buyer_interests (id, harvest_listing_id, buyer_profile_id, interest_type, reserved_quantity_kg, note)
values
    ('30000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000006', '55555555-5555-5555-5555-555555555555', 'watching', null, 'Grocer monitoring January paddy window'),
    ('30000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000006', '66666666-6666-6666-6666-666666666666', 'quote_requested', null, 'Restaurant requested a forward quote')
on conflict (harvest_listing_id, buyer_profile_id) do update
set interest_type = excluded.interest_type,
    reserved_quantity_kg = excluded.reserved_quantity_kg,
    note = excluded.note;
