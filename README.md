# Kochapp

Eine Rezept-PWA im Netflix-Look: horizontal scrollbare Kategorien, Suche,
Favoriten (lokal gespeichert) und ein Einreichungs-Formular für fremde
Rezepte, die du vor Veröffentlichung freigibst.

## 1. Lokal einrichten

```bash
npm install
cp .env.example .env
```

## 2. Supabase-Projekt anlegen (kostenlos)

1. Gehe auf [supabase.com](https://supabase.com) und erstelle ein kostenloses Projekt.
2. Öffne **SQL Editor** → **New query**, füge den Inhalt von `supabase/schema.sql`
   ein und führe ihn aus. Das legt die Tabelle `recipes` an.
3. Gehe zu **Project Settings → API** und kopiere:
   - **Project URL** → in `.env` als `VITE_SUPABASE_URL`
   - **anon public key** → in `.env` als `VITE_SUPABASE_ANON_KEY`

## 3. Lokal testen

```bash
npm run dev
```

Öffne die angezeigte lokale Adresse. Unter `/einreichen` kannst du ein
Test-Rezept einreichen, unter `/admin` gibst du es frei.

## 4. Auf GitHub veröffentlichen

1. Erstelle ein neues **öffentliches** oder privates Repo auf GitHub, z.B. `kochapp`.
2. Falls dein Repo anders heißt als `kochapp`: passe `base` in `vite.config.js`
   und `start_url`/`scope` im Manifest sowie `basename` in `src/main.jsx` an
   (überall `/kochapp/` → `/dein-repo-name/`).
3. Push den Code:
   ```bash
   git init
   git add .
   git commit -m "Erste Version Kochapp"
   git branch -M main
   git remote add origin https://github.com/DEIN-USERNAME/kochapp.git
   git push -u origin main
   ```
4. Im Repo: **Settings → Pages → Source** auf "GitHub Actions" stellen.
5. Im Repo: **Settings → Secrets and variables → Actions → New repository secret**
   trage `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` ein (gleiche Werte wie
   in deiner `.env`). Der automatische Workflow (`.github/workflows/deploy.yml`)
   baut und deployed die App bei jedem Push auf `main`.
6. Nach ein paar Minuten ist die App unter
   `https://DEIN-USERNAME.github.io/kochapp/` erreichbar.

## Wie der Freigabe-Workflow funktioniert

- Jede Einreichung über `/einreichen` landet in der Datenbank mit `status: "pending"`.
- Nur Rezepte mit `status: "approved"` erscheinen auf der Startseite/Suche.
- Unter `/admin` siehst du alle offenen Einreichungen und kannst sie mit einem
  Klick freigeben oder ablehnen (löschen).

**Wichtig zur Sicherheit:** In dieser ersten Version ist `/admin` bewusst
*nicht* durch einen Login geschützt, wie du es gewünscht hast (erstmal ohne
Login testen). Das heißt: die URL `/admin` ist für jeden erreichbar, der sie
kennt bzw. errät. Für den privaten Gebrauch oder einen kleinen, vertrauten
Nutzerkreis ist das meist unkritisch – sobald mehr Leute mitmachen, sollten
wir einen echten Login für die Admin-Seite ergänzen (Supabase Auth macht das
recht einfach nachträglich).

## Bilder

Aktuell werden Bilder als URL eingetragen (z.B. Link zu einem hochgeladenen
Bild bei Imgur o.ä.). Wenn du willst, kann ich als nächsten Schritt einen
echten Bild-Upload über Supabase Storage einbauen, sodass Nutzer Bilder direkt
aus dem Formular hochladen können.

## App-Icons

Für die PWA fehlen noch `public/icon-192.png` und `public/icon-512.png` –
lege dort zwei quadratische Icons deiner App ab (z.B. mit einem Logo-Generator
oder Canva erstellt), dann lässt sich die App auf dem Smartphone installieren.
