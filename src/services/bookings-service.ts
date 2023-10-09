import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import { bookingRepository, enrollmentRepository, hotelRepository, ticketsRepository } from '@/repositories';

async function getByUser(userId: number) {
  const booking = await bookingRepository.findByUser(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function validate(roomId: number, userId: number) {
  const room = await hotelRepository.findRoom(roomId);
  if (!room) throw notFoundError();

  const roomBookings = await bookingRepository.countByRoom(roomId);
  if (roomBookings >= room.capacity) throw forbiddenError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw forbiddenError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw forbiddenError();

  const { status, TicketType: type } = ticket;
  if (status === 'RESERVED' || type.isRemote || !type.includesHotel) {
    throw forbiddenError();
  }
}

async function create(roomId: number, userId: number) {
  await validate(roomId, userId);

  return await bookingRepository.create(roomId, userId);
}

async function update(roomId: number, userId: number, bookingId: number) {
  const booking = await bookingRepository.findByUser(userId);
  if (!booking) throw forbiddenError();

  await validate(roomId, userId);

  return await bookingRepository.update(roomId, bookingId);
}

export const bookingService = { getByUser, create, update };
