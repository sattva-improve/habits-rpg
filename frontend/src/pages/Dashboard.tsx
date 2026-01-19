import { useState } from 'react';
import { Header } from '../components/Header';
import { StatsSection } from '../components/StatsSection';
import { QuestsSection } from '../components/QuestsSection';
import { HabitCalendar } from '../components/HabitCalendar';

export function Dashboard() {
  const [selectedHabitId, setSelectedHabitId] = useState<string | undefined>(undefined);

  return (
    <>
      <Header />
      <StatsSection />
      <QuestsSection />
      <HabitCalendar 
        selectedHabitId={selectedHabitId}
        onHabitSelect={setSelectedHabitId}
      />
    </>
  );
}
