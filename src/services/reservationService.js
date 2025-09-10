const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

exports.createReservation = async (data) => {
  const conflict = await prisma.appointment.findFirst({
    where: {
      date: data.date,
      timeBlockId: data.timeBlockId
    }
  });
  if (conflict) {
    throw new Error('Conflict: Appointment already exists');
  }
  return await prisma.appointment.create({ data });
}

exports.getReservation = async (id) => {
  return await prisma.appointment.findUnique({
    where: { id: parseInt(id) },
    include: { user: true, timeBlock: true }
  });
}

exports.updateReservation = async (id, data) => {
  const conflict = await prisma.appointment.findFirst({ where: {
    date: data.date,
    timeBlockId: data.timeBlockId,
    id: { not : parseInt(id, 10) }
  }});
  if (conflict) {
    throw new Error('Conflict: Appointment already exists');
  }
  return await prisma.appointment.update({
    where: { id: parseInt(id, 10) },
    data
  });
}

exports.deleteReservation = async (id) => {
  return await prisma.appointment.delete({
    where: { id: parseInt(id, 10) }
  });
}