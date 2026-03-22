-- =============================================================================
-- Supabase Migration: Elephant Wings KC Admin CMS
-- =============================================================================
-- This migration creates all tables and seeds initial content for the
-- Elephant Wings KC Admin CMS. Run this in the Supabase SQL editor.
-- =============================================================================

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS site_config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS hours (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_name   TEXT NOT NULL UNIQUE,
  day_order  SMALLINT NOT NULL,
  open_time  TEXT,
  close_time TEXT,
  is_closed  BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS menu_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  description  TEXT,
  price_cents  INTEGER NOT NULL,
  section      TEXT NOT NULL,
  dietary_tags TEXT[] NOT NULL DEFAULT '{}',
  sort_order   SMALLINT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote       TEXT NOT NULL,
  attribution TEXT NOT NULL,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS journal_posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  excerpt         TEXT NOT NULL,
  body            TEXT NOT NULL,
  pillar          TEXT NOT NULL,
  cover_image_url TEXT,
  status          TEXT NOT NULL DEFAULT 'draft',
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media_assets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label        TEXT NOT NULL UNIQUE,
  url          TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type    TEXT NOT NULL,
  size_bytes   INTEGER NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- Seed: site_config
-- ----------------------------------------------------------------------------

INSERT INTO site_config (key, value) VALUES
  ('phone',                        '8165885973'),
  ('address_street',               '1234 Main Street'),
  ('address_city',                 'Kansas City'),
  ('address_state',                'MO'),
  ('address_zip',                  '64105'),
  ('service_area',                 '["Kansas City","Overland Park","Leawood","Prairie Village","Lenexa","Olathe","Lee''s Summit","Independence","Liberty","Shawnee"]'),
  ('hero_headline',                'Bold Indian Fusion in the Heart of KC'),
  ('hero_subtext',                 'Catering, private dining, and chef-on-demand experiences crafted with bold spices and local ingredients.'),
  ('announcement_enabled',         'false'),
  ('announcement_text',            'Now booking for fall events — limited dates available!'),
  ('about_bio',                    'Chef Ameet Malhotra brings bold Indian flavors to Kansas City through years of culinary training and a deep love for his heritage. Raised between Mumbai and the Midwest, Ameet blends traditional spice profiles with locally sourced ingredients to create dishes that feel both familiar and surprising. Elephant Wings KC was born from his belief that great food should tell a story — and that every table deserves a memorable one.'),
  ('about_values',                 'We believe food is community. Every dish we prepare is made with intention — honoring the traditions that shaped us while embracing the creativity that drives us forward. We source locally whenever possible, minimize waste, and treat every event as an opportunity to bring people together around something truly delicious.'),
  ('services_catering_headline',   'Full-Service Catering for Every Occasion'),
  ('services_catering_description','From intimate dinner parties to large corporate events, our catering team delivers restaurant-quality Indian fusion cuisine directly to your venue. We handle everything from menu planning and prep to service and cleanup, so you can focus on your guests.'),
  ('services_catering_pricing',    'Catering packages start at $35 per person for buffet-style service and $55 per person for plated dinners. Custom menus and dietary accommodations available. Contact us for a personalized quote.'),
  ('services_cod_headline',        'Your Personal Chef, On Your Schedule'),
  ('services_cod_description',     'Chef-On-Demand brings the Elephant Wings KC experience into your home. Chef Ameet arrives with all ingredients and equipment, prepares a multi-course meal in your kitchen, and leaves it spotless. Perfect for date nights, family celebrations, or impressing out-of-town guests.'),
  ('services_cod_pricing',         'Chef-On-Demand starts at $150 for two guests, with an additional $40 per person beyond that. Includes a 3-course menu, all ingredients, and kitchen cleanup. Gratuity not included.')
ON CONFLICT (key) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Seed: hours (Monday–Sunday, day_order 0–6)
-- ----------------------------------------------------------------------------

INSERT INTO hours (day_name, day_order, open_time, close_time, is_closed) VALUES
  ('Monday',    0, NULL,    NULL,    true),
  ('Tuesday',   1, '11:00', '22:00', false),
  ('Wednesday', 2, '11:00', '22:00', false),
  ('Thursday',  3, '11:00', '22:00', false),
  ('Friday',    4, '11:00', '22:00', false),
  ('Saturday',  5, '11:00', '23:00', false),
  ('Sunday',    6, '11:00', '21:00', false)
ON CONFLICT (day_name) DO NOTHING;
