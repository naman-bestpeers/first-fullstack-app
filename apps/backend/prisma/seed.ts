import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'naman@example.com',
      name: 'Naman Patel',
    },
  });
}

main().finally(() => prisma.$disconnect());
