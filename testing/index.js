require('dotenv').config();
const nodemailer = require('nodemailer');
const express    = require('express');
const path       = require('path');
const { body, validationResult } = require('express-validator');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ──────────────────────────────────────────────────────────────
   1.  STATIC FILES
   Everything (html/css/js/images/pdf …) now lives in the project
   root, so point express.static at __dirname instead of /public.
   ──────────────────────────────────────────────────────────── */
const STATIC_DIR = path.resolve(__dirname);      // <── this folder
app.use(express.static(STATIC_DIR));             // serves /index.html, /style.css, …

app.use(express.json());

/* ──────────────────────────────────────────────────────────────
   2.  MAIL TRANSPORT
   (unchanged)
   ──────────────────────────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  host   : process.env.EMAIL_HOST,
  port   : process.env.EMAIL_PORT,
  secure : +process.env.EMAIL_PORT === 465,            // 465 = SSL
  auth   : { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

/* ──────────────────────────────────────────────────────────────
   3.  API
   ──────────────────────────────────────────────────────────── */
app.post(
  '/api/contact',
  [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message too short')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      await transporter.sendMail({
        from   : `"Portfolio Form" <${process.env.EMAIL_USER}>`,
        to     : process.env.TO_ADDR,
        subject: `New message from ${req.body.name}`,
        replyTo: req.body.email,
        text   : req.body.message,
        html   : `<p>${req.body.message.replace(/\n/g, '<br>')}</p>`
      });
      res.json({ ok: true });
    } catch (err) {
      console.error('✉️  Mail error:', err);
      res.status(500).json({ ok: false, error: 'mail_failed' });
    }
  }
);

/* ──────────────────────────────────────────────────────────────
   4.  SPA / FALL-BACK ROUTE
   Catch anything that isn’t an API call or static asset and send
   back index.html so the browser can request the correct files.
   ──────────────────────────────────────────────────────────── */
app.get('*', (_req, res) =>
  res.sendFile(path.join(STATIC_DIR, 'index.html'))
);

/* ──────────────────────────────────────────────────────────────
   5.  START SERVER
   ──────────────────────────────────────────────────────────── */
app.listen(PORT, () =>
  console.log(`🟢  Portfolio running at http://localhost:${PORT}`)
);
