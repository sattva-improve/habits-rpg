import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Trophy, Sword } from 'lucide-react';

const navItems = [
  { path: '/', label: 'ホーム', icon: Home },
  { path: '/create-quest', label: '習慣をつくる', icon: PlusCircle },
  { path: '/achievements', label: '称号', icon: Trophy },
];

// デスクトップ用トップナビゲーション
export function Navigation() {
  const location = useLocation();

  return (
    <nav className="border-b-2 border-amber-600/30 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 hidden md:block">
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
                  <span className="text-sm font-semibold">
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

// モバイル用ボトムナビゲーション
export function MobileBottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t-2 border-amber-600/30 z-50 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-2 rounded-lg transition-all ${
                isActive
                  ? 'text-amber-300'
                  : 'text-amber-200/50 active:text-amber-300'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className={`text-xs mt-1 font-semibold ${isActive ? 'text-amber-300' : 'text-amber-200/70'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-8 h-1 bg-amber-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// モバイル用のヘッダー（ロゴのみ）
export function MobileHeader() {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b-2 border-amber-600/30 sticky top-0 z-50 md:hidden">
      <div className="flex items-center justify-center h-12 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Sword className="w-5 h-5 text-amber-400" />
          <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300">
            Habit RPG
          </span>
        </Link>
      </div>
    </header>
  );
}
