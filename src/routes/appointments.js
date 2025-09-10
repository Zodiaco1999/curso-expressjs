const { Router } = require('express');
const appointmentController = require('../controllers/appointmentController');
const router = Router();

router.get('/:id', appointmentController.getUserAppointments);

module.exports = router;