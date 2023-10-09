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

async function update(roomId: number, id: number) {
  return prisma.booking.update({
    data: { roomId, updatedAt: new Date(Date.now()) },
    where: { id },
  });
}

export const bookingRepository = { findByUser, countByRoom, create, update };
