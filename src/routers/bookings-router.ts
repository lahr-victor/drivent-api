import { Router } from 'express';

import { authenticateToken } from '@/middlewares';
import { getBookingByUser } from '@/controllers/bookings-controller';

const bookingsRouter = Router();

bookingsRouter.get('/', authenticateToken, getBookingByUser);

export { bookingsRouter };
