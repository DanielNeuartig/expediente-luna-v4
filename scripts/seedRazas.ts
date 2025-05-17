// scripts/seedRazas.ts
import { prisma } from "@/lib/prisma";

async function seedRazas() {
  const razas = [
    { nombre: "Golden Retriever", especie: "CANINO" },
    { nombre: "Pastor Alemán", especie: "CANINO" },
    { nombre: "Chihuahua", especie: "CANINO" },
    { nombre: "Persa", especie: "FELINO" },
    { nombre: "Siames", especie: "FELINO" },
    { nombre: "Sphynx", especie: "FELINO" },
  ];

  try {
    const resultado = await prisma.raza.createMany({
      data: razas,
      skipDuplicates: true, // evita errores si ya existen
    });

    console.log(`✅ Razas insertadas: ${resultado.count}`);
  } catch (err) {
    console.error("❌ Error al insertar razas:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seedRazas();