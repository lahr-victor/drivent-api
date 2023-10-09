import { prisma } from '@/config';

async function findByUser(userId: number) {
  return prisma.booking.findUnique({
    select: { id: true, Room: true },
    where: { userId },
  });
}

async function countByRoom(roomId: number) {
  return prisma.booking.count({
    where: { roomId },
  });
}

async function create(roomId: number, userId: number) {
  return prisma.booking.create({
    data: { roomId, userId },
  });
}

export const bookingRepository = { findByUser, countByRoom, create };
