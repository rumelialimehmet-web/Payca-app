-- Payça Storage Setup for Receipt Photos
-- Run this in Supabase SQL Editor after running the main schema

-- ============================================
-- STEP 1: CREATE STORAGE BUCKET
-- ============================================

-- Create receipts bucket for storing receipt photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 2: STORAGE POLICIES
-- ============================================

-- Allow authenticated users to upload receipts
CREATE POLICY "Authenticated users can upload receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'receipts');

-- Allow users to view receipts from their groups
CREATE POLICY "Users can view group receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'receipts' AND (
    -- Allow if user is in a group that has an expense with this receipt
    EXISTS (
      SELECT 1 FROM public.expenses e
      JOIN public.group_members gm ON e.group_id = gm.group_id
      WHERE gm.user_id = auth.uid()
      AND e.receipt_url LIKE '%' || storage.objects.name || '%'
    )
  )
);

-- Allow users to delete their own uploaded receipts
CREATE POLICY "Users can delete their own receipts"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'receipts' AND (
    -- Allow if user uploaded an expense with this receipt
    EXISTS (
      SELECT 1 FROM public.expenses e
      WHERE e.paid_by = auth.uid()
      AND e.receipt_url LIKE '%' || storage.objects.name || '%'
    )
  )
);

-- ============================================
-- STEP 3: FILE SIZE AND TYPE CONSTRAINTS
-- ============================================

-- Maximum file size: 10MB
-- Allowed types: image/jpeg, image/png, image/webp, image/heic
-- These constraints are enforced in the application code
