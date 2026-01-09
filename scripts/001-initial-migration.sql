-- =================================================================
-- ZIPHA MINI APP V2 - INITIAL MIGRATION
-- Version: 2.0.0
-- WARNING: Run this ONLY on a fresh database or after backing up
-- =================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================
-- ENUMS
-- =================================================================

DO $$ BEGIN
    CREATE TYPE language_code AS ENUM ('en', 'ru', 'fr', 'es');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE interval_unit AS ENUM ('day', 'week', 'month', 'year');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'platform_manager', 'platform_support', 'merchant', 'rider', 'user');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE merchant_role AS ENUM ('owner', 'admin', 'agent');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'inactive', 'left', 'pending', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_type AS ENUM ('one_month', 'three_months', 'six_months', 'twelve_months', 'lifetime', 'custom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE membership_status AS ENUM ('joined', 'not_joined', 'removed_by_bot', 'removed_by_admin', 'left_group');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'success', 'rejected', 'outdated', 'replaced', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'paid', 'rejected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ledger_type AS ENUM ('credit', 'debit');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_category AS ENUM ('payment_issue', 'access_issue', 'copier_issue', 'order_issue', 'other');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sender_type AS ENUM ('customer', 'agent', 'system');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE coupon_scope AS ENUM ('global', 'specific_service');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE provisioning_step AS ENUM ('idle', 'creating_user', 'provisioning_bot', 'creating_channel', 'transferring_ownership', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE doc_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE execution_status AS ENUM ('pending', 'success', 'failed', 'skipped');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE feedback_type AS ENUM ('native_poll', 'inline_survey');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE feedback_sentiment AS ENUM ('positive', 'neutral', 'negative');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending_payment', 'paid_escrow', 'packing', 'ready_for_pickup', 'dispatched', 'delivered', 'disputed', 'refunded', 'completed');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dispatch_type AS ENUM ('bike', 'van', 'truck');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- =================================================================
-- IMPORTANT: After running this SQL, run `prisma db push` or 
-- `prisma migrate dev` to create the tables from the schema.
-- This script only creates the ENUMs to ensure proper enum handling.
-- =================================================================

SELECT 'Enums created successfully. Now run: npx prisma db push' AS status;
