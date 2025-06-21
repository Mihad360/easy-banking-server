import express, { Application } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import { stripeWebhookHandler } from "./app/utils/stripeWebhookHandler";
const app: Application = express();

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler,
);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://easy-banking-client.vercel.app",
      // "http://localhost:3000",
    ],
    credentials: true,
  }),
);

app.use("/api/v1", router);

// const test = async (req: Request, res: Response) => {
//   const a = 10;
//   res.send(a);
// };

app.get("/", (req, res) => {
  res.send("Easy Bank is running");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
