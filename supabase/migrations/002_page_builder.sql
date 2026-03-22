-- Page builder: stores GrapesJS HTML + CSS + component JSON per page slug
CREATE TABLE IF NOT EXISTS page_builder (
  slug        TEXT PRIMARY KEY,
  html        TEXT NOT NULL DEFAULT '',
  css         TEXT NOT NULL DEFAULT '',
  components  JSONB,
  styles      JSONB,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
