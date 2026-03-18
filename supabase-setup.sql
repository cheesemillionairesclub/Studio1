-- ===== AlphaStudios - Supabase Database Setup =====
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- =============================================
-- 1. PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    subscription_status TEXT DEFAULT 'none',
    trial_end TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    tracks_used_this_month INTEGER DEFAULT 0,
    plan_type TEXT DEFAULT 'pro',
    country TEXT,
    device_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Service role can manage all profiles"
    ON public.profiles FOR ALL
    USING (auth.role() = 'service_role');

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 2. ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    stripe_session_id TEXT,
    stripe_payment_intent TEXT,
    customer_email TEXT,
    pack TEXT DEFAULT '',
    amount INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'usd',
    track_title TEXT DEFAULT '',
    track_artist TEXT DEFAULT '',
    track_artwork TEXT DEFAULT '',
    track_url TEXT DEFAULT '',
    genre TEXT DEFAULT '',
    similar_artists JSONB DEFAULT '[]'::jsonb,
    release_status TEXT DEFAULT '',
    order_status TEXT DEFAULT 'in_progress',
    receipt_url TEXT,
    feedback TEXT,
    reupload_count INTEGER DEFAULT 0,
    mastering_approved BOOLEAN DEFAULT FALSE,
    track_versions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can view their own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all orders"
    ON public.orders FOR ALL
    USING (auth.role() = 'service_role');

-- =============================================
-- 3. STORAGE BUCKET FOR RECEIPTS
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for receipts bucket
CREATE POLICY "Admin can upload receipts"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Anyone can view receipts"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'receipts');

CREATE POLICY "Admin can update receipts"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'receipts');

CREATE POLICY "Admin can delete receipts"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'receipts');

-- =============================================
-- 4. INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin) WHERE is_admin = true;

-- =============================================
-- 5. UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- 6. LABELS TABLE (Trackstack Integration)
-- =============================================
CREATE TABLE IF NOT EXISTS public.labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    genre TEXT NOT NULL DEFAULT '',
    trackstack_url TEXT NOT NULL DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on labels
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view active labels
CREATE POLICY "Anyone can view active labels"
    ON public.labels FOR SELECT
    USING (is_active = true);

-- Service role can manage all labels
CREATE POLICY "Service role can manage all labels"
    ON public.labels FOR ALL
    USING (auth.role() = 'service_role');

-- Index for genre filtering
CREATE INDEX IF NOT EXISTS idx_labels_genre ON public.labels(genre);
CREATE INDEX IF NOT EXISTS idx_labels_is_active ON public.labels(is_active) WHERE is_active = true;

-- Seed some example labels (replace with real data)
INSERT INTO public.labels (name, genre, trackstack_url) VALUES
    ('Spinnin'' Records', 'Electronic', 'https://www.trackstack.app/spinnin-records'),
    ('Anjunadeep', 'Electronic', 'https://www.trackstack.app/anjunadeep'),
    ('OWSLA', 'Electronic', 'https://www.trackstack.app/owsla'),
    ('Mad Decent', 'Electronic', 'https://www.trackstack.app/mad-decent'),
    ('Def Jam Recordings', 'Hip-Hop', 'https://www.trackstack.app/def-jam'),
    ('Top Dawg Entertainment', 'Hip-Hop', 'https://www.trackstack.app/tde'),
    ('Quality Control Music', 'Hip-Hop', 'https://www.trackstack.app/quality-control'),
    ('Mass Appeal Records', 'Hip-Hop', 'https://www.trackstack.app/mass-appeal'),
    ('XL Recordings', 'Pop', 'https://www.trackstack.app/xl-recordings'),
    ('Interscope Records', 'Pop', 'https://www.trackstack.app/interscope'),
    ('Republic Records', 'Pop', 'https://www.trackstack.app/republic-records'),
    ('Atlantic Records', 'Pop', 'https://www.trackstack.app/atlantic-records'),
    ('Stones Throw Records', 'R&B', 'https://www.trackstack.app/stones-throw'),
    ('Soulection', 'R&B', 'https://www.trackstack.app/soulection'),
    ('Brainfeeder', 'R&B', 'https://www.trackstack.app/brainfeeder'),
    ('Ninja Tune', 'Electronic', 'https://www.trackstack.app/ninja-tune'),
    ('Armada Music', 'Electronic', 'https://www.trackstack.app/armada-music'),
    ('Monstercat', 'Electronic', 'https://www.trackstack.app/monstercat'),
    ('300 Entertainment', 'Hip-Hop', 'https://www.trackstack.app/300-entertainment'),
    ('Dreamville Records', 'Hip-Hop', 'https://www.trackstack.app/dreamville'),
    ('Sub Pop', 'Rock', 'https://www.trackstack.app/sub-pop'),
    ('Epitaph Records', 'Rock', 'https://www.trackstack.app/epitaph'),
    ('Merge Records', 'Rock', 'https://www.trackstack.app/merge-records'),
    ('4AD', 'Rock', 'https://www.trackstack.app/4ad')
ON CONFLICT DO NOTHING;

-- =============================================
-- 7. MIGRATION: ADD plan_type COLUMN (run on existing databases)
-- =============================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'pro';

-- =============================================
-- 8. SET YOUR ADMIN USER
-- =============================================
-- After you sign in for the first time with Google,
-- run this query replacing YOUR_EMAIL with your email:
--
-- UPDATE public.profiles SET is_admin = true WHERE email = 'YOUR_EMAIL';
--
-- This grants you access to the admin panel at /admin.html
