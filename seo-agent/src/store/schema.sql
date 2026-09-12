-- DeepRank schema — see docs/deeprank-seo-agent.md §17.
-- Idempotent: safe to run repeatedly.

CREATE TABLE IF NOT EXISTS keywords (
  id BIGSERIAL PRIMARY KEY,
  term TEXT NOT NULL UNIQUE,
  intent TEXT NOT NULL CHECK (intent IN ('commercial', 'transactional', 'informational')),
  volume INTEGER,
  difficulty INTEGER,
  target_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'retired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS keywords_status_idx ON keywords (status);

CREATE TABLE IF NOT EXISTS keyword_positions (
  id BIGSERIAL PRIMARY KEY,
  keyword_id BIGINT NOT NULL REFERENCES keywords (id) ON DELETE CASCADE,
  sample_date DATE NOT NULL,
  position NUMERIC NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  ctr NUMERIC NOT NULL DEFAULT 0,
  UNIQUE (keyword_id, sample_date)
);

CREATE INDEX IF NOT EXISTS keyword_positions_kw_date_idx
  ON keyword_positions (keyword_id, sample_date DESC);

CREATE TABLE IF NOT EXISTS pages (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  intent TEXT,
  h1 TEXT,
  title TEXT,
  description TEXT,
  last_crawled_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS opportunities (
  id BIGSERIAL PRIMARY KEY,
  keyword_id BIGINT NOT NULL REFERENCES keywords (id),
  page_id BIGINT NOT NULL REFERENCES pages (id),
  action TEXT NOT NULL,
  justification TEXT,
  score NUMERIC,
  status TEXT NOT NULL DEFAULT 'proposed'
    CHECK (status IN ('proposed', 'optimizing', 'rejected', 'approved', 'done', 'measured')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS opportunities_status_idx ON opportunities (status);

CREATE TABLE IF NOT EXISTS changes (
  id BIGSERIAL PRIMARY KEY,
  opportunity_id BIGINT NOT NULL UNIQUE REFERENCES opportunities (id),
  branch TEXT,
  pr_url TEXT,
  diff_summary TEXT,
  deployed_at TIMESTAMPTZ,
  measurement JSONB
);

CREATE INDEX IF NOT EXISTS changes_measurement_idle_idx ON changes (opportunity_id)
  WHERE deployed_at IS NOT NULL AND measurement IS NULL;

CREATE TABLE IF NOT EXISTS learnings (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  change_id BIGINT REFERENCES changes (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS learnings_created_idx ON learnings (created_at DESC);