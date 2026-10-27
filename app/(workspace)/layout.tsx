import { requireStaff } from "@/lib/repair/session";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export const dynamic = "force-dynamic";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireStaff();

  return <WorkspaceShell user={user}>{children}</WorkspaceShell>;
}
