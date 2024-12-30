import express from 'express';
import { reserveSeats, resetBookings ,getSeats} from '../controllers/bookingController.js';
const router = express.Router();

router.post('/reserve', reserveSeats);
router.post('/reset', resetBookings);
router.get('/seats', getSeats)

export default router;