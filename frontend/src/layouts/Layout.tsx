import { Navigation } from '@/components/Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
