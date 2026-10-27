-- Keep generated ticket and invoice numbers ahead of seeded/manual rows.
-- The seed and the repair actions both use these sequences.

create or replace function public.sync_repair_sequences()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  max_ticket bigint;
  max_invoice bigint;
begin
  select coalesce(max(regexp_replace(ticket_number, '\D', '', 'g')::bigint), 1040)
  into max_ticket
  from public.tickets
  where ticket_number ~ '^PW-[0-9]+$';

  select coalesce(max(regexp_replace(invoice_number, '\D', '', 'g')::bigint), 2400)
  into max_invoice
  from public.invoices
  where invoice_number ~ '^INV-[0-9]+$';

  perform setval('public.ticket_number_seq', max_ticket, true);
  perform setval('public.invoice_number_seq', max_invoice, true);
end;
$$;

revoke all on function public.sync_repair_sequences() from public;
grant execute on function public.sync_repair_sequences() to authenticated, service_role;

select public.sync_repair_sequences();

create or replace function public.create_ticket_invoice(p_ticket_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  ticket_record record;
  parts_total integer;
  subtotal integer;
  tax integer;
  total integer;
  invoice_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Staff authentication required';
  end if;

  select id, labour_cents
  into ticket_record
  from public.tickets
  where id = p_ticket_id;

  if not found then
    raise exception 'Ticket not found';
  end if;

  select coalesce(sum(quantity * unit_price_cents), 0)::integer
  into parts_total
  from public.ticket_parts
  where ticket_id = p_ticket_id;

  subtotal := ticket_record.labour_cents + parts_total;
  tax := round(subtotal * 0.12)::integer;
  total := subtotal + tax;

  insert into public.invoices (
    ticket_id,
    invoice_number,
    labour_cents,
    parts_cents,
    subtotal_cents,
    tax_cents,
    total_cents,
    status
  )
  values (
    p_ticket_id,
    'INV-' || nextval('public.invoice_number_seq')::text,
    ticket_record.labour_cents,
    parts_total,
    subtotal,
    tax,
    total,
    'sent'
  )
  on conflict (ticket_id) do update set
    labour_cents = excluded.labour_cents,
    parts_cents = excluded.parts_cents,
    subtotal_cents = excluded.subtotal_cents,
    tax_cents = excluded.tax_cents,
    total_cents = excluded.total_cents,
    status = case
      when public.invoices.status = 'paid' then 'paid'::public.invoice_status
      else 'sent'::public.invoice_status
    end
  returning id into invoice_id;

  update public.tickets
  set final_cents = total,
      status = case when status = 'picked_up' then status else 'ready' end,
      completed_at = coalesce(completed_at, now())
  where id = p_ticket_id;

  insert into public.ticket_events (ticket_id, actor_id, kind, status, body, is_customer_visible)
  values (
    p_ticket_id,
    auth.uid(),
    'invoice',
    null,
    'Invoice ready — $' || to_char(total / 100.0, 'FM999,999.00'),
    true
  );

  return invoice_id;
end;
$$;

revoke all on function public.create_ticket_invoice(uuid) from public;
grant execute on function public.create_ticket_invoice(uuid) to authenticated;
