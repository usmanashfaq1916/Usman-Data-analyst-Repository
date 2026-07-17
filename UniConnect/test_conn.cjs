process.env.DATABASE_URL = "postgresql://neondb_owner:npg_maGu29OxnUli@ep-bitter-smoke-av8t55yl-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

async function test() {
  const adapter = new PrismaPg();
  const prisma = new PrismaClient({ adapter });
  try {
    await prisma.$connect();
    const result = await prisma.$queryRawUnsafe("SELECT current_database(), current_user, version()");
    console.log("RESULT:", JSON.stringify(result, null, 2));
  } catch (e) {
    console.log("ERROR:", e.message);
    console.log("STACK:", e.stack);
  } finally {
    await prisma.$disconnect();
  }
}
test();
