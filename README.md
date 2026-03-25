# Image Background Remover

Free online image background remover powered by [Remove.bg API](https://www.remove.bg/api), deployed on Cloudflare Pages + Workers.

## Features

- Upload JPG, PNG, WebP (up to 10MB)
- AI-powered background removal
- Download transparent PNG
- No storage — images processed in memory only
- Mobile responsive

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS → Cloudflare Pages
- **Backend**: Cloudflare Workers → Remove.bg API

## Local Development

```bash
# Install wrangler
npm install -g wrangler

# Set your API key
wrangler secret put REMOVE_BG_API_KEY

# Run worker locally
wrangler dev worker/index.js

# Open index.html in browser (update WORKER_URL in app.js to http://localhost:8787/api/remove-bg)
```

## Deploy

```bash
# Deploy worker
wrangler deploy

# Deploy frontend to Cloudflare Pages
# Connect this repo in Cloudflare Pages dashboard, build command: none, output: /
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `REMOVE_BG_API_KEY` | Your Remove.bg API key (set via wrangler secret) |

## License

MIT
