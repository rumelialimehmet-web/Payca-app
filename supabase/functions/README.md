# Supabase Edge Functions

This directory contains Supabase Edge Functions for secure server-side operations.

## Functions

### `openai-proxy`

Secure proxy for OpenAI API calls. Keeps API keys server-side and prevents client exposure.

**Features:**
- Receipt scanning with GPT-4o Vision
- Financial advice with GPT-4o-mini
- Authentication required (Supabase Auth)
- CORS headers configured

## Deployment

### Prerequisites

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### Deploy Edge Function

```bash
# Deploy the openai-proxy function
supabase functions deploy openai-proxy

# Set OpenAI API key secret
supabase secrets set OPENAI_API_KEY=your-openai-api-key-here
```

### Local Development

Run Edge Function locally:

```bash
# Start local Supabase
supabase start

# Serve functions locally
supabase functions serve openai-proxy --env-file .env.local
```

Create `.env.local` file:
```
OPENAI_API_KEY=your-openai-api-key-here
```

### Test Edge Function

```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/openai-proxy' \
  --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"financial-advice","groups":[],"userId":"test"}'
```

## Environment Variables

Set these secrets in Supabase Dashboard or via CLI:

- `OPENAI_API_KEY` - Your OpenAI API key (required)

```bash
supabase secrets set OPENAI_API_KEY=sk-...
```

## Security

- ✅ API keys stored server-side only
- ✅ Authentication required for all endpoints
- ✅ CORS configured for your domain
- ✅ Input validation
- ✅ Error handling

## Monitoring

View function logs:

```bash
supabase functions logs openai-proxy
```

Or in Supabase Dashboard → Edge Functions → openai-proxy → Logs

## Troubleshooting

**Function not deploying:**
- Check you're linked to correct project
- Verify CLI is up to date: `npm install -g supabase@latest`

**429 errors:**
- Check OpenAI API quota
- Verify OpenAI API key is valid

**Authentication errors:**
- Ensure client passes Authorization header
- Check Supabase project settings
