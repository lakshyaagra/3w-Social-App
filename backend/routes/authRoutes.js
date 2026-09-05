const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// Slows down credential-guessing/spam against auth endpoints without
// affecting normal usage (20 attempts / 15 min / IP is generous for a real user).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later' },
});

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);

module.exports = router;
