-- Require a non-empty contact value for public tracking. Without this, a blank
-- contact could match a customer row with no email stored.

create or replace function public.track_ticket(p_code text, p_contact text)
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
      c.email,
      c.phone,
      d.category,
      d.brand,
      d.model
    from public.tickets t
    join public.customers c on c.id = t.customer_id
    join public.devices d on d.id = t.device_id
    where upper(t.public_code) = upper(trim(p_code))
      and length(trim(coalesce(p_contact, ''))) > 0
      and (
        lower(coalesce(c.email, '')) = lower(trim(p_contact))
        or regexp_replace(coalesce(c.phone, ''), '\D', '', 'g')
           = regexp_replace(coalesce(p_contact, ''), '\D', '', 'g')
      )
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

revoke all on function public.track_ticket(text, text) from public;
grant execute on function public.track_ticket(text, text) to anon, authenticated;
