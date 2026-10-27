-- Billing RPCs are security definer, so RLS alone does not protect them.
-- Guard invoice writes at the table so a technician cannot call
-- create_ticket_invoice() or mark_invoice_paid() directly.
-- Service-role maintenance has no end-user JWT and bypasses the check.

create or replace function public.guard_invoice_writes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return coalesce(new, old);
  end if;

  if not public.is_admin() then
    raise exception 'Managers and owners manage invoices';
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists invoices_guard_writes on public.invoices;
create trigger invoices_guard_writes
  before insert or update or delete on public.invoices
  for each row execute function public.guard_invoice_writes();
