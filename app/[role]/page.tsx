import { DashboardShell } from '@/components/dashboard-shell';
import dashboardData from '@/mockdata/dashboard.json';

export function generateStaticParams() {
  return dashboardData.roles.map((role) => ({ role: role.id }));
}

export default async function RoleDashboard({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  return <DashboardShell initialRole={role} />;
}
