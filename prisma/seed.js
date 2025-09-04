const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const demoUsers = [
    {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password1',
      role: 'ADMIN',
    },
    {
      name: 'Bob',
      email: 'bob@example.com',
      password: 'password2',
      role: 'USER',
    },
    {
      name: 'Charlie',
      email: 'charlie@example.com',
      password: 'password3',
      role: 'USER',
    },
    {
      name: 'Diana',
      email: 'diana@example.com',
      password: 'password4',
      role: 'USER',
    },
    {
      name: 'Eve',
      email: 'eve@example.com',
      password: 'password5',
      role: 'ADMIN',
    },
  ];

  await prisma.user.createMany({
    data: demoUsers,
    skipDuplicates: true,
  });

  console.log('Usuarios de demostración creados con éxito');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });