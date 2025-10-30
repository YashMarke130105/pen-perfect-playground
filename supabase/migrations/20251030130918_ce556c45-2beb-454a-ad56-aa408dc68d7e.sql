-- Allow everyone to view all projects (public gallery)
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;

CREATE POLICY "Everyone can view all projects"
ON public.projects
FOR SELECT
USING (true);

-- Keep other policies for create/update/delete (only own projects)
-- Users can still only modify their own projects