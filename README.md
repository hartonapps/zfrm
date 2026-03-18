# Rental Application Form

A polished Node.js rental application form that collects the requested applicant details and sends each submission to:

- harton.apps@gmail.com
- iamkatewilliams084@gmail.com
- alexfrmshopify@gmail.com

## Features

- Classic, professional front-end design.
- Captures all questions shown in the requested form.
- Uses Nodemailer to email application responses to all three inboxes.
- Includes the provided Gmail sender credentials as the built-in default so form submission works immediately after install.
- Sends a styled HTML email plus a plain-text fallback.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Optionally copy the sample environment file if you want to override the built-in mail settings:
   ```bash
   cp .env.example .env
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open `http://localhost:3000` in your browser.

## Environment variables

These values are already used as the server defaults, and you can override them with a local `.env` file if needed.

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=joseph.ecommexpert@gmail.com
SMTP_PASS=wotf vnut vhbi vizh
PORT=3000
```

## Notes

- The configured sender account is used as the `from` address.
- The applicant email is added as the `replyTo` address when available.
- `package.json` already declares `express`, `nodemailer`, and `dotenv`, so `npm install` knows exactly what to install.
