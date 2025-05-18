import app from "./app";
import config from "./app/config";
import mongoose from "mongoose";
import { Server } from "http";
import seedSuperAdmin from "./app/DB";
import { generateCustomerId } from "./app/modules/User/user.utils";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    seedSuperAdmin();
    // generateCustomerId()
    server = app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`);
      console.log("Connected Successfully !!!");
    });
  } catch (error) {
    if (error) {
      console.log(error, "something went wrong");
    }
  }
}

main();

// process.on("unhandledRejection", () => {
//   console.log("unhandleRejection detected.. shutting down");
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1);
// });

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
