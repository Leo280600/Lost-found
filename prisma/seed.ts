import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Item categories are now a fixed Prisma enum (ItemCategory) rather than
  // database rows — see lib/categories.ts for the canonical list, so there
  // is nothing to seed here anymore.

  const adminPassword = await bcrypt.hash("Admin@12345", 10);
  await prisma.user.upsert({
    where: { email: "admin@university.ac.th" },
    update: {},
    create: {
      email: "admin@university.ac.th",
      password: adminPassword,
      name: "System Admin",
      role: "ADMIN",
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
