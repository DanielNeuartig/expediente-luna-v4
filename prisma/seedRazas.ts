// prisma/seedRazas.ts
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

const razasCaninas: Prisma.RazaCreateManyInput[] = [
  { nombre: 'Sin especificar', especie: 'CANINO' },
  { nombre: 'Mix', especie: 'CANINO' },
  { nombre: 'Chihuahua', especie: 'CANINO' },
  { nombre: 'Pug', especie: 'CANINO' },
  { nombre: 'Labrador Retriever', especie: 'CANINO' },
  { nombre: 'Golden Retriever', especie: 'CANINO' },
  { nombre: 'Pastor Alemán', especie: 'CANINO' },
  { nombre: 'Schnauzer Miniatura', especie: 'CANINO' },
  { nombre: 'French Poodle', especie: 'CANINO' },
  { nombre: 'Yorkshire Terrier', especie: 'CANINO' },
  { nombre: 'Shih Tzu', especie: 'CANINO' },
  { nombre: 'Dachshund', especie: 'CANINO' },
  { nombre: 'Maltés', especie: 'CANINO' },
  { nombre: 'Beagle', especie: 'CANINO' },
  { nombre: 'Rottweiler', especie: 'CANINO' },
  { nombre: 'Doberman', especie: 'CANINO' },
  { nombre: 'Bulldog Francés', especie: 'CANINO' },
  { nombre: 'Bulldog Inglés', especie: 'CANINO' },
  { nombre: 'Border Collie', especie: 'CANINO' },
  { nombre: 'Boxer', especie: 'CANINO' },
  { nombre: 'Siberian Husky', especie: 'CANINO' },
  { nombre: 'Akita Inu', especie: 'CANINO' },
  { nombre: 'Samoyedo', especie: 'CANINO' },
  { nombre: 'Weimaraner', especie: 'CANINO' },
  { nombre: 'Cocker Spaniel Inglés', especie: 'CANINO' },
  { nombre: 'Scottish Terrier', especie: 'CANINO' },
  { nombre: 'Pomerania', especie: 'CANINO' },
  { nombre: 'Boston Terrier', especie: 'CANINO' },
  { nombre: 'Jack Russell Terrier', especie: 'CANINO' },
  { nombre: 'Cane Corso', especie: 'CANINO' },
  { nombre: 'Gran Danés', especie: 'CANINO' },
  { nombre: 'Basset Hound', especie: 'CANINO' },
  { nombre: 'Setter Irlandés', especie: 'CANINO' },
  { nombre: 'Dálmata', especie: 'CANINO' },
  { nombre: 'Shar Pei', especie: 'CANINO' },
]

const razasFelinas: Prisma.RazaCreateManyInput[] = [
  { nombre: 'Sin especificar', especie: 'FELINO' },
  { nombre: 'Mix', especie: 'FELINO' },
  { nombre: 'Siamés', especie: 'FELINO' },
  { nombre: 'Persa', especie: 'FELINO' },
  { nombre: 'Maine Coon', especie: 'FELINO' },
  { nombre: 'Bengalí', especie: 'FELINO' },
  { nombre: 'British Shorthair', especie: 'FELINO' },
  { nombre: 'Ragdoll', especie: 'FELINO' },
  { nombre: 'Esfinge', especie: 'FELINO' },
  { nombre: 'Abisinio', especie: 'FELINO' },
  { nombre: 'Oriental de Pelo Corto', especie: 'FELINO' },
  { nombre: 'Himalayo', especie: 'FELINO' },
  { nombre: 'Azul Ruso', especie: 'FELINO' },
  { nombre: 'Scottish Fold', especie: 'FELINO' },
  { nombre: 'Bosque de Noruega', especie: 'FELINO' },
  { nombre: 'Exótico de Pelo Corto', especie: 'FELINO' },
  { nombre: 'Cornish Rex', especie: 'FELINO' },
  { nombre: 'Devon Rex', especie: 'FELINO' },
  { nombre: 'Manx', especie: 'FELINO' },
  { nombre: 'Balinés', especie: 'FELINO' },
  { nombre: 'Turco Van', especie: 'FELINO' },
]

const otrasRazas: Prisma.RazaCreateManyInput[] = [
  { nombre: 'Sin especificar', especie: 'AVE_PSITACIDA' },
  { nombre: 'Sin especificar', especie: 'AVE_OTRA' },
  { nombre: 'Sin especificar', especie: 'OFIDIO' },
  { nombre: 'Sin especificar', especie: 'QUELONIO' },
  { nombre: 'Sin especificar', especie: 'LAGARTIJA' },
  { nombre: 'Sin especificar', especie: 'ROEDOR' },
  { nombre: 'Sin especificar', especie: 'LAGOMORFO' },
  { nombre: 'Sin especificar', especie: 'HURON' },
  { nombre: 'Sin especificar', especie: 'PORCINO' },
  { nombre: 'Sin especificar', especie: 'OTRO' },
]

async function main() {
  await prisma.raza.createMany({
    data: [...razasCaninas, ...razasFelinas, ...otrasRazas],
    skipDuplicates: true,
  })

  console.log('✅ Razas insertadas correctamente.')
}

main()
  .catch((e) => {
    console.error('❌ Error al poblar razas:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })