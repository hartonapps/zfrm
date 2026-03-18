require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// SMTP configuration from .env
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE || 'true') === 'true',
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS
};

// Recipient emails
const RECIPIENTS = [
  'harton.apps@gmail.com',
  'iamkatewilliams084@gmail.com',
  'alexfrmshopify@gmail.com'
];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to format fields
function formatField(value) {
  return value ? String(value).trim() : 'Not provided';
}

// Build HTML email
function buildHtml(formData) {
  const entries = [
    ['Full Name', formData.fullName],
    ['First Name', formData.firstName],
    ['Last Name', formData.lastName],
    ['Phone', formData.phone],
    ['Email', formData.email],
    ['Date of Birth', formData.dateOfBirth],
    ['Current Address', formData.currentAddress],
    ['Current City', formData.currentCity],
    ['Current State/Region/Province', formData.currentState],
    ['Current Postal / Zip Code', formData.currentZip],
    ['Desired Rental Property Address', formData.propertyAddress],
    ['Desired Rental City', formData.propertyCity],
    ['Desired Rental State/Region/Province', formData.propertyState],
    ['Desired Rental Postal / Zip Code', formData.propertyZip],
    ['Lease Term', formData.leaseTerm],
    ['Desired Move-in Date', formData.moveInDate],
    ['Current Employer', formData.currentEmployer],
    ['Employed Since', formData.employedSince],
    ['Monthly Income (USD)', formData.monthlyIncome],
    ['Previous Landlord Name', formData.previousLandlordName],
    ['Previous Address', formData.previousAddress],
    ['Previous City', formData.previousCity],
    ['Previous State/Region/Province', formData.previousState],
    ['Previous Postal / Zip Code', formData.previousZip],
    ['Reason for Leaving', formData.reasonForLeaving],
    ['Reference Name', formData.referenceName],
    ['Reference First Name', formData.referenceFirstName],
    ['Reference Last Name', formData.referenceLastName],
    ['Reference Phone', formData.referencePhone],
    ['Has Pets?', formData.hasPets],
    ['Application Fee Payment Method', formData.paymentMethod],
    ['Consent Accepted', formData.consent ? 'Yes' : 'No']
  ];

  return `
    <div style="font-family:Arial,sans-serif;background:#f6f2ea;padding:24px;color:#1f2937;">
      <div style="max-width:760px;margin:0 auto;background:#ffffff;border-radius:18px;padding:32px;border:1px solid #e5ded3;box-shadow:0 20px 45px rgba(17,24,39,0.08);">
        <h1 style="margin:0 0 8px;font-size:28px;color:#111827;">New Rental Application</h1>
        <p style="margin:0 0 24px;color:#6b7280;">A new rental application form was submitted from the website.</p>
        <table style="width:100%;border-collapse:collapse;">
          ${entries.map(([label, value]) => `
            <tr>
              <td style="padding:12px 14px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:700;width:38%;">${label}</td>
              <td style="padding:12px 14px;border:1px solid #e5e7eb;">${formatField(value)}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    </div>
  `;
}

// Build plain-text fallback email
function buildText(formData) {
  return [
    'New Rental Application',
    '======================',
    ...Object.entries(formData).map(([key, value]) => `${key}: ${formatField(value)}`)
  ].join('\n');
}

// Create Nodemailer transporter
function createTransporter() {
  if (!SMTP_CONFIG.user || !SMTP_CONFIG.pass) {
    throw new Error('SMTP credentials not set. Add them to your .env file.');
  }

  return nodemailer.createTransport({
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: SMTP_CONFIG.secure,
    auth: {
      user: SMTP_CONFIG.user,
      pass: SMTP_CONFIG.pass
    }
  });
}

// Handle form submissions
app.post('/apply', async (req, res) => {
  const formData = req.body;

  // Validate required fields
  if (!formData.fullName || !formData.firstName || !formData.lastName || !formData.currentAddress || !formData.consent) {
    return res.status(400).json({
      ok: false,
      message: 'Please complete all required fields before submitting.'
    });
  }

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `Rental Application Desk <${SMTP_CONFIG.user}>`,
      to: RECIPIENTS.join(', '),
      replyTo: formData.email || SMTP_CONFIG.user,
      subject: `New Rent Application - ${formatField(formData.fullName)}`,
      text: buildText(formData),
      html: buildHtml(formData)
    });

    res.json({
      ok: true,
      message: 'Application submitted successfully. We will review it shortly.'
    });
  } catch (error) {
    console.error('Email send failed:', error);
    res.status(500).json({
      ok: false,
      message: 'Something went wrong while sending the application. Please try again later.'
    });
  }
});

// Serve front-end
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Rental application server running on http://localhost:${port}`);
});
