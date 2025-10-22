-- Payça Database Schema
-- PostgreSQL + Supabase
-- This schema supports multi-user expense tracking with groups

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Users can view profiles of members in their groups
CREATE POLICY "Users can view group members' profiles"
    ON public.profiles FOR SELECT
    USING (
        id IN (
            SELECT DISTINCT gm2.user_id
            FROM group_members gm1
            JOIN group_members gm2 ON gm1.group_id = gm2.group_id
            WHERE gm1.user_id = auth.uid()
        )
    );

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. GROUPS TABLE
-- ============================================
CREATE TABLE public.groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('roommates', 'vacation', 'event', 'general')) DEFAULT 'general',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for groups
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Users can view groups they're members of
CREATE POLICY "Users can view their groups"
    ON public.groups FOR SELECT
    USING (
        id IN (
            SELECT group_id FROM group_members WHERE user_id = auth.uid()
        )
    );

-- Users can create groups
CREATE POLICY "Users can create groups"
    ON public.groups FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- Group creators and members can update
CREATE POLICY "Group members can update"
    ON public.groups FOR UPDATE
    USING (
        id IN (
            SELECT group_id FROM group_members WHERE user_id = auth.uid()
        )
    );

-- ============================================
-- 3. GROUP_MEMBERS TABLE (Many-to-Many)
-- ============================================
CREATE TABLE public.group_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- RLS Policies for group_members
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Users can view members of their groups
CREATE POLICY "Users can view group members"
    ON public.group_members FOR SELECT
    USING (
        group_id IN (
            SELECT group_id FROM group_members WHERE user_id = auth.uid()
        )
    );

-- Users can add members to groups they're in
CREATE POLICY "Users can add group members"
    ON public.group_members FOR INSERT
    WITH CHECK (
        group_id IN (
            SELECT group_id FROM group_members WHERE user_id = auth.uid()
        )
    );

-- Auto-add creator to group
CREATE OR REPLACE FUNCTION public.add_creator_to_group()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.group_members (group_id, user_id)
    VALUES (NEW.id, NEW.created_by);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_group_created
    AFTER INSERT ON public.groups
    FOR EACH ROW EXECUTE FUNCTION public.add_creator_to_group();

-- ============================================
-- 4. EXPENSES TABLE
-- ============================================
CREATE TABLE public.expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    paid_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    receipt_url TEXT,
    category TEXT DEFAULT 'other' CHECK (category IN ('food', 'bills', 'transport', 'entertainment', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Users can view expenses in their groups
CREATE POLICY "Users can view group expenses"
    ON public.expenses FOR SELECT
    USING (
        group_id IN (
            SELECT group_id FROM group_members WHERE user_id = auth.uid()
        )
    );

-- Users can create expenses in their groups
CREATE POLICY "Users can create expenses"
    ON public.expenses FOR INSERT
    WITH CHECK (
        group_id IN (
            SELECT group_id FROM group_members WHERE user_id = auth.uid()
        )
    );

-- ============================================
-- 5. EXPENSE_SPLITS TABLE
-- ============================================
CREATE TABLE public.expense_splits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    expense_id UUID REFERENCES public.expenses(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    settled BOOLEAN DEFAULT FALSE,
    settled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(expense_id, user_id)
);

-- RLS Policies for expense_splits
ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;

-- Users can view splits for expenses in their groups
CREATE POLICY "Users can view expense splits"
    ON public.expense_splits FOR SELECT
    USING (
        expense_id IN (
            SELECT e.id FROM expenses e
            JOIN group_members gm ON e.group_id = gm.group_id
            WHERE gm.user_id = auth.uid()
        )
    );

-- Users can create splits for their group expenses
CREATE POLICY "Users can create expense splits"
    ON public.expense_splits FOR INSERT
    WITH CHECK (
        expense_id IN (
            SELECT e.id FROM expenses e
            JOIN group_members gm ON e.group_id = gm.group_id
            WHERE gm.user_id = auth.uid()
        )
    );

-- Users can update their own splits
CREATE POLICY "Users can update splits"
    ON public.expense_splits FOR UPDATE
    USING (
        expense_id IN (
            SELECT e.id FROM expenses e
            JOIN group_members gm ON e.group_id = gm.group_id
            WHERE gm.user_id = auth.uid()
        )
    );

-- ============================================
-- 6. SETTLEMENTS TABLE
-- ============================================
CREATE TABLE public.settlements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    to_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    settled BOOLEAN DEFAULT FALSE,
    settled_at TIMESTAMP WITH TIME ZONE,
    payment_method TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (from_user_id != to_user_id)
);

-- RLS Policies for settlements
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

-- Users can view settlements in their groups
CREATE POLICY "Users can view group settlements"
    ON public.settlements FOR SELECT
    USING (
        group_id IN (
            SELECT group_id FROM group_members WHERE user_id = auth.uid()
        )
    );

-- Users can create settlements in their groups
CREATE POLICY "Users can create settlements"
    ON public.settlements FOR INSERT
    WITH CHECK (
        group_id IN (
            SELECT group_id FROM group_members WHERE user_id = auth.uid()
        )
        AND (from_user_id = auth.uid() OR to_user_id = auth.uid())
    );

-- Users can update settlements they're involved in
CREATE POLICY "Users can update their settlements"
    ON public.settlements FOR UPDATE
    USING (
        group_id IN (
            SELECT group_id FROM group_members WHERE user_id = auth.uid()
        )
        AND (from_user_id = auth.uid() OR to_user_id = auth.uid())
    );

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_expenses_group_id ON public.expenses(group_id);
CREATE INDEX idx_expenses_paid_by ON public.expenses(paid_by);
CREATE INDEX idx_expense_splits_expense_id ON public.expense_splits(expense_id);
CREATE INDEX idx_expense_splits_user_id ON public.expense_splits(user_id);
CREATE INDEX idx_settlements_group_id ON public.settlements(group_id);
CREATE INDEX idx_settlements_from_user ON public.settlements(from_user_id);
CREATE INDEX idx_settlements_to_user ON public.settlements(to_user_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_groups_updated_at
    BEFORE UPDATE ON public.groups
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- You can run this after creating your first user via Supabase Auth

-- Note: Replace the UUIDs with actual user IDs from auth.users after signup
-- Example:
-- INSERT INTO public.groups (name, description, type, created_by)
-- VALUES ('Ev Arkadaşları', 'Kira ve faturalar', 'roommates', '<your-user-id>');
