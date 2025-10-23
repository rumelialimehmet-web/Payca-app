# Google OAuth Setup Guide for Payça

This guide will help you configure Google OAuth authentication in your Supabase project.

## Why Google OAuth?

- **Better User Experience**: One-click authentication
- **Higher Conversion**: Users prefer social login over email/password
- **Secure**: No password storage needed
- **Turkey Market**: Gmail is widely used in Turkey

## Prerequisites

- Supabase project created and running
- Google Cloud Platform account (free)

## Step 1: Create Google OAuth Credentials (5 minutes)

### 1.1 Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 1.2 Create a New Project (if needed)
1. Click on the project dropdown at the top
2. Click "NEW PROJECT"
3. Name: `Payca App`
4. Click "CREATE"
5. Select your new project

### 1.3 Enable Google+ API
1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "ENABLE"

### 1.4 Create OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" (for public users)
3. Click "CREATE"

Fill in the required information:
- **App name**: Payça
- **User support email**: Your email
- **Developer contact information**: Your email

4. Click "SAVE AND CONTINUE"
5. Scopes: Skip this step (click "SAVE AND CONTINUE")
6. Test users: Skip this step (click "SAVE AND CONTINUE")
7. Click "BACK TO DASHBOARD"

### 1.5 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" at the top
3. Select "OAuth client ID"

Fill in:
- **Application type**: Web application
- **Name**: Payca Web App

**Authorized JavaScript origins**:
```
https://payca-app.vercel.app
http://localhost:5173
```

**Authorized redirect URIs** (IMPORTANT!):
```
https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
```

⚠️ **To find your Supabase callback URL:**
- Go to Supabase Dashboard → Authentication → Providers → Google
- Copy the "Callback URL (for Google)" shown there

4. Click "CREATE"

### 1.6 Save Your Credentials
You'll see a popup with:
- **Client ID**: `xxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxx`

⚠️ **IMPORTANT**: Copy both values! You'll need them in the next step.

## Step 2: Configure Supabase (2 minutes)

### 2.1 Go to Supabase Dashboard
1. Open your Payça project in Supabase
2. Go to "Authentication" → "Providers"
3. Find "Google" in the list

### 2.2 Enable Google Provider
1. Toggle "Enable Sign in with Google" to ON
2. Paste your Google credentials:
   - **Client ID**: The value from Step 1.6
   - **Client Secret**: The value from Step 1.6
3. Click "SAVE"

### 2.3 Get Callback URL
The callback URL should be shown in the provider settings:
```
https://[your-project-ref].supabase.co/auth/v1/callback
```

If you missed adding this to Google Console in Step 1.5, go back and add it now!

## Step 3: Deploy and Test (2 minutes)

### 3.1 Your App is Ready!
The Payça app already has Google OAuth buttons implemented. No code changes needed!

### 3.2 Test Google Login
1. Go to https://payca-app.vercel.app/
2. Click "📧 Gmail ile Kayıt Ol"
3. Click "Gmail ile Kayıt Ol" button in the modal
4. You'll be redirected to Google sign-in
5. Choose your Google account
6. You'll be redirected back to Payça
7. ✅ You're logged in!

### 3.3 Verify in Supabase
1. Go to Supabase Dashboard → Authentication → Users
2. You should see your new user with:
   - Email from Google
   - Provider: `google`
   - Avatar from Google (if available)

## Troubleshooting

### Error: "Redirect URI mismatch"
**Problem**: The redirect URI in Google Console doesn't match Supabase callback URL.

**Solution**:
1. Double-check the callback URL in Supabase (Authentication → Providers → Google)
2. Make sure it's exactly the same in Google Console (including https://)
3. Wait 5 minutes for changes to propagate

### Error: "Access blocked: This app's request is invalid"
**Problem**: OAuth consent screen not configured properly.

**Solution**:
1. Go back to Google Console → OAuth consent screen
2. Make sure app name and support email are filled in
3. Publish the app (change from "Testing" to "In Production")

### Error: "Unsupported provider: provider is not enabled"
**Problem**: Google provider not enabled in Supabase.

**Solution**:
1. Go to Supabase → Authentication → Providers
2. Make sure "Google" toggle is ON
3. Click SAVE

### Users Can't Sign Up with Google
**Problem**: OAuth consent screen is in "Testing" mode with limited test users.

**Solution**:
1. Go to Google Console → OAuth consent screen
2. Click "PUBLISH APP"
3. Confirm publishing to make it available to all users

## Security Best Practices

✅ **DO**:
- Keep your Client Secret secure (never commit to git)
- Use environment variables for credentials
- Regularly review authorized users in Supabase
- Enable email verification in Supabase settings

❌ **DON'T**:
- Share your Client Secret publicly
- Commit credentials to GitHub
- Allow unrestricted redirect URIs
- Skip OAuth consent screen configuration

## What's Next?

Now that Google OAuth is working:

1. ✅ Users can sign up with one click
2. ✅ Better conversion rates
3. ✅ Secure authentication
4. ✅ Profile data from Google (name, avatar)

**Optional Enhancements**:
- Add Facebook OAuth (similar process)
- Add Apple Sign In (for iOS users)
- Enable email notifications for new signups
- Customize the OAuth consent screen with logo

## Need Help?

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs → Auth
2. Check browser console for errors
3. Verify all URLs match exactly (trailing slashes matter!)
4. Wait 5-10 minutes after making changes in Google Console

## Summary Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Authorized redirect URI added with correct Supabase callback URL
- [ ] Google provider enabled in Supabase with Client ID and Secret
- [ ] Tested Google login on https://payca-app.vercel.app/
- [ ] Verified user in Supabase Authentication → Users

🎉 **You're done!** Google OAuth is now live for Payça users!
