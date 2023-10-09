import { Response } from 'express';
import httpStatus from 'http-status';

import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services';

export async function getBookingByUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
  const { userId } = req;
  const booking = await bookingService.getByUser(userId);

  return res.status(httpStatus.OK).send(booking);
}
