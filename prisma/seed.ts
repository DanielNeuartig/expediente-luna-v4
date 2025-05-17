// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import perfiles from './perfiles_seed.json'
import mascotas from './mascotas_seed.json'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Insertando perfiles...')

  // Insertar perfiles y guardar los ID
  const perfilesCreados = await prisma.perfil.createMany({
    data: perfiles,
    skipDuplicates: true, // por si lo ejecutas varias veces
  })

  console.log(`✅ ${perfilesCreados.count} perfiles insertados.`)

  // Relacionar mascotas con perfil
  console.log('🐾 Insertando mascotas...')
  const perfilesEnDB = await prisma.perfil.findMany({
    select: { id: true },
  })

  let perfilIndex = 0
  for (const mascota of mascotas) {
    const perfilAsignado = perfilesEnDB[perfilIndex % perfilesEnDB.length]
    await prisma.mascota.create({
      data: {
        ...mascota,
        perfil: {
          connect: { id: perfilAsignado.id },
        },
      },
    })
    if (Math.random() > 0.5) perfilIndex++ // entre 2 y 5 mascotas por perfil
  }

  console.log('✅ Mascotas insertadas.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })