import { notFoundError } from '@/errors';
import { bookingRepository } from '@/repositories';

async function getByUser(userId: number) {
  const booking = await bookingRepository.findByUser(userId);
  if (!booking) throw notFoundError();

  return booking;
}

export const bookingService = { getByUser };
