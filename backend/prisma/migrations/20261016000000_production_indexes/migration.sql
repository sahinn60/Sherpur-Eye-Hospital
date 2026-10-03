-- ─── Additional indexes for production query performance ─────────────────────

-- Appointments: common filters
CREATE INDEX IF NOT EXISTS "appointments_status_idx"        ON "appointments"("status");
CREATE INDEX IF NOT EXISTS "appointments_preferredDate_idx" ON "appointments"("preferredDate");
CREATE INDEX IF NOT EXISTS "appointments_doctorId_idx"      ON "appointments"("doctorId");
CREATE INDEX IF NOT EXISTS "appointments_phone_idx"         ON "appointments"("phone");

-- News: published listing
CREATE INDEX IF NOT EXISTS "news_articles_isPublished_idx"  ON "news_articles"("isPublished");
CREATE INDEX IF NOT EXISTS "news_articles_publishedAt_idx"  ON "news_articles"("publishedAt" DESC);
CREATE INDEX IF NOT EXISTS "news_articles_category_idx"     ON "news_articles"("category");

-- Gallery: active images by category
CREATE INDEX IF NOT EXISTS "gallery_images_isActive_idx"    ON "gallery_images"("isActive");
CREATE INDEX IF NOT EXISTS "gallery_images_category_idx"    ON "gallery_images"("category");
CREATE INDEX IF NOT EXISTS "gallery_images_sortOrder_idx"   ON "gallery_images"("sortOrder");

-- Doctors: active listing
CREATE INDEX IF NOT EXISTS "doctors_isActive_idx"           ON "doctors"("isActive");
CREATE INDEX IF NOT EXISTS "doctors_sortOrder_idx"          ON "doctors"("sortOrder");

-- Services: active listing
CREATE INDEX IF NOT EXISTS "services_isActive_idx"          ON "services"("isActive");
CREATE INDEX IF NOT EXISTS "services_category_idx"          ON "services"("category");

-- Users: login lookup
CREATE INDEX IF NOT EXISTS "users_email_idx"                ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_isActive_idx"             ON "users"("isActive");

-- Invoices: date range queries
CREATE INDEX IF NOT EXISTS "invoices_issuedAt_idx"          ON "invoices"("issuedAt" DESC);

-- Notices: active ticker
CREATE INDEX IF NOT EXISTS "notices_isActive_idx"           ON "notices"("isActive");
CREATE INDEX IF NOT EXISTS "notices_expiresAt_idx"          ON "notices"("expiresAt");

-- Site settings: group lookup
CREATE INDEX IF NOT EXISTS "site_settings_group_idx"        ON "site_settings"("group");

-- ─── Check constraints for data integrity ─────────────────────────────────────

-- Appointments: age must be positive
ALTER TABLE "appointments"
  ADD CONSTRAINT "appointments_age_positive" CHECK ("age" > 0 AND "age" < 150);

-- Invoices: amounts must be non-negative
ALTER TABLE "invoices"
  ADD CONSTRAINT "invoices_amounts_non_negative"
  CHECK ("subtotal" >= 0 AND "totalAmount" >= 0 AND "paidAmount" >= 0 AND "dueAmount" >= 0);

-- Inventory: stock and prices non-negative
ALTER TABLE "inventory_items"
  ADD CONSTRAINT "inventory_items_qty_non_negative"   CHECK ("stockQty" >= 0);
ALTER TABLE "inventory_items"
  ADD CONSTRAINT "inventory_items_price_non_negative" CHECK ("purchasePrice" >= 0 AND "sellingPrice" >= 0);
ALTER TABLE "inventory_items"
  ADD CONSTRAINT "inventory_items_minstock_positive"  CHECK ("minStock" >= 0);

-- Employees: salary non-negative
ALTER TABLE "employees"
  ADD CONSTRAINT "employees_salary_non_negative"
  CHECK ("basicSalary" >= 0 AND "allowances" >= 0 AND "deductions" >= 0);

-- Leave: end date must be >= start date
ALTER TABLE "leave_requests"
  ADD CONSTRAINT "leave_requests_dates_valid" CHECK ("endDate" >= "startDate");
ALTER TABLE "leave_requests"
  ADD CONSTRAINT "leave_requests_totalDays_positive" CHECK ("totalDays" > 0);

-- Stock history: quantity must be positive
ALTER TABLE "stock_history"
  ADD CONSTRAINT "stock_history_qty_positive" CHECK ("quantity" > 0);
