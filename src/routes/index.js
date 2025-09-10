const { Router } = require('express');
const authRouter = require('./auth');
const adminRouter = require('./admin');
const reservations = require('./reservations');
const appointments = require('./appointments');
const usersRouter = require('./users');
const authenticateToken = require('../middlewares/auth');

const router = Router();
router.use('/auth', authRouter);
router.use('/admin', authenticateToken, adminRouter);
router.use('/reservations', authenticateToken, reservations);
router.use('/appointments', authenticateToken, appointments);
router.use('/users', authenticateToken, usersRouter);

module.exports = router;