const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient();

exports.getUserAppointments = async userId => {
  return await prisma.appointment.findMany({
    where: { userId: parseInt(userId) },
    include: { timeBlock: true }
  });
};