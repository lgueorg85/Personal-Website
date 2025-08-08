require('dotenv').config();
const nodemailer = require('nodemailer');

const express = require('express');
const path    = require('path');
const { body, validationResult } = require('express-validator');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   process.env.EMAIL_PORT,
  secure: +process.env.EMAIL_PORT === 465, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// ---------- API ----------
app.post(
  '/api/contact',
  [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message too short')
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
        await transporter.sendMail({
            from: `"Portfolio Form" <${process.env.EMAIL_USER}>`,
            to:   process.env.TO_ADDR,
            subject: `New message from ${req.body.name}`,
            replyTo: req.body.email,
            text:    req.body.message,
            html:    `<p>${req.body.message.replace(/\n/g,'<br>')}</p>`
        });
        res.json({ ok: true });
        } catch (err) {
        console.error('✉️  Mail error:', err);
        res.status(500).json({ ok: false, error: 'mail_failed' });
        }

    res.json({ ok: true });
  }
);



// Version B – middleware catch-all (simple & safe)
app.use((req, res) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

app.listen(PORT, () =>
  console.log(`🟢  Portfolio running at http://localhost:${PORT}`)
);
