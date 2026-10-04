-- CreateTable
CREATE TABLE "prescription_templates" (
    "id"             TEXT NOT NULL,
    "name"           TEXT NOT NULL,
    "nameBn"         TEXT NOT NULL,
    "category"       TEXT NOT NULL DEFAULT 'GENERAL',
    "chiefComplaint" TEXT,
    "history"        TEXT,
    "diagnosis"      TEXT,
    "advice"         TEXT,
    "instructions"   TEXT,
    "followUpNote"   TEXT,
    "followUpDays"   INTEGER,
    "isShared"       BOOLEAN NOT NULL DEFAULT false,
    "doctorId"       TEXT,
    "createdBy"      TEXT NOT NULL,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescription_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription_template_items" (
    "id"           TEXT NOT NULL,
    "templateId"   TEXT NOT NULL,
    "medicineName" TEXT NOT NULL,
    "strength"     TEXT,
    "dosageForm"   TEXT,
    "eye"          TEXT,
    "dose"         TEXT,
    "frequency"    TEXT,
    "duration"     TEXT,
    "instructions" TEXT,
    "sortOrder"    INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "prescription_template_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prescription_templates_doctorId_idx" ON "prescription_templates"("doctorId");
CREATE INDEX "prescription_templates_category_idx" ON "prescription_templates"("category");
CREATE INDEX "prescription_template_items_templateId_idx" ON "prescription_template_items"("templateId");

-- AddForeignKey
ALTER TABLE "prescription_templates"
    ADD CONSTRAINT "prescription_templates_doctorId_fkey"
    FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_template_items"
    ADD CONSTRAINT "prescription_template_items_templateId_fkey"
    FOREIGN KEY ("templateId") REFERENCES "prescription_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
