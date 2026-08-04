-- Führe dieses Skript im Supabase SQL-Editor aus (Project -> SQL Editor -> New query).

create table recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  category text,
  image_url text,
  ingredients jsonb not null default '[]',
  steps jsonb not null default '[]',
  status text not null default 'pending', -- 'pending' | 'approved'
  created_at timestamptz not null default now()
);

-- Row Level Security aktivieren
alter table recipes enable row level security;

-- Jeder darf freigegebene Rezepte lesen
create policy "Freigegebene Rezepte sind öffentlich lesbar"
  on recipes for select
  using (status = 'approved');

-- Jeder darf neue Rezepte einreichen (landen als 'pending')
create policy "Jeder darf Rezepte einreichen"
  on recipes for insert
  with check (status = 'pending');

-- WICHTIG: Für Admin-Freigabe (update/delete/pending lesen) nutzt diese erste
-- Version bewusst KEIN Login (siehe README). Das bedeutet: technisch versierte
-- Nutzer könnten die Admin-Funktionen theoretisch über die Browser-Konsole
-- aufrufen. Für den Start mit einer kleinen, vertrauten Nutzergruppe ist das
-- meist ok. Sobald es dir wichtig wird, ergänzen wir echten Admin-Login
-- (z.B. Supabase Auth) und schränken diese Policies auf einen bestimmten
-- Nutzer ein.
create policy "Ausstehende Rezepte sind lesbar (für Admin-Ansicht)"
  on recipes for select
  using (status = 'pending');

create policy "Rezepte können aktualisiert werden (Freigabe)"
  on recipes for update
  using (true);

create policy "Rezepte können gelöscht werden (Ablehnung)"
  on recipes for delete
  using (true);
