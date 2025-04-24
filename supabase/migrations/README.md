# Database Migrations

Dit directory bevat SQL-migraties voor het Supabase project.

## Overzicht

We gebruiken één geconsolideerd SQL-bestand (`db_migrations.sql`) voor alle database wijzigingen. Dit maakt het gemakkelijker om:
- De volledige databasestructuur te begrijpen
- Wijzigingen bij te houden
- De database in te stellen op een nieuwe omgeving

## Wat bevat db_migrations.sql

Dit is het hoofdbestand dat alle databasestructuren, tabellen, en beveiligingsregels instelt. Het bevat:

1. **Profiles tabel setup**:
   - Tabeldefinitie met alle velden voor gebruikersprofielen
   - Row Level Security (RLS) policies
   - Autorisatieregels

2. **Triggers**:
   - Automatisch aanmaken van een profiel wanneer een gebruiker zich registreert
   - Initialisatie van basisvelden zoals naam (uit e-mailadres)

3. **Storage setup** (uitgecommentarieerd voor toekomstig gebruik):
   - Beveiligingsregels voor avatar-uploads
   - Bucket configuratie voor gebruikersafbeeldingen

## Hoe het bestand uit te voeren:

1. Log in op je [Supabase dashboard](https://app.supabase.com)
2. Selecteer je project
3. Ga naar de "SQL Editor" in het linkermenu
4. Kopieer en plak de inhoud van `db_migrations.sql`
5. Klik op "Run" om de SQL-statements uit te voeren

## Wijzigingen bijhouden

Wanneer je nieuwe databasevelden of -functionaliteiten toevoegt:

1. Update **altijd** alleen het `db_migrations.sql` bestand
2. Voeg IF NOT EXISTS toe aan CREATE statements om dubbele tabellen/kolommen te voorkomen
3. Gebruik DROP/CREATE voor functies en triggers om ze te vervangen
4. Voer het bijgewerkte script uit in de Supabase SQL Editor

## Belangrijke opmerkingen

- De huidige versie bevat een commented-out sectie voor avatar opslag - activeer dit wanneer je avatar-uploads implementeert
- Als je een bestaande tabel bijwerkt, gebruik dan ALTER TABLE statements
- Voer dit script uit op elke nieuwe Supabase omgeving (dev, staging, productie) die je gebruikt 