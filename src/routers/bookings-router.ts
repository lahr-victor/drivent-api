import { Router } from 'express';

import { authenticateToken, validateBody } from '@/middlewares';
import { createBooking, getBookingByUser, updateBooking } from '@/controllers/bookings-controller';
import { bookingSchema } from '@/schemas';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getBookingByUser)
  .post('/', validateBody(bookingSchema), createBooking)
  .put('/:bookingId', validateBody(bookingSchema), updateBooking);

export { bookingsRouter };
