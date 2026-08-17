import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.info(' Starting database seed...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.document.deleteMany();
  await prisma.request.deleteMany();
  await prisma.service.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  console.info(' Cleaned existing data');

  // Create Departments
  const interior = await prisma.department.create({
    data: {
      name: 'Ministry of Interior',
      nameFa: 'وزارت امور داخله',
      description: 'Handles passports, national IDs, and citizen registration',
      descriptionFa: 'مسئول گذرنامه، تذکره و ثبت احوال شهروندان',
      code: 'MOI',
    },
  });

  const commerce = await prisma.department.create({
    data: {
      name: 'Ministry of Commerce',
      nameFa: 'وزارت تجارت و صنایع',
      description: 'Handles business licenses and trade regulations',
      descriptionFa: 'مسئول جواز کسب و مقررات تجاری',
      code: 'MOC',
    },
  });

  const health = await prisma.department.create({
    data: {
      name: 'Ministry of Health',
      nameFa: 'وزارت صحت عامه',
      description: 'Health services and medical certifications',
      descriptionFa: 'خدمات صحی و تصدیق‌های طبی',
      code: 'MOH',
    },
  });

  console.info(' Created departments');

  // Create Services
  await prisma.service.createMany({
    data: [
      {
        name: 'Passport Renewal',
        nameFa: 'تمدید گذرنامه',
        description: 'Renew your existing passport',
        descriptionFa: 'تمدید گذرنامه فعلی',
        fee: 5000,
        processingDays: 14,
        departmentId: interior.id,
      },
      {
        name: 'National ID Card Update',
        nameFa: 'به‌روزرسانی تذکره',
        description: 'Update your national ID information',
        descriptionFa: 'به‌روزرسانی اطلاعات تذکره',
        fee: 1500,
        processingDays: 7,
        departmentId: interior.id,
      },
      {
        name: 'Business License Application',
        nameFa: 'درخواست جواز کسب',
        description: 'Apply for a new business license',
        descriptionFa: 'درخواست جواز کسب جدید',
        fee: 10000,
        processingDays: 21,
        departmentId: commerce.id,
      },
      {
        name: 'Trade Certificate',
        nameFa: 'تصدیق تجاری',
        description: 'Get a trade certificate',
        descriptionFa: 'دریافت تصدیق تجاری',
        fee: 3000,
        processingDays: 10,
        departmentId: commerce.id,
      },
      {
        name: 'Medical Certificate',
        nameFa: 'تصدیق صحی',
        description: 'Request a medical certificate',
        descriptionFa: 'درخواست تصدیق صحی',
        fee: 500,
        processingDays: 3,
        departmentId: health.id,
      },
    ],
  });

  console.info(' Created services');

  // Create Users
  const hashedPassword = await bcrypt.hash('Password123!', 12);

  await prisma.user.create({
    data: {
      email: 'admin@egov.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: Role.ADMIN,
      isEmailVerified: true,
      phone: '+93700000001',
    },
  });

  await prisma.user.create({
    data: {
      email: 'officer@egov.com',
      password: hashedPassword,
      name: 'Interior Officer',
      role: Role.OFFICER,
      departmentId: interior.id,
      jobTitle: 'Senior Officer',
      isEmailVerified: true,
      phone: '+93700000002',
    },
  });

  await prisma.user.create({
    data: {
      email: 'head@egov.com',
      password: hashedPassword,
      name: 'Commerce Department Head',
      role: Role.HEAD,
      departmentId: commerce.id,
      jobTitle: 'Department Head',
      isEmailVerified: true,
      phone: '+93700000003',
    },
  });

  await prisma.user.create({
    data: {
      email: 'citizen@egov.com',
      password: hashedPassword,
      name: 'John Citizen',
      role: Role.CITIZEN,
      nationalId: '1234567890',
      dateOfBirth: new Date('1990-01-01'),
      phone: '+93700000004',
      isEmailVerified: true,
    },
  });

  console.info(' Created users');
  console.info('');
  console.info(' Database seeded successfully!');
  console.info('');
  console.info(' Sample Login Credentials:');
  console.info('   Admin:   admin@egov.com / Password123!');
  console.info('   Officer: officer@egov.com / Password123!');
  console.info('   Head:    head@egov.com / Password123!');
  console.info('   Citizen: citizen@egov.com / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
