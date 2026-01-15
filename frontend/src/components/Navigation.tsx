import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Trophy, Sword } from 'lucide-react';

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'ホーム', icon: Home },
    { path: '/create-quest', label: 'クエストをつくる', icon: PlusCircle },
    { path: '/achievements', label: '称号', icon: Trophy },
  ];

  return (
    <nav className="border-b-2 border-amber-600/30 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <Sword className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors" />
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300">
              Habit RPG
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-amber-600/20 border border-amber-600/50 text-amber-300'
                      : 'text-amber-200/70 hover:bg-amber-950/30 hover:text-amber-300 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-semibold hidden md:inline">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
