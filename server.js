require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE || 'true') === 'true',
  user: process.env.SMTP_USER || 'joseph.ecommexpert@gmail.com',
  pass: process.env.SMTP_PASS || 'wotf vnut vhbi vizh'
};

const RECIPIENTS = [
  'harton.apps@gmail.com',
  'iamkatewilliams084@gmail.com',
  'alexfrmshopify@gmail.com'
];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function formatField(value) {
  return value ? String(value).trim() : 'Not provided';
}

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
        <p style="margin:0 0 24px;color:#6b7280;">A new rent application form was submitted from the website.</p>
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

function buildText(formData) {
  return [
    'New Rental Application',
    '======================',
    `Full Name: ${formatField(formData.fullName)}`,
    `First Name: ${formatField(formData.firstName)}`,
    `Last Name: ${formatField(formData.lastName)}`,
    `Phone: ${formatField(formData.phone)}`,
    `Email: ${formatField(formData.email)}`,
    `Date of Birth: ${formatField(formData.dateOfBirth)}`,
    `Current Address: ${formatField(formData.currentAddress)}`,
    `Current City: ${formatField(formData.currentCity)}`,
    `Current State/Region/Province: ${formatField(formData.currentState)}`,
    `Current Postal / Zip Code: ${formatField(formData.currentZip)}`,
    `Desired Rental Property Address: ${formatField(formData.propertyAddress)}`,
    `Desired Rental City: ${formatField(formData.propertyCity)}`,
    `Desired Rental State/Region/Province: ${formatField(formData.propertyState)}`,
    `Desired Rental Postal / Zip Code: ${formatField(formData.propertyZip)}`,
    `Lease Term: ${formatField(formData.leaseTerm)}`,
    `Desired Move-in Date: ${formatField(formData.moveInDate)}`,
    `Current Employer: ${formatField(formData.currentEmployer)}`,
    `Employed Since: ${formatField(formData.employedSince)}`,
    `Monthly Income (USD): ${formatField(formData.monthlyIncome)}`,
    `Previous Landlord Name: ${formatField(formData.previousLandlordName)}`,
    `Previous Address: ${formatField(formData.previousAddress)}`,
    `Previous City: ${formatField(formData.previousCity)}`,
    `Previous State/Region/Province: ${formatField(formData.previousState)}`,
    `Previous Postal / Zip Code: ${formatField(formData.previousZip)}`,
    `Reason for Leaving: ${formatField(formData.reasonForLeaving)}`,
    `Reference Name: ${formatField(formData.referenceName)}`,
    `Reference First Name: ${formatField(formData.referenceFirstName)}`,
    `Reference Last Name: ${formatField(formData.referenceLastName)}`,
    `Reference Phone: ${formatField(formData.referencePhone)}`,
    `Has Pets?: ${formatField(formData.hasPets)}`,
    `Application Fee Payment Method: ${formatField(formData.paymentMethod)}`,
    `Consent Accepted: ${formData.consent ? 'Yes' : 'No'}`
  ].join('\n');
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: SMTP_CONFIG.secure,
    auth: {
      user: SMTP_CONFIG.user,
      pass: SMTP_CONFIG.pass
 codex/create-rental-application-form-with-email-notifications-1jcubc
    }
  });
}

app.post('/apply', async (req, res) => {
  const formData = req.body;

  if (!formData.fullName || !formData.firstName || !formData.lastName || !formData.currentAddress || !formData.consent) {
    return res.status(400).json({
      ok: false,
      message: 'Please complete all required fields before submitting.'
    });
  }

 
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(500).json({
      ok: false,
      message: 'Email delivery is not configured yet. Add SMTP credentials to your environment.'
    });
  }

  try {
    const transporter = createTransporter();

    await transporter.sendMail({

      from: `Rental Application Desk <${process.env.SMTP_USER}>`,
      to: RECIPIENTS.join(', '),
      replyTo: formData.email || process.env.SMTP_USER,
      from: `Rental Application Desk <${SMTP_CONFIG.user}>`,
      to: RECIPIENTS.join(', '),
      replyTo: formData.email || SMTP_CONFIG.user,
      subject: `New Rent Application - ${formatField(formData.fullName)}`,
      text: buildText(formData),
      html: buildHtml(formData)
    });

    return res.json({
      ok: true,
      message: 'Application submitted successfully. We will review it shortly.'
    });
  } catch (error) {
    console.error('Email send failed:', error);
    return res.status(500).json({
      ok: false,
      message: 'Something went wrong while sending the application. Please try again.'
    });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Rental application server running on http://localhost:${port}`);
});
