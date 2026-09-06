import { notFound } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { roleIdSchema, roleIds } from '@/domain/contracts';
import { isRoleSection, roleSections, sectionLabel } from '@/domain/navigation';

export function generateStaticParams() {
  return roleIds.flatMap((role) => roleSections[role].map((section) => ({ role, section })));
}

export default async function WorkspacePage({ params }: { params: Promise<{ role: string; section: string }> }) {
  const { role, section } = await params;
  const parsed = roleIdSchema.safeParse(role);
  if (!parsed.success || !isRoleSection(parsed.data, section)) notFound();
  return <DashboardShell initialRole={parsed.data} initialSection={sectionLabel(section)} />;
}
