import { Response } from 'express';
import httpStatus from 'http-status';

import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services';

export async function getBookingByUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
  const { userId } = req;
  const booking = await bookingService.getByUser(userId);

  return res.status(httpStatus.OK).send(booking);
}

export async function createBooking(req: AuthenticatedRequest, res: Response): Promise<Response> {
  const { roomId } = req.body;
  const { userId } = req;
  const booking = await bookingService.create(roomId, userId);

  return res.status(httpStatus.OK).send({ bookingId: booking.id });
}

export async function updateBooking(req: AuthenticatedRequest, res: Response): Promise<Response> {
  const { roomId } = req.body;
  const { userId } = req;
  const { bookingId } = req.params;

  const booking = await bookingService.update(roomId, userId, parseInt(bookingId, 10));

  return res.status(httpStatus.OK).send({ bookingId: booking.id });
}
