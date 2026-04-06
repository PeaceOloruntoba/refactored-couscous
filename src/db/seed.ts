import "dotenv/config";
// import { query } from "./pool.js";
import { logger } from "../config/logger.js";

async function main() {
  logger.info("Starting seed...");

  // Seed...

  logger.info({ count: 0 }, "Seeded data");

  logger.info("Seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});