-- Currency Support Migration
-- Add currency fields to expenses and groups tables

-- ============================================
-- STEP 1: ADD CURRENCY FIELD TO EXPENSES
-- ============================================

-- Add currency column to expenses table
ALTER TABLE public.expenses
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'TRY'
CHECK (currency IN ('TRY', 'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD'));

-- Add original_amount and original_currency for multi-currency tracking
ALTER TABLE public.expenses
ADD COLUMN IF NOT EXISTS original_amount DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS original_currency TEXT;

-- Add exchange_rate column to track the rate at the time of expense creation
ALTER TABLE public.expenses
ADD COLUMN IF NOT EXISTS exchange_rate DECIMAL(10, 6);

-- Comment for clarity
COMMENT ON COLUMN public.expenses.currency IS 'Currency code for the expense amount (TRY, USD, EUR, etc.)';
COMMENT ON COLUMN public.expenses.original_amount IS 'Original amount if converted from another currency';
COMMENT ON COLUMN public.expenses.original_currency IS 'Original currency if converted';
COMMENT ON COLUMN public.expenses.exchange_rate IS 'Exchange rate used for conversion';

-- ============================================
-- STEP 2: UPDATE GROUPS TABLE
-- ============================================

-- Add default_currency to groups table
ALTER TABLE public.groups
ADD COLUMN IF NOT EXISTS default_currency TEXT DEFAULT 'TRY'
CHECK (default_currency IN ('TRY', 'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD'));

COMMENT ON COLUMN public.groups.default_currency IS 'Default currency for the group';

-- ============================================
-- STEP 3: UPDATE EXISTING DATA
-- ============================================

-- Set currency for existing expenses based on their amount
-- (assumes existing expenses are in TRY)
UPDATE public.expenses
SET currency = 'TRY'
WHERE currency IS NULL;

UPDATE public.groups
SET default_currency = 'TRY'
WHERE default_currency IS NULL;

-- ============================================
-- STEP 4: CREATE CURRENCY EXCHANGE RATES TABLE (OPTIONAL)
-- ============================================
-- This table can cache exchange rates locally if needed

CREATE TABLE IF NOT EXISTS public.exchange_rates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    base_currency TEXT NOT NULL,
    target_currency TEXT NOT NULL,
    rate DECIMAL(10, 6) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(base_currency, target_currency, date)
);

CREATE INDEX idx_exchange_rates_currencies ON public.exchange_rates(base_currency, target_currency);
CREATE INDEX idx_exchange_rates_date ON public.exchange_rates(date);

COMMENT ON TABLE public.exchange_rates IS 'Cached exchange rates from Frankfurter API';

-- ============================================
-- STEP 5: CREATE HELPER FUNCTION FOR CURRENCY CONVERSION
-- ============================================

CREATE OR REPLACE FUNCTION public.convert_expense_amount(
    expense_id UUID,
    target_currency TEXT
) RETURNS DECIMAL(10, 2) AS $$
DECLARE
    expense_currency TEXT;
    expense_amount DECIMAL(10, 2);
    converted_amount DECIMAL(10, 2);
    rate DECIMAL(10, 6);
BEGIN
    -- Get expense details
    SELECT currency, amount INTO expense_currency, expense_amount
    FROM public.expenses
    WHERE id = expense_id;

    -- If same currency, return original amount
    IF expense_currency = target_currency THEN
        RETURN expense_amount;
    END IF;

    -- Try to get rate from cache (today's rate)
    SELECT exchange_rates.rate INTO rate
    FROM public.exchange_rates
    WHERE base_currency = expense_currency
    AND target_currency = target_currency
    AND date = CURRENT_DATE
    LIMIT 1;

    -- If rate found, use it
    IF rate IS NOT NULL THEN
        converted_amount := expense_amount * rate;
        RETURN ROUND(converted_amount, 2);
    END IF;

    -- If no rate found, return original amount
    -- (Client should call API for conversion)
    RETURN expense_amount;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.convert_expense_amount IS 'Convert expense amount to target currency using cached rates';

-- ============================================
-- STEP 6: CREATE VIEW FOR MULTI-CURRENCY BALANCES
-- ============================================

CREATE OR REPLACE VIEW public.group_balances_by_currency AS
SELECT
    e.group_id,
    e.currency,
    e.paid_by,
    SUM(e.amount) as total_paid,
    COUNT(e.id) as expense_count
FROM public.expenses e
GROUP BY e.group_id, e.currency, e.paid_by;

COMMENT ON VIEW public.group_balances_by_currency IS 'Group expenses by currency for multi-currency balance calculations';

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Verify the changes
SELECT
    'expenses' as table_name,
    COUNT(*) as row_count,
    COUNT(DISTINCT currency) as currency_count
FROM public.expenses
UNION ALL
SELECT
    'groups' as table_name,
    COUNT(*) as row_count,
    COUNT(DISTINCT default_currency) as currency_count
FROM public.groups;
