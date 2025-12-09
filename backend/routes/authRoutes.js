import express from 'express';
import passport from 'passport';
import { signup, login, googleCallback, googleSignup } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google-signup', googleSignup);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleCallback);

export default router;
