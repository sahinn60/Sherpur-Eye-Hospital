import { config } from "./config/env";
import app from "./app";
import { prisma } from "./config/database";

async function main() {
  // Verify DB connection
  await prisma.$connect();
  console.log("✅ Database connected");

  app.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
    console.log(`   Environment: ${config.env}`);
  });
}

main().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
