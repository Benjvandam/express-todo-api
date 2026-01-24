import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

process.on('beforeExit', async () => {
  await prisma.$disconnect();
})

export default prisma;