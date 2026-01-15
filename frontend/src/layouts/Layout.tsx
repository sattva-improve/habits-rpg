import { Navigation, MobileBottomNavigation, MobileHeader } from '@/components/Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* デスクトップ用トップナビゲーション */}
      <Navigation />
      {/* モバイル用ヘッダー */}
      <MobileHeader />
      
      {/* メインコンテンツ - モバイルではボトムナビの分だけ下にパディング */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
        {children}
      </div>
      
      {/* モバイル用ボトムナビゲーション */}
      <MobileBottomNavigation />
    </div>
  );
}
