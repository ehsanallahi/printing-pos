const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const plainPassword = 'admin123';

  // Hash the password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Delete existing user to avoid conflicts
  await prisma.user.delete({ where: { email } }).catch(() => {});

  // Create the new admin user
  const user = await prisma.user.create({
    data: {
      email,
      hashedPassword,
    },
  });
  console.log(`Created admin user: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });