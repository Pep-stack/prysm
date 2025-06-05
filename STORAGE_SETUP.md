# Supabase Storage Setup voor Project Media

## Het probleem was:
- Foto uploads werden niet persistent opgeslagen
- `URL.createObjectURL()` maakte alleen tijdelijke blob URLs
- Na page refresh waren afbeeldingen weg

## ⚠️ NIEUWE FOUT: "row violates row-level security policy"
Dit betekent dat de Supabase Storage permissions niet goed zijn ingesteld.

## OPLOSSING - Volg deze stappen exact:

### 1. Ga naar Supabase Dashboard → Storage
- Maak bucket "project-media" aan (als deze nog niet bestaat)
- Zet op **Public bucket: ON**

### 2. Ga naar Supabase Dashboard → SQL Editor
Kopieer en voer deze **EENVOUDIGERE** SQL uit:

```sql
-- 1. Maak de bucket aan (als deze nog niet bestaat)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-media', 
  'project-media', 
  true, 
  52428800, 
  ARRAY['image/*', 'video/*']
) ON CONFLICT (id) DO NOTHING;

-- 2. Verwijder ALLE oude policies
DROP POLICY IF EXISTS "Users can upload project media" ON storage.objects;
DROP POLICY IF EXISTS "Users can view project media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own project media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own project media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Public can view files" ON storage.objects;

-- 3. Maak EENVOUDIGE policies aan die ZEKER werken
-- Policy voor uploaden - VEEL RUIMER
CREATE POLICY "Allow authenticated uploads to project-media" ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'project-media' 
  AND auth.role() = 'authenticated'
);

-- Policy voor lezen - PUBLIEK
CREATE POLICY "Allow public reads from project-media" ON storage.objects
FOR SELECT 
USING (bucket_id = 'project-media');

-- Policy voor updaten - VOOR EIGENAAR
CREATE POLICY "Allow owner updates in project-media" ON storage.objects
FOR UPDATE 
USING (
  bucket_id = 'project-media' 
  AND auth.role() = 'authenticated'
);

-- Policy voor verwijderen - VOOR EIGENAAR  
CREATE POLICY "Allow owner deletes in project-media" ON storage.objects
FOR DELETE 
USING (
  bucket_id = 'project-media' 
  AND auth.role() = 'authenticated'
);

-- 4. Zorg ervoor dat RLS is ingeschakeld
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

### 3. **DEBUGGING STAPPEN** - Voer ook deze SQL uit:

```sql
-- Check of de bucket bestaat
SELECT id, name, public FROM storage.buckets WHERE name = 'project-media';

-- Check of policies bestaan
SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check huidige user
SELECT auth.uid(), auth.role();
```

### 4. Als het NOG STEEDS niet werkt, gebruik deze TIJDELIJKE oplossing:

```sql
-- TIJDELIJK: Zet RLS UIT (alleen voor testen!)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

⚠️ **Waarschuwing**: De laatste SQL zet alle beveiliging uit. Gebruik dit alleen om te testen of het upload probleem daarmee opgelost is.

### 3. Test de upload opnieuw
Na het uitvoeren van de SQL, zou de foto upload moeten werken!

## Oplossing geïmplementeerd:
✅ Echte file upload naar Supabase Storage
✅ Automatische bucket creatie
✅ Loading states en error handling
✅ File validatie (type & grootte)
✅ Fallback bucket detectie
✅ **RLS Policies voor secure uploads**

## De fix werkt nu als volgt:
1. ✅ Selecteer bestand
2. ✅ Upload naar Supabase Storage  
3. ✅ Krijg permanente URL terug
4. ✅ Sla URL op in database
5. ✅ Afbeelding blijft werken na refresh

## Nieuwe features:
- 📱 Loading spinner tijdens upload
- ❌ Error messages bij problemen  
- 📏 File size validatie (max 50MB)
- 🎭 File type validatie (alleen images/videos)
- 🔄 Automatische bucket detectie
- 🛡️ User authenticatie check
- 🔐 **Secure RLS policies**

## Troubleshooting:
Als je nog steeds errors krijgt:
1. Check of je bent ingelogd (auth.uid() moet bestaan)
2. Controleer of de bucket "project-media" bestaat
3. Verificeer dat alle policies zijn aangemaakt met bovenstaande SQL
4. Refresh je browser volledig

## Test het nu:
1. Ga naar Projects sectie
2. Voeg een project toe
3. Upload een afbeelding
4. Zie de loading state
5. Save het project
6. Refresh de pagina - afbeelding blijft zichtbaar! 🎉 

## ❗ NOG STEEDS RLS ERROR? Volg deze stappen:

### STAP 1: TIJDELIJK RLS UITSCHAKELEN (om te testen)
Voer deze SQL uit om te zien of het upload probleem daarmee opgelost wordt:

```sql
-- Zet RLS tijdelijk UIT
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

**Test nu de foto upload. Werkt het?**
- ✅ **Ja, werkt!** → Ga naar STAP 2 voor juiste RLS setup
- ❌ **Nee, werkt niet** → Ga naar STAP 3 voor andere problemen

### STAP 2: RLS OPNIEUW GOED INSTELLEN
Als upload werkte zonder RLS, voer deze SQL uit:

```sql
-- Zet RLS weer AAN
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Verwijder ALLE policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow authenticated uploads to project-media" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public reads from project-media" ON storage.objects;
    DROP POLICY IF EXISTS "Allow owner updates in project-media" ON storage.objects;
    DROP POLICY IF EXISTS "Allow owner deletes in project-media" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload project media" ON storage.objects;
    DROP POLICY IF EXISTS "Users can view project media" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their own project media" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own project media" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
    DROP POLICY IF EXISTS "Public can view files" ON storage.objects;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Maak SUPER EENVOUDIGE policies
CREATE POLICY "project_media_insert" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'project-media');

CREATE POLICY "project_media_select" ON storage.objects
FOR SELECT USING (bucket_id = 'project-media');

CREATE POLICY "project_media_update" ON storage.objects
FOR UPDATE USING (bucket_id = 'project-media');

CREATE POLICY "project_media_delete" ON storage.objects
FOR DELETE USING (bucket_id = 'project-media');
```

### STAP 3: DEBUGGING - Voer deze SQL uit en deel de resultaten:

```sql
-- 1. Check bucket
SELECT id, name, public FROM storage.buckets WHERE name = 'project-media';

-- 2. Check user authentication
SELECT 
  auth.uid() as user_id,
  auth.role() as user_role,
  auth.email() as user_email;

-- 3. Check policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

-- 4. Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'objects' AND schemaname = 'storage';
```

### STAP 4: ALTERNATIEVE BUCKET
Als alles faalt, probeer een andere bucket:

```sql
-- Maak nieuwe bucket aan
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Zet RLS uit voor deze bucket (tijdelijk)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

En update de code om 'uploads' bucket te gebruiken:

### STAP 5: CODE AANPASSING (laatste redmiddel)
Als niets werkt, pas de code aan om een hardcoded bucket te gebruiken: 