# Prysma - Professional Profile Builder

A modern, customizable professional profile builder built with Next.js and Supabase.

## 🚀 Recent Simplifications

### Code Structure Improvements
- **Consolidated Hooks**: Merged `useCardLayout.js` and `useCardLayoutWithSocialBar.js` into a single comprehensive hook
- **Simplified Section Options**: Reduced `sectionOptions.js` from 156 lines to a more maintainable structure
- **Consolidated Social Media Components**: Replaced 10+ individual social media components with one unified `SocialMediaSectionContent.js`
- **Removed Duplicate Directories**: Cleaned up unused `src/app/` directory
- **Database Schema Optimization**: Added new migration for simplified JSONB-based social media storage

### File Structure
```
prysm/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── p/                # Public profile pages
│   └── auth/             # Authentication pages
├── src/
│   ├── components/        # React components
│   │   ├── card/         # Card rendering system
│   │   ├── dashboard/    # Dashboard components
│   │   └── shared/       # Shared components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and configurations
│   └── constants/        # App constants
├── supabase/             # Database migrations
└── public/               # Static assets
```

## 🛠️ Key Features

- **Drag & Drop Interface**: Intuitive section management
- **Social Media Integration**: Unified social media component system
- **Customizable Design**: Real-time design customization
- **Responsive Design**: Mobile-first approach
- **Authentication**: Supabase Auth integration

## 🎯 Core Components

### Card System
- `PrysmaCard.js` - Main card component
- `CardSectionRenderer.js` - Unified section rendering
- `SocialMediaSectionContent.js` - Consolidated social media handling

### Dashboard
- `DashboardPage` - Main dashboard interface
- `Sidebar.js` - Navigation component
- `DesignToolbar.js` - Design customization

### Hooks
- `useCardLayout.js` - Unified card layout management
- `useUserProfile.js` - Profile data management
- `useEditSectionModal.js` - Section editing

## 📊 Database Schema

### Simplified Profile Structure
```sql
profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  name TEXT,
  headline TEXT,
  bio TEXT,
  -- Design settings
  button_color TEXT,
  background_color TEXT,
  text_color TEXT,
  font_family TEXT,
  -- Consolidated data
  social_media JSONB DEFAULT '{}',
  sections JSONB DEFAULT '[]'
)
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create a Supabase project
   - Run migrations from `supabase/migrations/`
   - Configure environment variables

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔧 Development

### Key Simplifications Made
1. **Hook Consolidation**: Reduced hook complexity by merging related functionality
2. **Component Unification**: Created reusable components for similar functionality
3. **Database Optimization**: Simplified schema with JSONB for flexible data storage
4. **Code Cleanup**: Removed duplicate files and unused directories

### Adding New Sections
1. Add section type to `src/lib/sectionOptions.js`
2. Create component in `src/components/card/cardSections/`
3. Add to `sectionComponentMap` in `CardSectionRenderer.js`

## 📝 License

MIT License - see LICENSE file for details.

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
| **Primair blauw** | `#2563eb` | Knoppen, CTA's                          |
| **Licht blauw**   | `#60a5fa` | Hoverstates, iconen, accenten           |
| **Donkerblauw**   | `#1e3a8a` | Contrast, donkere thema's, headings     |

> ✨ Deze kleuren worden ingesteld via `tailwind.config.ts`