const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient();

exports.getUserAppointments = async userId => {
  const appointments = await prisma.appointment.findMany({
    where: { userId: parseInt(userId) },
    include: { timeBlock: true }
  });
  if (!appointments || appointments.length === 0) {
    throw new Error('No appointments found for this user');
  }
  return appointments;
};