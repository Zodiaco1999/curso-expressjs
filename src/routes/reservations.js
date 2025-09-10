const { Router } = require('express');
const  {
  createReservation,
  getReservation,
  updateReservation,
  deleteReservation 
} = require('../controllers/reservationController');

const router = Router();

router.post('/', createReservation);
router.get('/:id', getReservation);
router.put('/:id', updateReservation);
router.delete('/:id', deleteReservation);

module.exports = router;
