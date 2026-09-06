import { notFound, redirect } from 'next/navigation';
import { roleIdSchema, roleIds } from '@/domain/contracts';

export function generateStaticParams() {
  return roleIds.map((role) => ({ role }));
}

export default async function RoleDashboard({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const parsed = roleIdSchema.safeParse(role);
  if (!parsed.success) notFound();
  redirect(`/${parsed.data}/overview`);
}
