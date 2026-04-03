// 1. THIS MUST BE THE VERY FIRST LINE
process.env.DATABASE_URL = "postgresql://postgres.nfgumsmurnsmaxhxqwml:jengaPass2026@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

import { PrismaClient, Level, Role } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

// 2. Initialize with NO arguments to avoid the constructor error
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Seeding (Forced Environment Mode)...");

  // --- Seed Test Users ---
  const testUsers = [
    { email: "admin@jenga.com", name: "Admin", role: Role.ADMIN, isPro: true },
    { email: "samplePro@jenga.com", name: "SamplePro", role: Role.NORMAL, isPro: true },
    { email: "sampleNormal@jenga.com", name: "SampleNonePaid", role: Role.NORMAL, isPro: false },
  ];

  for (const u of testUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { role: u.role, isPro: u.isPro },
      create: u,
    });
  }
  console.log("✅ Users seeded.");

  // --- Parse CSV ---
  const csvFilePath = path.resolve(__dirname, 'seed_data.csv');
  const csvFile = fs.readFileSync(csvFilePath, 'utf-8');
  const { data } = Papa.parse(csvFile, { header: true, skipEmptyLines: true });

  console.log(`📊 Seeding ${data.length} quizzes...`);

  for (const row of data as any[]) {
    await prisma.jengaBlock.upsert({
      where: { id: row.blockId },
      update: { category: row.category },
      create: { 
        id: row.blockId, 
        physicalId: parseInt(row.physicalId),
        category: row.category 
      },
    });

    await prisma.quiz.upsert({
      where: { id: row.id },
      update: {
        question: row.question,
        options: JSON.parse(row.options),
        answer: JSON.parse(row.answer),
        level: row.level as Level,
        subIndex: parseInt(row.subIndex),
        isPremium: row.isPremium === 'TRUE',
      },
      create: {
        id: row.id,
        question: row.question,
        options: JSON.parse(row.options),
        answer: JSON.parse(row.answer),
        level: row.level as Level,
        subIndex: parseInt(row.subIndex),
        isPremium: row.isPremium === 'TRUE',
        blockId: row.blockId,
      },
    });
  }
  console.log("✨ Done.");
}

main().catch(console.error).finally(() => prisma.$disconnect());