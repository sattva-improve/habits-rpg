import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Header } from '../components/Header';
import { StatsSection } from '../components/StatsSection';
import { QuestsSection } from '../components/QuestsSection';
import { HabitCalendar } from '../components/HabitCalendar';
import { ShareModal } from '../components/ShareModal';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

export function Dashboard() {
  const [selectedHabitId, setSelectedHabitId] = useState<string | undefined>(undefined);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { habits, isHabitCompletedToday } = useUser();

  // 今日の達成数を計算
  const completedCount = habits.filter(h => isHabitCompletedToday(h.habitId)).length;
  const totalHabits = habits.length;

  return (
    <>
      <Header />
      
      {/* シェアボタン */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setIsShareModalOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg"
        >
          <Share2 className="w-4 h-4 mr-2" />
          シェア画像を作成
        </Button>
      </div>

      <StatsSection />
      <QuestsSection />
      <HabitCalendar 
        selectedHabitId={selectedHabitId}
        onHabitSelect={setSelectedHabitId}
      />

      {/* シェアモーダル */}
      <ShareModal
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        completedCount={completedCount}
        totalHabits={totalHabits}
      />
    </>
  );
}
