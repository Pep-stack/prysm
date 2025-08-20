# Social Authentication Setup Guide

Deze gids helpt je bij het instellen van social authentication (OAuth) voor Google, Apple, X (Twitter), en GitHub in je Prysma applicatie.

## 🔧 Supabase Configuration

### Stap 1: Supabase Dashboard
1. Ga naar je [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecteer je project
3. Ga naar **Authentication** → **Providers**
4. Schakel de gewenste providers in:
   - ✅ Google
   - ✅ Apple  
   - ✅ Twitter
   - ✅ GitHub

---

## 🔍 Google OAuth Setup

### Stap 1: Google Cloud Console
1. Ga naar [Google Cloud Console](https://console.cloud.google.com/)
2. Maak een nieuw project aan of selecteer een bestaand project
3. Ga naar **APIs & Services** → **Credentials**

### Stap 2: OAuth 2.0 Client ID aanmaken
1. Klik **Create Credentials** → **OAuth client ID**
2. Selecteer **Web application**
3. Voeg **Authorized redirect URIs** toe:
   ```
   https://YOUR_SUPABASE_URL.supabase.co/auth/v1/callback
   ```

### Stap 3: Supabase configureren
1. Kopieer **Client ID** en **Client Secret**
2. Plak deze in Supabase Dashboard → Authentication → Providers → Google

---

## 🍎 Apple OAuth Setup

### Stap 1: Apple Developer Account
1. Ga naar [Apple Developer Console](https://developer.apple.com/)
2. **Account vereist**: Je hebt een betaald Apple Developer account nodig ($99/jaar)

### Stap 2: App ID configureren
1. Ga naar **Certificates, Identifiers & Profiles**
2. Maak een nieuwe **App ID** aan
3. Schakel **Sign In with Apple** in

### Stap 3: Service ID aanmaken
1. Maak een nieuwe **Services ID** aan
2. Configureer **Sign In with Apple**
3. Voeg **Return URLs** toe:
   ```
   https://YOUR_SUPABASE_URL.supabase.co/auth/v1/callback
   ```

### Stap 4: Private Key
1. Maak een nieuwe **Key** aan voor Sign In with Apple
2. Download de `.p8` private key file

### Stap 5: Supabase configureren
1. Vul in Supabase Dashboard:
   - **Services ID**: Je Services ID
   - **Team ID**: Je Apple Team ID
   - **Key ID**: Je Key ID
   - **Private Key**: Inhoud van `.p8` file

---

## ✖️ X (Twitter) OAuth Setup

### Stap 1: X Developer Portal
1. Ga naar [X Developer Portal](https://developer.twitter.com/)
2. Maak een developer account aan (gratis)
3. Maak een nieuwe **App** aan

### Stap 2: OAuth 2.0 configureren
1. Ga naar je app settings
2. Schakel **OAuth 2.0** in
3. Voeg **Callback URL** toe:
   ```
   https://YOUR_SUPABASE_URL.supabase.co/auth/v1/callback
   ```

### Stap 3: API Keys
1. Genereer **Client ID** en **Client Secret**
2. Bewaar deze veilig

### Stap 4: Supabase configureren
1. Plak **Client ID** en **Client Secret** in Supabase Dashboard → Authentication → Providers → Twitter

---

## 🐙 GitHub OAuth Setup

### Stap 1: GitHub Settings
1. Ga naar [GitHub](https://github.com/)
2. Ga naar **Settings** → **Developer settings** → **OAuth Apps**
3. Klik **New OAuth App**

### Stap 2: App configureren
1. Vul in:
   - **Application name**: Prysma
   - **Homepage URL**: `https://yourapp.com`
   - **Authorization callback URL**: 
     ```
     https://YOUR_SUPABASE_URL.supabase.co/auth/v1/callback
     ```

### Stap 3: Client Credentials
1. Kopieer **Client ID**
2. Genereer een nieuwe **Client Secret**

### Stap 4: Supabase configureren
1. Plak **Client ID** en **Client Secret** in Supabase Dashboard → Authentication → Providers → GitHub

---

## 🔐 Security & Best Practices

### Environment Variables
```bash
# .env.local (voor development)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Redirect URLs
Zorg ervoor dat alle redirect URLs correct zijn ingesteld:
- **Development**: `http://localhost:3000/auth/callback`
- **Production**: `https://yourdomain.com/auth/callback`

### CORS Settings
In Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `https://yourdomain.com`
- **Redirect URLs**: 
  - `https://yourdomain.com/auth/callback`
  - `http://localhost:3000/auth/callback` (voor development)

---

## 🧪 Testing

### Test Flow
1. Ga naar `/login` of `/signup`
2. Klik op een social login button
3. Autoriseer de app bij de provider
4. Controleer of je wordt doorgestuurd naar `/dashboard`
5. Verificeer dat je profile data correct is gesynchroniseerd

### Troubleshooting
- **"Invalid redirect URI"**: Controleer of de callback URL exact overeenkomt
- **"Client not found"**: Controleer Client ID en Secret
- **"Access denied"**: Gebruiker heeft autorisatie geweigerd
- **"Configuration error"**: Controleer Supabase provider settings

---

## 📊 Provider Comparison

| Provider | Setup Moeilijkheid | Kosten | Verificatie Vereist |
|----------|-------------------|---------|-------------------|
| Google   | ⭐⭐⭐ Gemiddeld    | Gratis  | Nee               |
| GitHub   | ⭐⭐ Makkelijk      | Gratis  | Nee               |
| X        | ⭐⭐⭐ Gemiddeld    | Gratis  | Mogelijk          |
| Apple    | ⭐⭐⭐⭐⭐ Moeilijk  | $99/jaar| Ja                |

### Aanbeveling
Start met **Google** en **GitHub** - deze zijn het makkelijkst in te stellen en werken meteen.

---

## 🚀 Implementation Status

✅ **Geïmplementeerd:**
- Social login buttons met echte iconen
- OAuth flow handling
- Profile data synchronisatie
- Error handling
- Loading states

🔄 **Setup vereist:**
- OAuth apps configureren bij providers
- Supabase providers inschakelen
- Redirect URLs configureren
- Testing en debugging

---

## 💡 Tips

1. **Test altijd eerst in development** voordat je naar productie gaat
2. **Bewaar credentials veilig** - gebruik environment variables
3. **Monitor auth logs** in Supabase voor debugging
4. **Implementeer fallbacks** voor wanneer OAuth faalt
5. **Respecteer rate limits** van OAuth providers

Voor vragen of problemen, check de [Supabase Auth docs](https://supabase.com/docs/guides/auth) of de provider-specifieke documentatie.
