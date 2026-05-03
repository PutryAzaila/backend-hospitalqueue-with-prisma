import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";

let io: SocketServer;

export function initSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client terhubung: ${socket.id}`);
    socket.on("join:service", (serviceId: number) => {
      const room = `service:${serviceId}`;
      socket.join(room);
      console.log(`📺 ${socket.id} bergabung ke room ${room}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client terputus: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): SocketServer {
  if (!io) {
    throw new Error("Socket.IO belum diinisialisasi!");
  }
  return io;
}

export function emitQueueUpdated(serviceId?: number, data?: unknown): void {
  if (!io) return;

  if (serviceId) {
    io.to(`service:${serviceId}`).emit("queue:updated", data);
  } else {
    io.emit("queue:updated", data);
  }
}