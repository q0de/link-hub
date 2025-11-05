# Track Click Edge Function

This Supabase Edge Function handles click tracking for links and domains with IP anonymization.

## Deployment

Deploy using the Supabase CLI:

```bash
supabase functions deploy track-click
```

## Usage

The function is called automatically when users click on links or domains. It can also be called manually:

```typescript
const { data, error } = await supabase.functions.invoke('track-click', {
  body: {
    linkId: 'link-uuid', // optional
    domainId: 'domain-uuid', // optional
    referrer: 'https://example.com', // optional
  },
})
```

## Features

- IP address anonymization (SHA-256 hash)
- Referrer tracking
- CORS support for cross-origin requests
- Error handling

