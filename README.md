# Café Veritas Rebuild Starter (Astro + Tailwind, Vercel)

Modern static+server site to rebuild **thecafeveritas.org**. Tailored for **Vercel** with a working contact form endpoint.

## Quick Start
```bash
npm install
npm run dev
```

## Deploy on Vercel
- Import repo into Vercel
- Build: `npm run build`
- Output: `dist`
- Domains: add `thecafeveritas.org` and `www.thecafeveritas.org`
- Set env vars if you want email: `MAIL_TO`, `MAIL_FROM`, `RESEND_API_KEY`

## Contact Form
- POSTs to `/api/contact` (server route)
- If `RESEND_API_KEY` + `MAIL_TO` + `MAIL_FROM` are set, sends email via Resend
- Otherwise logs server-side and redirects to `/contact/thanks/`

## Content Migration (Optional; ensure you have rights)
```bash
npm run migrate
```
Generated Markdown ends up in `src/pages/_imported/` for review.
