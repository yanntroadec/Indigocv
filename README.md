# IndigoCV

Trilingual (EN/FR/ES) CV builder. Fill a multi-step form, preview your CV in real time, and download it as a PDF.

**[indigocv.com](https://indigocv.com)**

## Features

- 9-step form wizard to enter personal info, experience, education, skills, etc.
- Live PDF preview with customizable template (colors, fonts, layout)
- One-click PDF download
- Magic link authentication (passwordless)
- Save and reuse profiles across multiple CVs
- Fully translated in English, French, and Spanish

## Tech Stack

- **Framework** — Next.js 16 (App Router, Turbopack)
- **UI** — React 19, Tailwind CSS 4
- **Backend** — Supabase (Auth, PostgreSQL, Storage)
- **PDF** — @react-pdf/renderer (client-side)
- **i18n** — next-intl
- **Email** — Resend
- **State** — Zustand (sessionStorage)
- **Hosting** — Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) account (for emails)

### Setup

```bash
git clone https://github.com/yanntroadec/Indigocv.git
cd Indigocv
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env.local
```

See `.env.example` for the required variables.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Tests

```bash
npm test
```

## License

All rights reserved.
