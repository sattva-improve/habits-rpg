import { Header } from '../components/Header';
import { StatsSection } from '../components/StatsSection';
import { QuestsSection } from '../components/QuestsSection';

export function Dashboard() {
  return (
    <>
      <Header />
      <StatsSection />
      <QuestsSection />
    </>
  );
}
