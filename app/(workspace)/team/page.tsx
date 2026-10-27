import type { Metadata } from "next";
import { inviteStaffAction, updateRoleAction } from "@/app/actions/repair";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { SelectField } from "@/components/workspace/form-controls";
import {
  DataBar,
  Feedback,
  PageHeader,
  Panel,
  PanelHeader,
} from "@/components/workspace/ui";
import { ROLE_LABELS } from "@/lib/repair/format";
import { getDashboardData, getStaffProfiles } from "@/lib/repair/queries";
import { getStaff } from "@/lib/repair/session";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  const params = await searchParams;
  const [staff, profiles, dashboard] = await Promise.all([
    getStaff(),
    getStaffProfiles(),
    getDashboardData(),
  ]);
  const canManage = staff?.role !== "user";
  const isOwner = staff?.role === "superadmin";
  const load = new Map(dashboard.teamLoad.map((member) => [member.id, member]));

  return (
    <div>
      <PageHeader
        title="Team"
        description="Who is on the bench, what they own, and who can manage the shop."
      />
      <Feedback notice={params.notice} error={params.error} />

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel className="reveal overflow-hidden">
          <PanelHeader title="Staff" detail={`${profiles.length} accounts · ${dashboard.openCount} open jobs`} />
          <div className="divide-y divide-line">
            {profiles.map((member) => {
              const memberLoad = load.get(member.id);
              const canEditMember = canManage && (isOwner || member.role !== "superadmin");

              return (
                <div key={member.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1.2fr_0.7fr_0.8fr_auto] sm:items-center">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-wash text-[11px] font-semibold text-accent">
                      {initials(member.full_name || member.email)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-ink">
                        {member.full_name || member.email}
                        {member.id === staff?.id ? <span className="ml-2 text-[10px] text-muted">you</span> : null}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-muted">{member.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted">{ROLE_LABELS[member.role]}</p>
                    <div className="mt-1.5 max-w-[120px]">
                      <DataBar value={memberLoad?.open ?? 0} max={Math.max(1, dashboard.openCount)} />
                    </div>
                  </div>
                  <div className="text-[11px] text-muted">
                    <span className="figure text-[12px] text-ink">{memberLoad?.open ?? 0}</span> open ·{" "}
                    <span className="figure text-[12px] text-ink">{memberLoad?.active ?? 0}</span> in repair
                  </div>
                  <div>
                    {canEditMember ? (
                      <form action={updateRoleAction} className="flex items-center gap-2">
                        <input type="hidden" name="profile_id" value={member.id} />
                        <label className="sr-only" htmlFor={`role-${member.id}`}>
                          Role for {member.full_name || member.email}
                        </label>
                        <select
                          id={`role-${member.id}`}
                          name="role"
                          defaultValue={member.role}
                          className="h-8 rounded-lg border border-line bg-paper px-2 text-[11px] text-ink outline-none focus:border-accent"
                        >
                          {isOwner ? <option value="superadmin">Owner</option> : null}
                          <option value="admin">Manager</option>
                          <option value="user">Technician</option>
                        </select>
                        <button
                          type="submit"
                          className="h-8 rounded-full border border-line px-2.5 text-[10px] text-muted hover:text-ink"
                        >
                          Save
                        </button>
                      </form>
                    ) : (
                      <span className="text-[10px] text-muted">
                        {member.role === "superadmin" ? "Owner-managed" : "Manager-managed"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <div className="space-y-4">
          {canManage ? (
            <Panel className="reveal reveal-delay-1 p-5">
              <h2 className="text-[14px] font-medium text-ink">Add staff</h2>
              <p className="mt-1 text-[11px] leading-5 text-muted">
                Creates a confirmed Supabase account. Share the temporary password privately; the
                person can change it from “Forgot password”.
              </p>
              <form action={inviteStaffAction} className="mt-4 space-y-3">
                <FormField id="full_name" name="full_name" label="Name" placeholder="Rian Sabrido" required />
                <FormField id="email" name="email" type="email" label="Email" placeholder="tech@patchwork.test" required />
                <FormField id="password" name="password" type="text" label="Temporary password" placeholder="At least 8 characters" required />
                <SelectField id="role" name="role" label="Role" defaultValue="user">
                  <option value="user">Technician</option>
                  <option value="admin">Manager</option>
                  {isOwner ? <option value="superadmin">Owner</option> : null}
                </SelectField>
                <SubmitButton pendingText="Creating account...">Create staff account</SubmitButton>
              </form>
            </Panel>
          ) : (
            <Panel className="reveal reveal-delay-1 p-5">
              <h2 className="text-[14px] font-medium text-ink">Access</h2>
              <p className="mt-2 text-[12px] leading-5 text-muted">
                Your account is a technician. Ask an owner or manager to change roles or add new
                staff.
              </p>
            </Panel>
          )}

          <Panel className="reveal reveal-delay-2 p-5">
            <h2 className="text-[14px] font-medium text-ink">Role model</h2>
            <ul className="mt-3 space-y-3 text-[11px] leading-5 text-muted">
              <li>
                <span className="text-ink">Owner</span> — full access, staff, and owner roles.
              </li>
              <li>
                <span className="text-ink">Manager</span> — tickets, customers, inventory, invoices, and staff roles.
              </li>
              <li>
                <span className="text-ink">Technician</span> — day-to-day tickets and customer work.
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
