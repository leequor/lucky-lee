-- Patchwork repair-shop schema.
-- Run with `supabase db push` or paste into the Supabase SQL editor.

do $$
begin
  create type public.ticket_status as enum (
    'intake',
    'diagnosing',
    'waiting_parts',
    'in_repair',
    'ready',
    'picked_up',
    'cancelled'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.ticket_priority as enum ('low', 'normal', 'high', 'urgent');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.invoice_status as enum ('draft', 'sent', 'paid', 'void');
exception
  when duplicate_object then null;
end
$$;

create sequence if not exists public.ticket_number_seq start with 1041;
create sequence if not exists public.invoice_number_seq start with 2401;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text not null,
  company text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  category text not null default 'phone',
  brand text not null,
  model text not null,
  serial text,
  color text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  public_code text not null unique,
  customer_id uuid not null references public.customers (id) on delete restrict,
  device_id uuid not null references public.devices (id) on delete restrict,
  status public.ticket_status not null default 'intake',
  priority public.ticket_priority not null default 'normal',
  issue text not null,
  diagnosis text,
  assigned_to uuid references public.profiles (id) on delete set null,
  labour_cents integer not null default 0 check (labour_cents >= 0),
  estimate_cents integer not null default 0 check (estimate_cents >= 0),
  final_cents integer check (final_cents >= 0),
  due_at date,
  completed_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ticket_events (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  kind text not null default 'note',
  status public.ticket_status,
  body text,
  is_customer_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.parts (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  category text not null default 'general',
  stock integer not null default 0 check (stock >= 0),
  reorder_level integer not null default 2 check (reorder_level >= 0),
  cost_cents integer not null default 0 check (cost_cents >= 0),
  price_cents integer not null default 0 check (price_cents >= 0),
  supplier text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ticket_parts (
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  part_id uuid not null references public.parts (id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_cents integer not null default 0 check (unit_price_cents >= 0),
  created_at timestamptz not null default now(),
  primary key (ticket_id, part_id)
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null unique references public.tickets (id) on delete cascade,
  invoice_number text not null unique,
  labour_cents integer not null default 0 check (labour_cents >= 0),
  parts_cents integer not null default 0 check (parts_cents >= 0),
  subtotal_cents integer not null default 0 check (subtotal_cents >= 0),
  tax_cents integer not null default 0 check (tax_cents >= 0),
  total_cents integer not null default 0 check (total_cents >= 0),
  status public.invoice_status not null default 'sent',
  issued_at timestamptz not null default now(),
  paid_at timestamptz,
  notes text
);

create index if not exists customers_phone_idx on public.customers (phone);
create index if not exists customers_email_idx on public.customers (lower(email));
create index if not exists devices_customer_idx on public.devices (customer_id);
create index if not exists tickets_customer_idx on public.tickets (customer_id);
create index if not exists tickets_device_idx on public.tickets (device_id);
create index if not exists tickets_status_idx on public.tickets (status);
create index if not exists tickets_assigned_idx on public.tickets (assigned_to);
create index if not exists tickets_created_idx on public.tickets (created_at desc);
create index if not exists ticket_events_ticket_idx on public.ticket_events (ticket_id, created_at desc);
create index if not exists parts_stock_idx on public.parts (stock, reorder_level);
create index if not exists invoices_status_idx on public.invoices (status);

create or replace function public.set_ticket_defaults()
returns trigger
language plpgsql
as $$
begin
  if new.ticket_number is null or trim(new.ticket_number) = '' then
    new.ticket_number := 'PW-' || nextval('public.ticket_number_seq')::text;
  end if;

  if new.public_code is null or trim(new.public_code) = '' then
    new.public_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
  end if;

  return new;
end;
$$;

drop trigger if exists tickets_set_defaults on public.tickets;
create trigger tickets_set_defaults
  before insert on public.tickets
  for each row
  execute function public.set_ticket_defaults();

create or replace function public.set_invoice_defaults()
returns trigger
language plpgsql
as $$
begin
  if new.invoice_number is null or trim(new.invoice_number) = '' then
    new.invoice_number := 'INV-' || nextval('public.invoice_number_seq')::text;
  end if;

  return new;
end;
$$;

drop trigger if exists invoices_set_defaults on public.invoices;
create trigger invoices_set_defaults
  before insert on public.invoices
  for each row
  execute function public.set_invoice_defaults();

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

drop trigger if exists devices_set_updated_at on public.devices;
create trigger devices_set_updated_at
  before update on public.devices
  for each row execute function public.set_updated_at();

drop trigger if exists tickets_set_updated_at on public.tickets;
create trigger tickets_set_updated_at
  before update on public.tickets
  for each row execute function public.set_updated_at();

drop trigger if exists parts_set_updated_at on public.parts;
create trigger parts_set_updated_at
  before update on public.parts
  for each row execute function public.set_updated_at();

-- Every staff member can work the shop. Invite-only staff accounts are managed
-- from the team page; public customer tracking goes through track_ticket().
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'customers',
    'devices',
    'tickets',
    'ticket_events',
    'parts',
    'ticket_parts',
    'invoices'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on table public.%I from anon', table_name);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', table_name);
    execute format('drop policy if exists staff_all on public.%I', table_name);
    execute format(
      'create policy staff_all on public.%I for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null)',
      table_name
    );
  end loop;
end
$$;

drop policy if exists profiles_select_staff on public.profiles;
create policy profiles_select_staff
  on public.profiles
  for select
  to authenticated
  using (auth.uid() is not null);

create or replace function public.add_ticket_part(
  p_ticket_id uuid,
  p_part_id uuid,
  p_quantity integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  part_record record;
begin
  if auth.uid() is null then
    raise exception 'Staff authentication required';
  end if;

  if p_quantity is null or p_quantity < 1 then
    raise exception 'Quantity must be at least 1';
  end if;

  select id, name, stock, price_cents
  into part_record
  from public.parts
  where id = p_part_id
  for update;

  if not found then
    raise exception 'Part not found';
  end if;

  if part_record.stock < p_quantity then
    raise exception 'Only % of % left in stock', part_record.stock, part_record.name;
  end if;

  insert into public.ticket_parts (ticket_id, part_id, quantity, unit_price_cents)
  values (p_ticket_id, p_part_id, p_quantity, part_record.price_cents)
  on conflict (ticket_id, part_id)
  do update set quantity = public.ticket_parts.quantity + excluded.quantity;

  update public.parts
  set stock = stock - p_quantity
  where id = p_part_id;

  insert into public.ticket_events (ticket_id, actor_id, kind, body, is_customer_visible)
  values (
    p_ticket_id,
    auth.uid(),
    'part',
    part_record.name || ' × ' || p_quantity || ' added to the repair',
    false
  );
end;
$$;

revoke all on function public.add_ticket_part(uuid, uuid, integer) from public;
grant execute on function public.add_ticket_part(uuid, uuid, integer) to authenticated;

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
    status = case when public.invoices.status = 'paid' then 'paid' else 'sent' end
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
    'Invoice ready — ' || total || ' cents',
    true
  );

  return invoice_id;
end;
$$;

revoke all on function public.create_ticket_invoice(uuid) from public;
grant execute on function public.create_ticket_invoice(uuid) to authenticated;

create or replace function public.mark_invoice_paid(p_invoice_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  invoice_record record;
begin
  if auth.uid() is null then
    raise exception 'Staff authentication required';
  end if;

  select id, ticket_id
  into invoice_record
  from public.invoices
  where id = p_invoice_id;

  if not found then
    raise exception 'Invoice not found';
  end if;

  update public.invoices
  set status = 'paid', paid_at = now()
  where id = p_invoice_id;

  update public.tickets
  set status = 'picked_up', completed_at = coalesce(completed_at, now())
  where id = invoice_record.ticket_id;

  insert into public.ticket_events (ticket_id, actor_id, kind, status, body, is_customer_visible)
  values (
    invoice_record.ticket_id,
    auth.uid(),
    'payment',
    'picked_up',
    'Payment received. Device collected.',
    true
  );
end;
$$;

revoke all on function public.mark_invoice_paid(uuid) from public;
grant execute on function public.mark_invoice_paid(uuid) to authenticated;

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
