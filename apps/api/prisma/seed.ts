import { PrismaClient, Role, TxStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const merchant = await prisma.merchant.upsert({
    where: { id: 'seed-ignore' },
    update: {},
    create: { id: undefined as any, name: 'Demo Coffee', email: 'owner@demo.coffee' }
  }).catch(async () => {
    return prisma.merchant.create({ data: { name: 'Demo Coffee', email: 'owner@demo.coffee' } });
  });

  const pass = await bcrypt.hash('Owner123!#', 10);
  await prisma.user.upsert({
    where: { email: 'owner@mb.local' },
    update: {},
    create: { email: 'owner@mb.local', passwordHash: pass, name: 'Owner One', role: Role.MERCHANT_OWNER, merchantId: merchant.id }
  });

  await prisma.transaction.createMany({
    data: Array.from({ length: 15 }).map((_, i) => ({
      merchantId: merchant.id,
      amountCents: 1000 + i * 137,
      currency: 'EUR',
      status: i % 5 === 0 ? TxStatus.FAILED : TxStatus.CAPTURED,
      reference: `TX-${1000 + i}`
    }))
  });
}

main().finally(() => prisma.$disconnect());
