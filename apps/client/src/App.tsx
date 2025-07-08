import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { NotFoundPage } from "@/components/common/NotFoundPage";

import DashboardPage from "@/pages/dashboard";
import LandingPage from "@/pages/LandingPage";

// Importações das páginas do dashboard
import { DashboardHome } from "@/pages/dashboard/DashboardHome";
import { ProjectsPage } from "@/pages/projects";
import { AllProjectsPage } from "@/pages/projects/all-project";
import { CreateProjectPage } from "@/pages/projects/create-project";
import { TeamsPage } from "@/pages/teams";
import { AllTeamsPage } from "@/pages/teams/all-teams";
import { MembersPage } from "@/pages/teams/members";
import { RolesPage } from "@/pages/teams/roles";
import { PermissionsPage } from "@/pages/teams/permissions";
import { SprintsPage } from "@/pages/sprints";
import { AllSprintsPage } from "@/pages/sprints/all-sprints";
import { CurrentSprintPage } from "@/pages/sprints/current";
import { SprintPlanningPage } from "@/pages/sprints/planning";
import { EpicsPage } from "@/pages/epics";
import { EpicBoardPage } from "@/pages/epics/board";
import { EpicTimelinePage } from "@/pages/epics/timeline";
import { UserStoriesPage } from "@/pages/user-stories";
import { BacklogPage } from "@/pages/user-stories/backlog";
import { UserStoriesKanbanPage } from "@/pages/user-stories/kanban";
import { TemplatesPage } from "@/pages/user-stories/templates";
import { TasksPage } from "@/pages/tasks";
import { AnalyticsPage } from "@/pages/analytics";
import { AnalyticsDashboardPage } from "@/pages/analytics/dashboard";
import { ReportsPage } from "@/pages/analytics/reports";
import { MetricsPage } from "@/pages/analytics/metrics";
import { ActivityPage } from "@/pages/activity";
import { SettingsPage } from "@/pages/settings";
import { GeneralSettingsPage } from "@/pages/settings/general";
import { TeamSettingsPage } from "@/pages/settings/team";
import { BillingSettingsPage } from "@/pages/settings/billing";
import { LimitsSettingsPage } from "@/pages/settings/limits";
import { SupportPage } from "@/pages/support";
import { FeedbackPage } from "@/pages/feedback";
import { AdminPage } from "@/pages/admin";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />

            {/* Projects Routes */}
            <Route path="projects" element={<ProjectsPage />}>
              <Route index element={<AllProjectsPage />} />
              <Route path="all" element={<AllProjectsPage />} />
              <Route path="create" element={<CreateProjectPage />} />
            </Route>

            {/* Teams Routes */}
            <Route path="teams" element={<TeamsPage />}>
              <Route index element={<AllTeamsPage />} />
              <Route path="all" element={<AllTeamsPage />} />
              <Route path="members" element={<MembersPage />} />
              <Route path="roles" element={<RolesPage />} />
              <Route path="permissions" element={<PermissionsPage />} />
            </Route>

            {/* Sprints Routes */}
            <Route path="sprints" element={<SprintsPage />}>
              <Route index element={<AllSprintsPage />} />
              <Route path="all" element={<AllSprintsPage />} />
              <Route path="current" element={<CurrentSprintPage />} />
              <Route path="planning" element={<SprintPlanningPage />} />
            </Route>

            {/* Epics Routes */}
            <Route path="epics" element={<EpicsPage />}>
              <Route path="board" element={<EpicBoardPage />} />
              <Route path="timeline" element={<EpicTimelinePage />} />
            </Route>

            {/* User Stories Routes */}
            <Route path="user-stories" element={<UserStoriesPage />}>
              <Route path="backlog" element={<BacklogPage />} />
              <Route path="kanban" element={<UserStoriesKanbanPage />} />
              <Route path="templates" element={<TemplatesPage />} />
            </Route>

            {/* Tasks Routes */}
            <Route path="tasks" element={<TasksPage />} />

            {/* Analytics Routes */}
            <Route path="analytics" element={<AnalyticsPage />}>
              <Route path="dashboard" element={<AnalyticsDashboardPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="metrics" element={<MetricsPage />} />
            </Route>

            {/* Activity Routes */}
            <Route path="activity" element={<ActivityPage />} />

            {/* Settings Routes */}
            <Route path="settings" element={<SettingsPage />}>
              <Route path="general" element={<GeneralSettingsPage />} />
              <Route path="team" element={<TeamSettingsPage />} />
              <Route path="billing" element={<BillingSettingsPage />} />
              <Route path="limits" element={<LimitsSettingsPage />} />
            </Route>

            {/* Secondary Routes */}
            <Route path="support" element={<SupportPage />} />
            <Route path="feedback" element={<FeedbackPage />} />

            {/* Admin */}
            <Route path="admin" element={<AdminPage />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
