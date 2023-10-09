import faker from '@faker-js/faker';
import { generateCPF } from '@brazilian-utils/brazilian-utils';

import { Address, Enrollment, Room, Ticket, TicketStatus, TicketType } from '@prisma/client';
import { bookingRepository, enrollmentRepository, hotelRepository, ticketsRepository } from '@/repositories';
import { bookingService } from '@/services';
import { forbiddenError } from '@/errors/forbidden-error';
import { notFoundError } from '@/errors';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('upsert booking unit tests', () => {
  it('should throw an error when user has no booking', async () => {
    const userId = faker.datatype.number();

    jest.spyOn(bookingRepository, 'findByUser').mockResolvedValueOnce(undefined);

    const promise = bookingService.getByUser(userId);
    expect(promise).rejects.toEqual(notFoundError());
  });
});

describe('validate booking unit tests', () => {
  it('should throw an error when room does not exist', async () => {
    const userId = faker.datatype.number();
    const roomId = faker.datatype.number();

    jest.spyOn(hotelRepository, 'findRoom').mockResolvedValueOnce(undefined);

    const promise = bookingService.create(roomId, userId);
    expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should throw an error when bookings are larger or equal to room capacity', async () => {
    const userId = faker.datatype.number();
    const hotelId = faker.datatype.number();
    const mockRoom: Room = {
      id: faker.datatype.number(),
      name: faker.animal.bird(),
      capacity: faker.datatype.number({ min: 2, max: 4 }),
      hotelId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockBookings = faker.datatype.number({ min: mockRoom.capacity });

    jest.spyOn(hotelRepository, 'findRoom').mockResolvedValueOnce(mockRoom);
    jest.spyOn(bookingRepository, 'countByRoom').mockResolvedValueOnce(mockBookings);

    const promise = bookingService.create(mockRoom.id, userId);
    expect(promise).rejects.toEqual(forbiddenError());
  });

  it('should throw an error when enrollment does not exist', async () => {
    const userId = faker.datatype.number();
    const hotelId = faker.datatype.number();
    const mockRoom: Room = {
      id: faker.datatype.number(),
      name: faker.animal.bird(),
      capacity: faker.datatype.number({ min: 2, max: 4 }),
      hotelId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockBookings = 1;

    jest.spyOn(hotelRepository, 'findRoom').mockResolvedValueOnce(mockRoom);
    jest.spyOn(bookingRepository, 'countByRoom').mockResolvedValueOnce(mockBookings);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(undefined);

    const promise = bookingService.create(mockRoom.id, userId);
    expect(promise).rejects.toEqual(forbiddenError());
  });

  it('should throw an error when ticket does not exist', async () => {
    const userId = faker.datatype.number();
    const hotelId = faker.datatype.number();
    const mockRoom: Room = {
      id: faker.datatype.number(),
      name: faker.animal.bird(),
      capacity: faker.datatype.number({ min: 2, max: 4 }),
      hotelId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockBookings = 1;
    const mockEnrollment: Enrollment & { Address: Address[] } = {
      id: faker.datatype.number(),
      name: faker.name.findName(),
      cpf: generateCPF(),
      birthday: faker.date.past(),
      phone: faker.phone.phoneNumber('(##) 9####-####'),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [],
    };

    jest.spyOn(hotelRepository, 'findRoom').mockResolvedValueOnce(mockRoom);
    jest.spyOn(bookingRepository, 'countByRoom').mockResolvedValueOnce(mockBookings);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(undefined);

    const promise = bookingService.create(mockRoom.id, userId);
    expect(promise).rejects.toEqual(forbiddenError());
  });

  it('should throw an error when ticket is reserved', async () => {
    const userId = faker.datatype.number();
    const hotelId = faker.datatype.number();
    const mockRoom: Room = {
      id: faker.datatype.number(),
      name: faker.animal.bird(),
      capacity: faker.datatype.number({ min: 2, max: 4 }),
      hotelId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockBookings = 1;
    const mockEnrollment: Enrollment & { Address: Address[] } = {
      id: faker.datatype.number(),
      name: faker.name.findName(),
      cpf: generateCPF(),
      birthday: faker.date.past(),
      phone: faker.phone.phoneNumber('(##) 9####-####'),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [],
    };
    const mockTycketType: TicketType = {
      id: faker.datatype.number(),
      name: faker.animal.cat(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockTicket: Ticket & { TicketType: TicketType } = {
      id: faker.datatype.number(),
      ticketTypeId: mockTycketType.id,
      enrollmentId: mockEnrollment.id,
      status: 'RESERVED',
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: mockTycketType,
    };

    jest.spyOn(hotelRepository, 'findRoom').mockResolvedValueOnce(mockRoom);
    jest.spyOn(bookingRepository, 'countByRoom').mockResolvedValueOnce(mockBookings);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);

    const promise = bookingService.create(mockRoom.id, userId);
    expect(promise).rejects.toEqual(forbiddenError());
  });

  it('should throw an error when ticket is remote', async () => {
    const userId = faker.datatype.number();
    const hotelId = faker.datatype.number();
    const mockRoom: Room = {
      id: faker.datatype.number(),
      name: faker.animal.bird(),
      capacity: faker.datatype.number({ min: 2, max: 4 }),
      hotelId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockBookings = 1;
    const mockEnrollment: Enrollment & { Address: Address[] } = {
      id: faker.datatype.number(),
      name: faker.name.findName(),
      cpf: generateCPF(),
      birthday: faker.date.past(),
      phone: faker.phone.phoneNumber('(##) 9####-####'),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [],
    };
    const mockTycketType: TicketType = {
      id: faker.datatype.number(),
      name: faker.animal.cat(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockTicket: Ticket & { TicketType: TicketType } = {
      id: faker.datatype.number(),
      ticketTypeId: mockTycketType.id,
      enrollmentId: mockEnrollment.id,
      status: 'PAID',
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: mockTycketType,
    };

    jest.spyOn(hotelRepository, 'findRoom').mockResolvedValueOnce(mockRoom);
    jest.spyOn(bookingRepository, 'countByRoom').mockResolvedValueOnce(mockBookings);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);

    const promise = bookingService.create(mockRoom.id, userId);
    expect(promise).rejects.toEqual(forbiddenError());
  });

  it('should throw an error when ticket does not include hotel', async () => {
    const userId = faker.datatype.number();
    const hotelId = faker.datatype.number();
    const mockRoom: Room = {
      id: faker.datatype.number(),
      name: faker.animal.bird(),
      capacity: faker.datatype.number({ min: 2, max: 4 }),
      hotelId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockBookings = 1;
    const mockEnrollment: Enrollment & { Address: Address[] } = {
      id: faker.datatype.number(),
      name: faker.name.findName(),
      cpf: generateCPF(),
      birthday: faker.date.past(),
      phone: faker.phone.phoneNumber('(##) 9####-####'),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [],
    };
    const mockTycketType: TicketType = {
      id: faker.datatype.number(),
      name: faker.animal.cat(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockTicket: Ticket & { TicketType: TicketType } = {
      id: faker.datatype.number(),
      ticketTypeId: mockTycketType.id,
      enrollmentId: mockEnrollment.id,
      status: 'PAID',
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: mockTycketType,
    };

    jest.spyOn(hotelRepository, 'findRoom').mockResolvedValueOnce(mockRoom);
    jest.spyOn(bookingRepository, 'countByRoom').mockResolvedValueOnce(mockBookings);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);

    const promise = bookingService.create(mockRoom.id, userId);
    expect(promise).rejects.toEqual(forbiddenError());
  });
});
