# Rental Application Form

A polished Node.js rental application form that collects the requested applicant details and sends each submission to:

- harton.apps@gmail.com
- iamkatewilliams084@gmail.com
- alexfrmshopify@gmail.com

## Features

- Classic, professional front-end design.
- Captures all questions shown in the requested form.
- Uses Nodemailer to email application responses to all three inboxes.
- Sends a styled HTML email plus a plain-text fallback.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the sample environment file and add your SMTP credentials:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your Gmail sender address (for example `joseph.ecommexpert@gmail.com`) and the matching Gmail app password.
4. Start the server:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000` in your browser.

## Environment variables

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=joseph.ecommexpert@gmail.com
SMTP_PASS=your-app-password
PORT=3000
```

## Notes

- The configured sender account is used as the `from` address.
- The applicant email is added as the `replyTo` address when available.
- Secrets are intentionally excluded from version control. Put real credentials only in your local `.env` file.
