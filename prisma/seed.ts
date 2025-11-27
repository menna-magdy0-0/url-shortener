import { PrismaClient, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with 100 short URLs...');

  const records: Prisma.ShortUrlCreateManyInput[] = [];

  for (let i = 0; i < 1000000; i++) {
    records.push({
      url: faker.internet.url(),
      shortCode: nanoid(10),
      accessCount: faker.number.int({ min: 0, max: 200 }),
    });
  }

  await prisma.shortUrl.createMany({
    data: records,
    skipDuplicates: true,
  });

  console.log('✅ Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
