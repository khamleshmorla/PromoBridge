-- V2: Add proposal column to campaign_applications table
ALTER TABLE campaign_applications ADD COLUMN IF NOT EXISTS proposal TEXT;
