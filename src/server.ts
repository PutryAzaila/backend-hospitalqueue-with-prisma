import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { initSocket } from "./socket";

import serviceRoutes from "./routes/service.routes";
import patientRoutes from "./routes/patient.routes";
import queueRoutes from "./routes/queue.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Sistem Antrian Rumah Sakit",
    version: "1.0.0",
    endpoints: {
      services: "/api/services",
      patients: "/api/patients",
      queues: "/api/queues",
    },
  });
});

app.use("/api/services", serviceRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/queues", queueRoutes);


const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

export default app;