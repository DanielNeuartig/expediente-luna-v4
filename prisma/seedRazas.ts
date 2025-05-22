import { PrismaClient, Especie } from "@prisma/client";
const prisma = new PrismaClient();

const razasPerros = [
  "SIN ESPECIFICAR",
  "Chihuahua",
  "Labrador Retriever",
  "French Bulldog",
  "Schnauzer",
  "Pug",
  "Dachshund",
  "Shih Tzu",
  "Poodle",
  "Bulldog Inglés",
  "Pitbull",
  "Golden Retriever",
  "Yorkshire Terrier",
  "Cocker Spaniel",
  "Pastor Alemán",
  "Rottweiler",
  "Beagle",
  "Boxer",
  "Maltés",
  "Border Collie",
  "Pastor Belga",
  "Siberian Husky",
  "Boston Terrier",
  "Bóxer",
  "Doberman",
  "Pastor Shetland",
  "West Highland White Terrier",
  "Gran Danés",
  "Dálmata",
  "Bulldog Francés",
  "Basset Hound",
  "Lhasa Apso",
  "Pomerania",
  "Scottish Terrier",
  "Bichón Frisé",
  "Weimaraner",
  "Samoyedo",
  "Akita Inu",
  "Setter Irlandés",
  "Airedale Terrier",
  "Shar Pei",
  "Collie",
  "Pointer",
  "Fox Terrier",
  "Salchicha",
  "Chow Chow",
  "San Bernardo",
  "Terranova",
  "Pekinés",
  "Basenji",
  "Papillón",
  "MIX"
  // Puedes agregar más razas si lo deseas...
];

const razasGatos = [
  "SIN ESPECIFICAR",
  "Doméstico de pelo corto",
  "Siamés",
  "Persa",
  "Bengala",
  "Maine Coon",
  "Angora",
  "Ragdoll",
  "Azul Ruso",
  "Abisinio",
  "British Shorthair",
  "Esfinge (Sphynx)",
  "Bombay",
  "Scottish Fold",
  "Himalayo",
  "Siberiano",
  "Manx",
  "Exótico",
  "Devon Rex",
  "Savannah",
  "Oriental",
  "MIX"
  // Puedes agregar más razas si lo deseas...
];

const especiesExtras: Especie[] = [
  "AVE_PSITACIDA",
  "AVE_OTRA",
  "OFIDIO",
  "QUELONIO",
  "LAGARTIJA",
  "ROEDOR",
  "LAGOMORFO",
  "HURON",
  "PORCINO",
];

async function main() {
  // Perros
  for (const nombre of razasPerros) {
    await prisma.raza.upsert({
      where: { nombre_especie: { nombre, especie: Especie.CANINO } },
      update: {},
      create: { nombre, especie: Especie.CANINO }
    });
  }
  // Gatos
  for (const nombre of razasGatos) {
    await prisma.raza.upsert({
      where: { nombre_especie: { nombre, especie: Especie.FELINO } },
      update: {},
      create: { nombre, especie: Especie.FELINO }
    });
  }
  // Otras especies: solo SIN ESPECIFICAR
  for (const especie of especiesExtras) {
    await prisma.raza.upsert({
      where: { nombre_especie: { nombre: "SIN ESPECIFICAR", especie } },
      update: {},
      create: { nombre: "SIN ESPECIFICAR", especie }
    });
  }
  console.log("✅ Razas cargadas exitosamente");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});