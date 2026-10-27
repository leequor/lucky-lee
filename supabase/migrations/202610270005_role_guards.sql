-- Role hardening:
-- 1. Only an owner can grant or revoke owner access.
-- 2. The last owner cannot be demoted.
-- 3. Inventory and invoice writes are manager/owner actions.
--    Technicians keep the security-definer RPCs for ticket parts and billing.

create or replace function public.guard_profile_roles()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_role text;
  owner_count integer;
begin
  -- Service-role maintenance (seed scripts, admin API) has no end-user JWT.
  if auth.uid() is null then
    return new;
  end if;

  select role into actor_role from public.profiles where id = auth.uid();

  if (old.role = 'superadmin' or new.role = 'superadmin')
     and actor_role is distinct from 'superadmin' then
    raise exception 'Only an owner can change owner roles';
  end if;

  if old.role = 'superadmin' and new.role is distinct from 'superadmin' then
    select count(*) into owner_count from public.profiles where role = 'superadmin';
    if owner_count <= 1 then
      raise exception 'The last owner cannot be demoted';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_guard_roles on public.profiles;
create trigger profiles_guard_roles
  before update of role on public.profiles
  for each row execute function public.guard_profile_roles();

-- Inventory: every staff member reads, managers and owners write.
drop policy if exists staff_all on public.parts;
drop policy if exists parts_select_staff on public.parts;
create policy parts_select_staff
  on public.parts
  for select
  to authenticated
  using (auth.uid() is not null);

drop policy if exists parts_write_admin on public.parts;
create policy parts_write_admin
  on public.parts
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Invoices: every staff member reads, managers and owners write.
-- create_ticket_invoice() and mark_invoice_paid() are security definer, so the
-- ticket workflow keeps working for technicians.
drop policy if exists staff_all on public.invoices;
drop policy if exists invoices_select_staff on public.invoices;
create policy invoices_select_staff
  on public.invoices
  for select
  to authenticated
  using (auth.uid() is not null);

drop policy if exists invoices_write_admin on public.invoices;
create policy invoices_write_admin
  on public.invoices
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
