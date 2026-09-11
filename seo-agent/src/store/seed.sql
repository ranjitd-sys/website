-- DeepRank seed — docs/deeprank-seo-agent.md §22.
-- Idempotent: re-running does not duplicate rows.
-- volume/difficulty stay NULL until real keyword-tool data is provided (no fabrication).

INSERT INTO pages (url, intent, status) VALUES
  ('/resources/ecommerce-accounting', 'commercial', 'active'),
  ('/solutions/amazon-sellers', 'commercial', 'active'),
  ('/resources/reconciliation', 'commercial', 'active'),
  ('/erp-connector/accounting', 'commercial', 'active'),
  ('/solutions/d2c-brands', 'transactional', 'active')
ON CONFLICT (url) DO NOTHING;

INSERT INTO keywords (term, intent, volume, difficulty, target_url, status) VALUES
  ('ecommerce accounting software india', 'commercial', NULL, NULL, '/resources/ecommerce-accounting', 'active'),
  ('amazon seller gst accounting', 'commercial', NULL, NULL, '/solutions/amazon-sellers', 'active'),
  ('flipkart payment reconciliation', 'commercial', NULL, NULL, '/resources/reconciliation', 'active'),
  ('ecommerce accounting tally', 'commercial', NULL, NULL, '/erp-connector/accounting', 'active'),
  ('d2c brand accounting', 'transactional', NULL, NULL, '/solutions/d2c-brands', 'active')
ON CONFLICT (term) DO NOTHING;