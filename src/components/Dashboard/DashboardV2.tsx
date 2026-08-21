// src/components/Dashboard/DashboardV2.tsx

import MissionControl from "./mission-control/MissionControl";
import DashboardTutorial from "./DashboardTutorial";
import { PageContainer } from "@/components/ui";

export default function DashboardV2() {
  return (
    <>
      <PageContainer>
        <MissionControl />
      </PageContainer>

      <DashboardTutorial />
    </>
  );
}