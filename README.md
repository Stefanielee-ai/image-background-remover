# Image Background Remover

Free online image background remover built with **Next.js + Tailwind CSS**, deployed on **Cloudflare Pages**.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **API Route**: Next.js Edge Runtime → Remove.bg API
- **Deploy**: Cloudflare Pages

## Local Development

```bash
npm install

# Create .env.local
echo "REMOVE_BG_API_KEY=your_key_here" > .env.local

npm run dev
# Open http://localhost:3000
```

## Deploy to Cloudflare Pages

1. Connect this repo in [Cloudflare Pages](https://pages.cloudflare.com/)
2. Build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Output directory**: `.next`
3. Add environment variable: `REMOVE_BG_API_KEY` = your Remove.bg API key
4. Deploy

## Environment Variables

| Variable | Description |
|----------|-------------|
| `REMOVE_BG_API_KEY` | Your [Remove.bg API key](https://www.remove.bg/api) |

## License

MIT
