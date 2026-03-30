create extension if not exists pgcrypto;

do $$
begin
    if not exists (select 1 from pg_type where typname = 'profile_role') then
        create type profile_role as enum ('farmer', 'buyer');
    end if;
    if not exists (select 1 from pg_type where typname = 'item_role') then
        create type item_role as enum ('have', 'need');
    end if;
    if not exists (select 1 from pg_type where typname = 'request_status') then
        create type request_status as enum ('parsed', 'matched', 'proposed', 'accepted', 'planted');
    end if;
    if not exists (select 1 from pg_type where typname = 'proposal_status') then
        create type proposal_status as enum ('pending', 'accepted', 'rejected');
    end if;
    if not exists (select 1 from pg_type where typname = 'trade_status') then
        create type trade_status as enum ('accepted', 'completed');
    end if;
    if not exists (select 1 from pg_type where typname = 'listing_status') then
        create type listing_status as enum ('draft', 'published');
    end if;
    if not exists (select 1 from pg_type where typname = 'interest_type') then
        create type interest_type as enum ('watching', 'reserved', 'quote_requested');
    end if;
end $$;

create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create table if not exists profiles (
    id uuid primary key default gen_random_uuid(),
    role profile_role not null,
    display_name text not null,
    preferred_language text not null default 'en',
    trust_score numeric(3,2) not null default 4.0,
    avatar_url text,
    village text not null,
    state text not null,
    latitude double precision not null,
    longitude double precision not null,
    is_demo boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists farms (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid not null unique references profiles(id) on delete cascade,
    farm_name text not null,
    farm_type text not null,
    area_hectares numeric(10,2) not null,
    latitude double precision not null,
    longitude double precision not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists crop_profiles (
    id uuid primary key default gen_random_uuid(),
    crop_code text not null unique,
    label text not null,
    growth_days integer not null,
    yield_min_kg_per_hectare numeric(10,2) not null,
    yield_max_kg_per_hectare numeric(10,2) not null,
    default_quality_band text not null,
    created_at timestamptz not null default now()
);

create table if not exists inventory_items (
    id uuid primary key default gen_random_uuid(),
    owner_profile_id uuid not null references profiles(id) on delete cascade,
    item_name text not null,
    normalized_item_name text not null,
    category text not null,
    quantity numeric(10,2) not null,
    unit text not null,
    desired_item_name text,
    desired_priority text not null default 'Open to trade',
    availability_status text not null default 'available',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists market_price_references (
    id uuid primary key default gen_random_uuid(),
    normalized_item_name text not null unique,
    display_name text not null,
    unit text not null,
    price_per_unit numeric(10,2) not null,
    currency text not null default 'RM',
    created_at timestamptz not null default now()
);

create table if not exists meeting_points (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    address text not null,
    latitude double precision not null,
    longitude double precision not null,
    created_at timestamptz not null default now()
);

create table if not exists barter_requests (
    id uuid primary key default gen_random_uuid(),
    farmer_profile_id uuid not null references profiles(id) on delete cascade,
    raw_text text not null,
    crop_code text not null,
    crop_label text not null,
    timeline_label text not null,
    timeline_days integer not null,
    radius_km numeric(10,2) not null,
    urgency text not null,
    parsed_confidence numeric(4,2) not null,
    market_opportunity_count integer not null default 0,
    status request_status not null default 'parsed',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists barter_request_items (
    id uuid primary key default gen_random_uuid(),
    request_id uuid not null references barter_requests(id) on delete cascade,
    item_role item_role not null,
    normalized_name text not null,
    display_name text not null,
    category text not null,
    quantity numeric(10,2) not null,
    unit text not null,
    created_at timestamptz not null default now()
);

create table if not exists barter_matches (
    id uuid primary key default gen_random_uuid(),
    request_id uuid not null references barter_requests(id) on delete cascade,
    counterparty_profile_id uuid not null references profiles(id) on delete cascade,
    counterparty_inventory_item_id uuid not null references inventory_items(id) on delete cascade,
    exact_need_score integer not null,
    reciprocal_need_score integer not null,
    distance_score integer not null,
    trust_score integer not null,
    total_score integer not null,
    distance_km numeric(10,2) not null,
    rank integer not null,
    rationale text not null,
    snapshot jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    unique(request_id, counterparty_inventory_item_id)
);

create table if not exists barter_proposals (
    id uuid primary key default gen_random_uuid(),
    request_id uuid not null references barter_requests(id) on delete cascade,
    match_id uuid not null unique references barter_matches(id) on delete cascade,
    counterparty_profile_id uuid not null references profiles(id) on delete cascade,
    offer_item_name text not null,
    offer_quantity numeric(10,2) not null,
    offer_unit text not null,
    requested_item_name text not null,
    requested_quantity numeric(10,2) not null,
    requested_unit text not null,
    ratio_text text not null,
    valuation_confidence numeric(4,2) not null,
    explanation text not null,
    meeting_point_id uuid references meeting_points(id),
    meeting_point_name text not null,
    meeting_label text not null,
    meeting_at timestamptz not null,
    document_number text not null,
    status proposal_status not null default 'pending',
    snapshot jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists trades (
    id uuid primary key default gen_random_uuid(),
    proposal_id uuid not null unique references barter_proposals(id) on delete cascade,
    request_id uuid not null references barter_requests(id) on delete cascade,
    farmer_profile_id uuid not null references profiles(id) on delete cascade,
    counterparty_profile_id uuid not null references profiles(id) on delete cascade,
    status trade_status not null default 'accepted',
    meeting_point_name text not null,
    meeting_at timestamptz not null,
    transaction_code text not null unique,
    snapshot jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create table if not exists planting_records (
    id uuid primary key default gen_random_uuid(),
    trade_id uuid not null unique references trades(id) on delete cascade,
    farmer_profile_id uuid not null references profiles(id) on delete cascade,
    crop_code text not null,
    crop_label text not null,
    planting_date date not null,
    area_value numeric(10,2) not null,
    area_unit text not null,
    area_hectares numeric(10,2) not null,
    input_summary text not null,
    snapshot jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists harvest_listings (
    id uuid primary key default gen_random_uuid(),
    planting_record_id uuid not null unique references planting_records(id) on delete cascade,
    farmer_profile_id uuid not null references profiles(id) on delete cascade,
    crop_code text not null,
    crop_label text not null,
    listing_title text not null,
    estimated_yield_min_kg integer not null,
    estimated_yield_max_kg integer not null,
    harvest_window_start date not null,
    harvest_window_end date not null,
    quality_band text not null,
    confidence_score numeric(4,1) not null,
    reservation_discount_pct integer not null,
    early_incentive_label text not null,
    listing_note text not null,
    status listing_status not null default 'draft',
    snapshot jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists listing_buyer_interests (
    id uuid primary key default gen_random_uuid(),
    harvest_listing_id uuid not null references harvest_listings(id) on delete cascade,
    buyer_profile_id uuid not null references profiles(id) on delete cascade,
    interest_type interest_type not null,
    reserved_quantity_kg numeric(10,2),
    note text,
    created_at timestamptz not null default now(),
    unique(harvest_listing_id, buyer_profile_id)
);

create index if not exists idx_inventory_items_normalized_name on inventory_items(normalized_item_name);
create index if not exists idx_inventory_items_owner on inventory_items(owner_profile_id);
create index if not exists idx_barter_requests_farmer on barter_requests(farmer_profile_id, created_at desc);
create index if not exists idx_barter_matches_request on barter_matches(request_id, rank);
create index if not exists idx_trades_request on trades(request_id);
create index if not exists idx_harvest_listings_farmer on harvest_listings(farmer_profile_id, created_at desc);
create index if not exists idx_listing_buyer_interests_listing on listing_buyer_interests(harvest_listing_id);

drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at before update on profiles for each row execute function set_updated_at();
drop trigger if exists farms_set_updated_at on farms;
create trigger farms_set_updated_at before update on farms for each row execute function set_updated_at();
drop trigger if exists inventory_items_set_updated_at on inventory_items;
create trigger inventory_items_set_updated_at before update on inventory_items for each row execute function set_updated_at();
drop trigger if exists barter_requests_set_updated_at on barter_requests;
create trigger barter_requests_set_updated_at before update on barter_requests for each row execute function set_updated_at();
drop trigger if exists barter_proposals_set_updated_at on barter_proposals;
create trigger barter_proposals_set_updated_at before update on barter_proposals for each row execute function set_updated_at();
drop trigger if exists planting_records_set_updated_at on planting_records;
create trigger planting_records_set_updated_at before update on planting_records for each row execute function set_updated_at();
drop trigger if exists harvest_listings_set_updated_at on harvest_listings;
create trigger harvest_listings_set_updated_at before update on harvest_listings for each row execute function set_updated_at();
