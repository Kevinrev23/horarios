import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const branches = [
    "plaza",
    "jardin",
    "la 39",
    "guaduales",
    "floraria",
    "palmira",
    "bogota",
    "chia",
    "floresta",
    "calle5ta",
  ];

  console.log("⏳ Creando sedes y usuarios...");

  for (const branchName of branches) {
    const branch = await prisma.branch.create({
      data: { name: branchName },
    });

    const clean = branchName.replace(/\s+/g, "");

    // ADMIN
    await prisma.user.create({
      data: {
        name: `Administrador ${branchName}`,
        username: `admin_${clean}`,
        passwordHash: "123456",
        role: UserRole.ADMIN,
        branchId: branch.id,
      },
    });

    // SUPERVISOR
    await prisma.user.create({
      data: {
        name: `Supervisor ${branchName}`,
        username: `super_${clean}`,
        passwordHash: "123456",
        role: UserRole.SUPERVISOR,
        branchId: branch.id,
      },
    });

    console.log(`✔ ${branchName} creada con usuarios admin y supervisor`);
  }

  console.log("🎉 Seed completado correctamente");
}

main()
  .catch((err) => {
    console.error("❌ Error en seed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
