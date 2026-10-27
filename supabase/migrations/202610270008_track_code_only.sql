-- The tracking code is now the only credential for the public tracker.
-- Customers who no longer have the email or phone on file can still check
-- their repair, so the RPC no longer takes a contact argument.
--
-- The sequential PW- number is deliberately not accepted here: it would let
-- anyone enumerate every ticket. Only the random public_code works.

drop function if exists public.track_ticket(text, text);

create or replace function public.track_ticket(p_code text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with matched as (
    select
      t.id,
      t.ticket_number,
      t.status,
      t.issue,
      t.created_at,
      t.updated_at,
      t.completed_at,
      c.full_name,
      d.category,
      d.brand,
      d.model
    from public.tickets t
    join public.customers c on c.id = t.customer_id
    join public.devices d on d.id = t.device_id
    where length(trim(coalesce(p_code, ''))) > 0
      and upper(t.public_code) = upper(trim(p_code))
    limit 1
  )
  select jsonb_build_object(
    'ticket_number', m.ticket_number,
    'status', m.status,
    'issue', m.issue,
    'created_at', m.created_at,
    'updated_at', m.updated_at,
    'completed_at', m.completed_at,
    'customer_name', split_part(m.full_name, ' ', 1),
    'device', jsonb_build_object(
      'category', m.category,
      'brand', m.brand,
      'model', m.model
    ),
    'events', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'status', e.status,
            'body', e.body,
            'created_at', e.created_at
          )
          order by e.created_at
        )
        from public.ticket_events e
        where e.ticket_id = m.id
          and e.is_customer_visible = true
      ),
      '[]'::jsonb
    )
  )
  from matched m;
$$;

revoke all on function public.track_ticket(text) from public;
grant execute on function public.track_ticket(text) to anon, authenticated;
