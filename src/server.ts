/* eslint-disable @typescript-eslint/no-explicit-any */
import app from "./app";
import config from "./app/config";
import mongoose from "mongoose";
import { Server } from "http";
import seedSuperAdmin from "./app/DB";
import { applyMonthlyInterests } from "./app/utils/updateInterest";
import cron from "node-cron";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("Database connected successfully");

    // Don't block the startup with these
    seedSuperAdmin().catch((err) =>
      console.error("Super admin seeding error:", err),
    );

    cron.schedule("0 0 * * *", async () => {
      console.log("🎯 Running yearly compound interest job...");
      try {
        await applyMonthlyInterests();
        console.log("✅ Yearly compound interest applied.");
      } catch (error) {
        console.log("Interest update faild", error);
      }
    });

    server = app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

main();

process.on("unhandledRejection", (reason: any, promise) => {
  console.error("💥 Unhandled Rejection detected:");
  console.error("👉 Reason:", reason);
  console.error("👉 Promise:", promise);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", () => {
  console.log("uncaughtException detected.. shutting down");
  process.exit(1);
});
