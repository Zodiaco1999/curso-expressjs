const { Router } = require('express');
const {
  createTimeBlock,
  listReservations
} = require('../controllers/adminController');

const router = Router();

router.post('/time-block', createTimeBlock);
router.get('/reservations', listReservations);

module.exports = router;