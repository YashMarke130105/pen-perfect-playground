import { Button } from '@/components/ui/button';
import { Code2, Zap, Save, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Code2,
      title: 'Live Code Editing',
      description: 'Write HTML, CSS, and JavaScript with instant preview',
    },
    {
      icon: Zap,
      title: 'Real-time Preview',
      description: 'See your changes instantly as you type',
    },
    {
      icon: Save,
      title: 'Save Projects',
      description: 'Store your creations and access them anytime',
    },
    {
      icon: Share2,
      title: 'Export & Share',
      description: 'Download your projects as standalone HTML files',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">CodeSpace</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-5xl font-bold leading-tight">
            Code. Create. <span className="text-primary">Instantly.</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            A powerful online code editor for HTML, CSS, and JavaScript with live preview.
            Perfect for learning, prototyping, and sharing your web creations.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Start Coding Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/editor')}>
              Try Without Account
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">Everything You Need</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 rounded-lg border border-border bg-card hover:border-primary transition-colors"
              >
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-20 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to start creating?</h3>
          <p className="text-xl text-muted-foreground mb-8">
            Join developers worldwide and bring your ideas to life
          </p>
          <Button size="lg" onClick={() => navigate('/auth')}>
            Create Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>© 2025 CodeSpace. Built with ❤️ for developers.</p>
        </div>
      </footer>
    </div>
  );
}
