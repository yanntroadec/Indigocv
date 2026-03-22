-- Remove the public INSERT policy on contact_messages.
-- Inserts are now done via the service_role key in the API route,
-- so no RLS policy is needed for inserts.
DROP POLICY "Anyone can insert contact messages" ON contact_messages;
