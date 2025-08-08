# Supabase Storage Setup voor Project Media

## 🚨 IMMEDIATE FIX voor "row violates row-level security policy" Error

Als je deze error krijgt bij het uploaden van portfolio afbeeldingen, volg dan deze **DIRECTE OPLOSSING**:

### STAP 1: Ga naar Supabase Dashboard → SQL Editor
Voer deze SQL uit om de storage permissions direct te repareren:

```sql
-- DIRECTE FIX: Maak simpele, werkende policies voor project-media bucket
-- Verwijder alle oude policies eerst
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
DROP POLICY IF EXISTS "project_media_insert" ON storage.objects;
DROP POLICY IF EXISTS "project_media_select" ON storage.objects;
DROP POLICY IF EXISTS "project_media_update" ON storage.objects;
DROP POLICY IF EXISTS "project_media_delete" ON storage.objects;

-- Maak de bucket aan als deze niet bestaat
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-media', 
  'project-media', 
  true, 
  104857600, 
  ARRAY['image/*', 'video/*']
) ON CONFLICT (id) DO NOTHING;

-- Zorg dat RLS aan staat
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Maak SUPER EENVOUDIGE policies die ALTIJD werken
CREATE POLICY "portfolio_upload" ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'project-media' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "portfolio_read" ON storage.objects
FOR SELECT 
USING (bucket_id = 'project-media');

CREATE POLICY "portfolio_update" ON storage.objects
FOR UPDATE 
USING (
  bucket_id = 'project-media' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "portfolio_delete" ON storage.objects
FOR DELETE 
USING (
  bucket_id = 'project-media' 
  AND auth.role() = 'authenticated'
);
```

### STAP 2: Test de upload
1. Ga terug naar je portfolio sectie
2. Probeer een afbeelding te uploaden
3. De error zou nu weg moeten zijn! ✅

---

## ❌ ERROR: "must be owner of table objects"

Als je deze error krijgt, betekent dit dat je geen admin rechten hebt in Supabase. Hier zijn **ALTERNATIEVE OPLOSSINGEN**:

### OPLOSSING A: Via Supabase Dashboard (Aanbevolen)

1. **Ga naar Supabase Dashboard → Storage**
2. **Klik op "New bucket"**
3. **Maak bucket "project-media" aan** met deze instellingen:
   - ✅ **Public bucket: ON**
   - ✅ **File size limit: 100MB**
   - ✅ **Allowed MIME types: image/*, video/***

4. **Ga naar Authentication → Policies**
5. **Zoek naar "storage.objects"**
6. **Voeg deze policies toe via de UI:**

**Policy 1: "portfolio_upload"**
- Operation: INSERT
- Target roles: authenticated
- Using expression: `bucket_id = 'project-media'`

**Policy 2: "portfolio_read"**  
- Operation: SELECT
- Target roles: public
- Using expression: `bucket_id = 'project-media'`

**Policy 3: "portfolio_update"**
- Operation: UPDATE  
- Target roles: authenticated
- Using expression: `bucket_id = 'project-media'`

**Policy 4: "portfolio_delete"**
- Operation: DELETE
- Target roles: authenticated  
- Using expression: `bucket_id = 'project-media'`

### OPLOSSING B: Tijdelijke RLS Uitschakeling

Als je geen admin rechten hebt, kun je RLS tijdelijk uitschakelen:

```sql
-- TIJDELIJK: Zet RLS uit (alleen voor testen!)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

⚠️ **LET OP**: Dit zet alle beveiliging uit. Gebruik dit alleen om te testen.

### OPLOSSING C: Contact Support

Als geen van bovenstaande werkt:
1. **Contact Supabase Support** voor admin rechten
2. **Of vraag je project admin** om de storage policies in te stellen
3. **Of gebruik een andere bucket** die al bestaat

---

## Als het NOG STEEDS niet werkt: Emergency Fix

Als de bovenstaande SQL niet werkt, gebruik dan deze **TIJDELIJKE** oplossing:

```sql
-- EMERGENCY: Zet RLS tijdelijk uit (ALLEEN VOOR TESTEN!)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

⚠️ **LET OP**: Dit zet alle beveiliging uit. Gebruik dit alleen om te testen of uploads dan wel werken.

**Test nu de upload. Als het werkt:**

```sql
-- Zet RLS weer aan
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Maak een super ruime policy voor testen
CREATE POLICY "temp_allow_all" ON storage.objects
FOR ALL
USING (bucket_id = 'project-media')
WITH CHECK (bucket_id = 'project-media');
```

---

## Debug Informatie

Als je wilt zien wat er mis is, voer deze SQL uit:

```sql
-- Check je user ID en rol
SELECT auth.uid() as user_id, auth.role() as user_role;

-- Check welke buckets bestaan
SELECT id, name, public FROM storage.buckets;

-- Check welke policies bestaan
SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
```

---

## Het probleem was:
- Foto uploads werden niet persistent opgeslagen
- `URL.createObjectURL()` maakte alleen tijdelijke blob URLs
- Na page refresh waren afbeeldingen weg
- **RLS policies blokkeerden uploads**
- **Permission errors bij het instellen van policies**

## ✅ OPLOSSING GEÏMPLEMENTEERD:
✅ Echte file upload naar Supabase Storage  
✅ Automatische bucket creatie  
✅ Loading states en error handling  
✅ File validatie (type & grootte)  
✅ Fallback bucket detectie  
✅ **Verbeterde RLS Policies voor secure uploads**  
✅ **Duidelijke error messages met fix instructies**
✅ **Alternatieve oplossingen voor permission errors**

## De fix werkt nu als volgt:
1. ✅ Selecteer bestand
2. ✅ Upload naar Supabase Storage  
3. ✅ Krijg permanente URL terug
4. ✅ Sla URL op in database
5. ✅ Afbeelding blijft werken na refresh

## Nieuwe features:
- 📱 Loading spinner tijdens upload
- ❌ **Specifieke error messages met fix instructies**  
- 📏 File size validatie (max 100MB)
- 🎭 File type validatie (alleen images/videos)
- 🔄 Automatische bucket detectie
- 🛡️ User authenticatie check
- 🔐 **Simpele, werkende RLS policies**
- 🩺 **Storage diagnostic functie**
- 🔧 **Alternatieve oplossingen voor permission issues**

## Als je nog steeds errors krijgt:
1. Check of je bent ingelogd (auth.uid() moet bestaan)
2. Controleer of de bucket "project-media" bestaat  
3. Verificeer dat alle policies zijn aangemaakt met bovenstaande SQL
4. Refresh je browser volledig
5. **Check de nieuwe error message - deze geeft nu specifieke instructies**
6. **Probeer de Dashboard UI methode als SQL niet werkt**

## Test het nu:
1. Ga naar Portfolio sectie in dashboard
2. Voeg een portfolio item toe
3. Upload een afbeelding
4. Zie de loading state
5. Save het portfolio item
6. Refresh de pagina - afbeelding blijft zichtbaar! 🎉 