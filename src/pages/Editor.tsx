import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CodeEditor } from '@/components/CodeEditor';
import { Preview } from '@/components/Preview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Download, 
  LogOut, 
  Code2, 
  User,
  Plus,
  FolderOpen
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

export default function Editor() {
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [html, setHtml] = useState('<!-- Write your HTML here -->\n<h1>Hello World!</h1>');
  const [css, setCss] = useState('/* Write your CSS here */\nbody {\n  font-family: Arial, sans-serif;\n  padding: 20px;\n}');
  const [js, setJs] = useState('// Write your JavaScript here\nconsole.log("Hello from CodeCanvas!");');
  const [title, setTitle] = useState('Untitled Project');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Allow guest access - no redirect needed

  useEffect(() => {
    if (user) {
      fetchUsername();
      checkForLoadProject();
    }
  }, [user]);

  const checkForLoadProject = () => {
    const loadProjectData = sessionStorage.getItem('loadProject');
    if (loadProjectData) {
      try {
        const project = JSON.parse(loadProjectData);
        setTitle(project.title);
        setHtml(project.html_code || '');
        setCss(project.css_code || '');
        setJs(project.js_code || '');
        setCurrentProjectId(project.id);
        sessionStorage.removeItem('loadProject');
        
        toast({
          title: "Project loaded",
          description: `${project.title} is ready to edit`,
        });
      } catch (error) {
        console.error('Error loading project:', error);
      }
    }
  };

  const fetchUsername = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();
      
    if (data && !error) {
      setUsername(data.username);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your project",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setSaving(true);
    
    try {
      if (currentProjectId) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update({
            title,
            html_code: html,
            css_code: css,
            js_code: js,
          })
          .eq('id', currentProjectId)
          .eq('user_id', user.id); // Only update own projects

        if (error) throw error;
        
        toast({
          title: "Project updated",
          description: "Your changes have been saved",
        });
      } else {
        // Create new project
        const { data, error } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            title,
            html_code: html,
            css_code: css,
            js_code: js,
          })
          .select()
          .single();

        if (error) throw error;
        
        setCurrentProjectId(data.id);
        toast({
          title: "Project saved",
          description: "Your project has been saved successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error saving project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const content = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    ${js}
  </script>
</body>
</html>
    `.trim();

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Project exported",
      description: "Your HTML file has been downloaded",
    });
  };

  const handleNewProject = () => {
    setCurrentProjectId(null);
    setTitle('Untitled Project');
    setHtml('<!-- Write your HTML here -->\n<h1>Hello World!</h1>');
    setCss('/* Write your CSS here */\nbody {\n  font-family: Arial, sans-serif;\n  padding: 20px;\n}');
    setJs('// Write your JavaScript here\nconsole.log("Hello from CodeCanvas!");');
    
    toast({
      title: "New project created",
      description: "Start coding your new creation!",
    });
  };

  if (loading) {
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
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-header-bg border-b border-border px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">CodeCanvas Live</h1>
        </div>
        
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="max-w-xs bg-secondary border-border"
          placeholder="Project title"
        />
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-2">
          <Button onClick={handleNewProject} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
          
          <Button onClick={handleSave} variant="default" size="sm" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
          
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {username || 'User'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/projects')}>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  All Projects
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/account')}>
                  <User className="h-4 w-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button onClick={() => navigate('/projects')} variant="outline" size="sm">
                <FolderOpen className="h-4 w-4 mr-2" />
                Browse Projects
              </Button>
              <Button onClick={() => navigate('/auth')} size="sm">
                Sign In
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Editor Layout */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Code Editors */}
        <div className="h-[40%] flex border-b border-border">
          <div className="flex-1">
            <CodeEditor language="html" value={html} onChange={setHtml} />
          </div>
          <div className="flex-1">
            <CodeEditor language="css" value={css} onChange={setCss} />
          </div>
          <div className="flex-1">
            <CodeEditor language="javascript" value={js} onChange={setJs} />
          </div>
        </div>
        
        {/* Preview */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-4 py-2 text-sm font-medium bg-secondary border-b border-border text-foreground">
            PREVIEW
          </div>
          <div className="flex-1 overflow-hidden">
            <Preview html={html} css={css} js={js} />
          </div>
        </div>
      </div>
    </div>
  );
}
