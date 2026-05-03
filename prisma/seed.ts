import { PrismaClient, ServiceType, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai proses seeding...");

  // ─── Seed Layanan ─────────────────────────────────────────
  const services = [
    { name: "Pendaftaran", code: "PD", type: ServiceType.PENDAFTARAN },
    { name: "Poli Umum", code: "UM", type: ServiceType.POLI },
    { name: "Poli Anak", code: "AN", type: ServiceType.POLI },
    { name: "Poli Gigi", code: "GG", type: ServiceType.POLI },
    { name: "Laboratorium", code: "LB", type: ServiceType.LAB },
    { name: "Farmasi", code: "FM", type: ServiceType.FARMASI },
    { name: "IGD", code: "IGD", type: ServiceType.IGD },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { code: service.code },
      update: {},
      create: service,
    });
  }
  console.log("✅ Layanan berhasil di-seed");

  // ─── Seed User Admin ───────────────────────────────────────
  // Password di-hash dengan bcrypt sebelum disimpan ke database
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@hospital.local" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@hospital.local",
      passwordHash: hashedPassword,
      role: UserRole.SUPER_ADMIN,
    },
  });
  console.log("✅ User admin berhasil di-seed");

  console.log("🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });