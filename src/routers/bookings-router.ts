import { Router } from 'express';

import { authenticateToken, validateBody } from '@/middlewares';
import { createBooking, getBookingByUser } from '@/controllers/bookings-controller';
import { bookingSchema } from '@/schemas/bookings-schemas';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getBookingByUser)
  .post('/', validateBody(bookingSchema), createBooking);

export { bookingsRouter };
