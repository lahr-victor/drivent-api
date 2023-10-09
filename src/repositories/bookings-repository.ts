import { prisma } from '@/config';

async function findByUser(userId: number) {
  return prisma.booking.findUnique({
    select: { id: true, Room: true },
    where: { userId },
  });
}

export const bookingRepository = { findByUser };
