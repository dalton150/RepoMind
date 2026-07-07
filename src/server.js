import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";
import { connectDB } from "./database/mongodb.js";
import ingestRoutes from "./routes/ingest.routes.js";
import { config } from "./config/runtime.config.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/ingest", ingestRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

app.listen(config.port, () => {
  connectDB();
  console.log(`Server running on http://localhost:${config.port}`);
});
