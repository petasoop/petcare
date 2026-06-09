import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const salt = await bcrypt.genSalt(10)

  const adminPass = await bcrypt.hash('Admin123!', salt)
  const dokterPass = await bcrypt.hash('Dokter123!', salt)
  const pelangganPass = await bcrypt.hash('Pelanggan123!', salt)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@klinik.com' },
    update: {},
    create: {
      name: 'Admin Klinik',
      email: 'admin@klinik.com',
      password: adminPass,
      role: 'ADMIN',
      phone: '081234567890'
    }
  })

  const dokter1 = await prisma.user.upsert({
    where: { email: 'dokter1@klinik.com' },
    update: {},
    create: {
      name: 'Dr. Budi',
      email: 'dokter1@klinik.com',
      password: dokterPass,
      role: 'DOKTER',
      phone: '081111111111'
    }
  })

  const dokter2 = await prisma.user.upsert({
    where: { email: 'dokter2@klinik.com' },
    update: {},
    create: {
      name: 'Dr. Siti',
      email: 'dokter2@klinik.com',
      password: dokterPass,
      role: 'DOKTER',
      phone: '082222222222'
    }
  })

  const pelanggan1 = await prisma.user.upsert({
    where: { email: 'pelanggan1@klinik.com' },
    update: {},
    create: {
      name: 'Andi',
      email: 'pelanggan1@klinik.com',
      password: pelangganPass,
      role: 'PELANGGAN',
      phone: '083333333333'
    }
  })

  const pelanggan2 = await prisma.user.upsert({
    where: { email: 'pelanggan2@klinik.com' },
    update: {},
    create: {
      name: 'Bina',
      email: 'pelanggan2@klinik.com',
      password: pelangganPass,
      role: 'PELANGGAN',
      phone: '083444444444'
    }
  })

  const pelanggan3 = await prisma.user.upsert({
    where: { email: 'pelanggan3@klinik.com' },
    update: {},
    create: {
      name: 'Cici',
      email: 'pelanggan3@klinik.com',
      password: pelangganPass,
      role: 'PELANGGAN',
      phone: '083555555555'
    }
  })

  // sample pets
  const hewan1 = await prisma.hewan.create({
    data: {
      nama: 'Milo',
      jenis: 'ANJING',
      ras: 'Labrador',
      tanggalLahir: new Date('2020-06-01'),
      beratBadan: 25.5,
      pelangganId: pelanggan1.id
    }
  })

  const hewan2 = await prisma.hewan.create({
    data: {
      nama: 'Kitty',
      jenis: 'KUCING',
      ras: 'Persia',
      tanggalLahir: new Date('2021-03-10'),
      beratBadan: 4.2,
      pelangganId: pelanggan2.id
    }
  })

  // sample appointments
  await prisma.appointment.createMany({
    data: [
      {
        pelangganId: pelanggan1.id,
        hewanId: hewan1.id,
        dokterId: dokter1.id,
        tanggal: new Date(),
        waktu: '09:00',
        jenis: 'PEMERIKSAAN',
        keluhan: 'Batuk dan bersin'
      },
      {
        pelangganId: pelanggan2.id,
        hewanId: hewan2.id,
        dokterId: dokter2.id,
        tanggal: new Date(),
        waktu: '11:00',
        jenis: 'VAKSINASI',
        keluhan: 'Vaksin tahunan'
      }
    ]
  })

  // jadwal dokter
  await prisma.jadwalDokter.createMany({
    data: [
      {
        dokterId: dokter1.id,
        hari: 'SENIN',
        jamMulai: '08:00',
        jamSelesai: '12:00'
      },
      {
        dokterId: dokter2.id,
        hari: 'SELASA',
        jamMulai: '13:00',
        jamSelesai: '17:00'
      }
    ]
  })

  // inventory
  await prisma.inventory.createMany({
    data: [
      { namaItem: 'Paracetamol', kategori: 'OBAT', stok: 100, satuan: 'tablet', harga: 5000, stokMinimal: 10 },
      { namaItem: 'Sarung Tangan', kategori: 'KONSUMABLE', stok: 200, satuan: 'pcs', harga: 2000, stokMinimal: 20 }
    ]
  })

  // artikel
  await prisma.artikel.create({
    data: {
      judul: 'Cara Merawat Kucing Anggora',
      slug: 'cara-merawat-kucing-anggora',
      konten: 'Konten contoh artikel tentang perawatan kucing Anggora.',
      isPublished: true
    }
  })

  // konten landing
  await prisma.kontenLanding.createMany({
    data: [
      { section: 'hero', key: 'tagline', value: 'Kesehatan Hewan Peliharaan Anda, Prioritas Kami' }
    ]
  })

  console.log({ admin: admin.email, dokter1: dokter1.email, pelanggan1: pelanggan1.email })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
