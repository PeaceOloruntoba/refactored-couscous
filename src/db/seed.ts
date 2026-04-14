import "dotenv/config";
// import { query } from "./pool.js";
import { logger } from "../config/logger.js";
// import bcrypt from "bcryptjs";

async function main() {
  logger.info("Starting seed...");
  // Clear existing data

  logger.info("Seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
