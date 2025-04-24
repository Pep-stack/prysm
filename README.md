# Prysm

**Prysm** is een modern carrièreplatform dat digitale visitekaartjes combineert met profielpagina’s, netwerktools en slimme routing. Het is speciaal ontworpen voor professionals die zich willen onderscheiden met een eigen online presence, zoals een "Linktree for career-driven people."

---

## 🌍 Visie & Bedrijfsplan

### 🔹 Doelgroep
Professionals, young talents, freelancers, coaches, recruiters, ondernemers en carrièregerichte creatieven.

### 🔹 Probleem
Er is geen goede manier om je online professioneel te profileren op een visueel aantrekkelijke, snelle en minimalistische manier — zonder afhankelijk te zijn van logge sociale netwerken of verouderde portfolio-tools.

### 🔹 Oplossing
Prysm biedt gebruikers een eigen online kaart/profielpagina die te delen is als digitale visitekaart. Alles is slim opgebouwd en te personaliseren via:
- 🔗 Deelbare URL's
- 📇 Profiel + CV info
- 🎨 Custom styling en templates
- 📊 Analytics (later fase)
- 🧩 API-koppelingen met o.a. LinkedIn, Calendly en Notion

### 🔹 Verdienmodel
- **Freemium**: Basis gratis profiel
- **Premium**: Extra functionaliteiten (custom domains, analytics, meerdere kaarten)
- **B2B Whitelabel**: Voor teams, recruiters en events

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Auth & Database**: Supabase
- **Editor**: Cursor / VS Code

---

## 🎨 Stylingregels

Om een vertrouwd, professioneel en consistent gevoel te creëren gebruiken we:

### 🔸 Kleurenpalet (wit, grijs, blauw)
| Naam              | Hex       | Gebruik                                 |
|-------------------|-----------|-----------------------------------------|
| **Wit**           | `#ffffff` | Basisachtergrond, tekstvelden           |
| **Lichtgrijs**    | `#f5f5f7` | Sectieachtergronden                     |
| **Middengrijs**   | `#d1d5db` | Borders, UI-elementen                   |
| **Donkergrijs**   | `#374151` | Subtiele tekst                          |
| **Primair blauw** | `#2563eb` | Knoppen, CTA’s                          |
| **Licht blauw**   | `#60a5fa` | Hoverstates, iconen, accenten           |
| **Donkerblauw**   | `#1e3a8a` | Contrast, donkere thema’s, headings     |

> ✨ Deze kleuren worden ingesteld via `tailwind.config.ts` onder `theme.extend.colors.brand`.

### 🔸 Typography
- Font: `font-sans` (Inter of SF Pro)
- Titels: `text-2xl`, `font-semibold`
- Body: `text-base`, `leading-relaxed`
- Gebruik voldoende witruimte

### 🔸 Componentstructuur
- Reusable UI: `Button.tsx`, `Card.tsx`, `Input.tsx`
- Componenten staan in `/components`
- Utility-first Tailwind styling

### 🔸 Layout
- Responsive, mobile-first
- Grid-based dashboard (12-koloms)
- Sticky navbar en optionele sidebar

---

## 🧠 Projectstructuur

Zie `src/` voor mappenstructuur en routing. Iedere route wordt beheerd via de `app/` folder van Next.js App Router.

---

## 📦 Installatie

```bash
npm install
npm run dev
