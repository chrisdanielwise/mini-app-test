-- =================================================================
-- SEED: Platform Plans (SaaS Tiers)
-- =================================================================

INSERT INTO platform_plans (id, name, description, price_monthly, price_yearly, transaction_fee_percent, max_subscribers, max_team_members, max_services, allow_coupons, allow_whitelabel, allow_broadcasts, created_at, updated_at)
VALUES 
  (
    uuid_generate_v4(),
    'Free',
    'Get started with basic features. Perfect for testing.',
    0,
    0,
    10.00,
    25,
    0,
    1,
    false,
    false,
    false,
    NOW(),
    NOW()
  ),
  (
    uuid_generate_v4(),
    'Starter',
    'For growing businesses. Lower fees and more features.',
    29.00,
    290.00,
    7.50,
    100,
    2,
    3,
    true,
    false,
    true,
    NOW(),
    NOW()
  ),
  (
    uuid_generate_v4(),
    'Pro',
    'For established businesses. Premium features and lowest fees.',
    99.00,
    990.00,
    5.00,
    500,
    5,
    10,
    true,
    true,
    true,
    NOW(),
    NOW()
  ),
  (
    uuid_generate_v4(),
    'Enterprise',
    'Custom solutions for large-scale operations.',
    299.00,
    2990.00,
    3.00,
    -1, -- Unlimited
    -1, -- Unlimited
    -1, -- Unlimited
    true,
    true,
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  transaction_fee_percent = EXCLUDED.transaction_fee_percent,
  max_subscribers = EXCLUDED.max_subscribers,
  max_team_members = EXCLUDED.max_team_members,
  max_services = EXCLUDED.max_services,
  allow_coupons = EXCLUDED.allow_coupons,
  allow_whitelabel = EXCLUDED.allow_whitelabel,
  allow_broadcasts = EXCLUDED.allow_broadcasts,
  updated_at = NOW();

SELECT 'Platform plans seeded successfully' AS status;
