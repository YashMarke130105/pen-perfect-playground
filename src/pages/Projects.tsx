import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, ArrowLeft, Trash2, FileCode, Calendar } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Project {
  id: string;
  title: string;
  html_code: string;
  css_code: string;
  js_code: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles?: {
    username: string;
  };
}

export default function Projects() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Allow viewing projects without login (public gallery)

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      // Fetch all projects (public gallery)
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (projectsError) throw projectsError;
      
      // Fetch usernames for all projects
      if (projectsData && projectsData.length > 0) {
        const userIds = [...new Set(projectsData.map(p => p.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds);

        if (!profilesError && profilesData) {
          // Map usernames to projects
          const profilesMap = new Map(profilesData.map(p => [p.id, p]));
          const enrichedProjects = projectsData.map(project => ({
            ...project,
            profiles: profilesMap.get(project.user_id)
          }));
          setProjects(enrichedProjects);
        } else {
          setProjects(projectsData);
        }
      } else {
        setProjects([]);
      }
    } catch (error: any) {
      toast({
        title: "Error loading projects",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleLoadProject = (project: Project) => {
    // Store project data in sessionStorage to load in editor
    sessionStorage.setItem('loadProject', JSON.stringify(project));
    navigate('/editor');
  };

  const handleDeleteProject = async () => {
    if (!deleteId || !user) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', deleteId)
        .eq('user_id', user.id); // Only allow deleting own projects

      if (error) throw error;
      
      setProjects(projects.filter(p => p.id !== deleteId));
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading || loadingProjects) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-header-bg border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/editor')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Editor
          </Button>
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">CodeSpace</h1>
          </div>
        </div>
        {!user && (
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        )}
      </header>

      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {user ? 'All Projects' : 'Project Gallery'}
          </h2>
          <p className="text-muted-foreground">
            {user ? 'Browse and manage all projects' : 'Explore projects created by our community'}
          </p>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Start creating by going to the editor
              </p>
              <Button onClick={() => navigate('/editor')}>
                Go to Editor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => {
              const isOwnProject = user && project.user_id === user.id;
              return (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="truncate">{project.title}</CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(project.updated_at)}
                      </div>
                      {project.profiles && (
                        <div className="text-xs">
                          by {project.profiles.username}
                        </div>
                      )}
                      {isOwnProject && (
                        <div className="text-xs font-semibold text-primary">
                          Your Project
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={() => handleLoadProject(project)}
                    >
                      <FileCode className="h-4 w-4 mr-2" />
                      Open Project
                    </Button>
                    {isOwnProject && (
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => setDeleteId(project.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
