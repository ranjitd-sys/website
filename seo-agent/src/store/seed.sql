-- DeepRank seed — first iteration.
-- Idempotent: safe to run repeatedly.
-- Run: psql "$SEO_DATABASE_URL" -f src/store/seed.sql

INSERT INTO pages (url, intent, status) VALUES
  ('/resources/ecommerce-accounting', 'commercial', 'active'),
  ('/solutions/amazon-sellers', 'commercial', 'active'),
  ('/resources/reconciliation', 'transactional', 'active'),
  ('/erp-connector/accounting', 'commercial', 'active'),
  ('/solutions/d2c-brands', 'informational', 'active')
ON CONFLICT (url) DO UPDATE SET status = 'active';

INSERT INTO keywords (term, intent, target_url, status) VALUES
  ('ecommerce accounting software india', 'commercial', '/resources/ecommerce-accounting', 'active'),
  ('amazon seller gst accounting', 'commercial', '/solutions/amazon-sellers', 'active'),
  ('flipkart payment reconciliation', 'transactional', '/resources/reconciliation', 'active'),
  ('ecommerce accounting tally', 'commercial', '/erp-connector/accounting', 'active'),
  ('d2c brand accounting', 'informational', '/solutions/d2c-brands', 'active')
ON CONFLICT (term) DO UPDATE SET status = 'active';