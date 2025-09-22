-- ========== USERS ==========
create table users (
  id bigint primary key,
  email text unique not null,
  password text not null, -- ⚠️ in production use auth not plain passwords
  name text not null,
  identification text,
  birthdate date,
  country text,
  city text,
  location point, -- stores [lat, long]
  profile_picture text
);

-- ========== DISASTERS ==========
create table disasters (
  id bigint primary key,
  name text not null,
  location text,
  latitude double precision,
  longitude double precision,
  date date,
  severity text,
  description text,
  image text
);

-- ========== ORGANIZATIONS ==========
create table organizations (
  id bigint primary key,
  name text not null,
  about_us text,
  description text,
  logo text,
  image text,
  tags text[], -- simple array of strings
  social_media jsonb, -- {facebook, twitter, linkedin}
  impact jsonb, -- {people_served, funds_raised, projects_completed}
  ratings jsonb, -- {ai_rating, public_rating}
  partnerships text[] -- list of partner names
);


-- ========== DONATIONS ==========
create table donations (
  id bigint primary key,
  disaster_id bigint references disasters(id) on delete cascade,
  org_id bigint references organizations(id),
  name text not null,
  description text,
  latitude double precision,
  longitude double precision,
  goal bigint,
  raised bigint,
  image text,
  budget_allocation jsonb, -- {Emergency_shelter: 50000, ...}
  impact jsonb -- [{people_served, families_reached, medical_aid_provided}]
);



-- ========== SPONSORS ==========
create table sponsors (
  id bigint primary key,
  name text not null,
  logo text,
  memo text,
  stats jsonb, -- {peopleHelped, donations, events}
  future text
);




-- sponsor events as child table
create table sponsor_events (
  id bigserial primary key,
  sponsor_id bigint references sponsors(id) on delete cascade,
  title text,
  description text,
  image text
);


-- join table: which reliefs/donations are active in this disaster
create table disaster_reliefs (
  disaster_id bigint references disasters(id) on delete cascade,
  donation_id bigint references donations(id) on delete cascade,
  primary key (disaster_id, donation_id)
);

-- ========== VOLUNTEERS ==========
create table volunteers (
  id bigint primary key,
  disaster_id bigint references disasters(id) on delete cascade,
  org_id bigint references organizations(id),
  name text not null,
  description text,
  latitude double precision,
  longitude double precision,
  image text,
  impact jsonb -- {volunteers_needed, volunteers_signed_up}
);



-- join table: orgs ↔ reliefs
create table org_reliefs (
  org_id bigint references organizations(id) on delete cascade,
  donation_id bigint references donations(id) on delete cascade,
  primary key (org_id, donation_id)
);


-- join table: sponsors ↔ reliefs
create table sponsor_reliefs (
  sponsor_id bigint references sponsors(id) on delete cascade,
  donation_id bigint references donations(id) on delete cascade,
  primary key (sponsor_id, donation_id)
);



-- contributions as child table
create table donation_contributions (
  id bigserial primary key,
  donation_id bigint references donations(id) on delete cascade,
  name text,
  description text
);


-- roles as child table
create table volunteer_roles (
  id bigserial primary key,
  volunteer_id bigint references volunteers(id) on delete cascade,
  title text,
  skills_required text[],
  commitment text
);
