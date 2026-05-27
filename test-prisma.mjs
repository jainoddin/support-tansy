import prisma from './src/lib/prisma.js';

async function main() {
  try {
    const images = await prisma.image.findMany();
    console.log("Success! Found", images.length, "images");
  } catch (error) {
    console.error("Prisma error:", error);
  }
}
main();
