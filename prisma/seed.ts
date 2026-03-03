import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import shoesData from "../src/data/seeds/shoes.json";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:password@localhost:5432/running_shoes";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

interface SeedShoe {
  brand: string;
  model: string;
  version: string | null;
  year: number;
  price: number;
  weightG: number;
  dropMm: number;
  stackHeightHeel: number;
  stackHeightFore: number;
  cushionType: string;
  cushionMaterial: string;
  outsoleMaterial: string;
  upperMaterial: string;
  widthOptions: string;
  surfaceType: string;
  pronationType: string;
  category: string;
  durabilityKm: number;
  description: string;
  trainingFit: {
    dailyJog: number;
    paceRun: number;
    interval: number;
    longRun: number;
    race: number;
    recovery: number;
  };
}

async function main() {
  console.log("Seeding database...");

  for (const shoe of shoesData as SeedShoe[]) {
    const { trainingFit, ...shoeData } = shoe;

    const created = await prisma.shoe.upsert({
      where: {
        brand_model: {
          brand: shoeData.brand,
          model: shoeData.model,
        },
      },
      update: { ...shoeData },
      create: { ...shoeData },
    });

    await prisma.trainingFit.upsert({
      where: { shoeId: created.id },
      update: { ...trainingFit },
      create: { shoeId: created.id, ...trainingFit },
    });

    console.log(`  Seeded: ${created.brand} ${created.model}`);
  }

  const count = await prisma.shoe.count();
  console.log(`\nDatabase seeded successfully. Total shoes: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
