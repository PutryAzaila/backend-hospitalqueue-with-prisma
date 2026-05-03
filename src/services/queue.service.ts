import prisma from "../config/prisma";
import { PriorityCategory, QueueStatus, QueueEventType } from "@prisma/client";
import { getPriorityLevel } from "../utils/priority";

interface CreateQueueData {
  patientId: number;
  serviceId: number;
  priorityCategory?: PriorityCategory;
  notes?: string;
}

interface UpdateQueueStatusData {
  status: QueueStatus;
  notes?: string;
  counterId?: number;
}

export const QueueService = {
  async generateQueueNumber(serviceId: number): Promise<string> {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) throw new Error("Layanan tidak ditemukan");

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const todayCount = await prisma.queue.count({
      where: {
        serviceId,
        createdAt: { gte: startOfDay, lt: endOfDay },
      },
    });

    const sequence = String(todayCount + 1).padStart(3, "0");
    return `${service.code}-${sequence}`;
  },

  async getAll(filters?: { status?: QueueStatus; serviceId?: number }) {
    return prisma.queue.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.serviceId && { serviceId: filters.serviceId }),
      },
      include: {
        patient: true,
        service: true,
        counter: true,
      },
      orderBy: [{ priorityLevel: "asc" }, { createdAt: "asc" }],
    });
  },

  async getById(id: number) {
    return prisma.queue.findUnique({
      where: { id },
      include: {
        patient: true,
        service: true,
        counter: true,
        events: { orderBy: { createdAt: "asc" } },
      },
    });
  },

  async create(data: CreateQueueData) {
    const priorityCategory = data.priorityCategory ?? PriorityCategory.NORMAL;
    const priorityLevel = getPriorityLevel(priorityCategory);
    const queueNumber = await this.generateQueueNumber(data.serviceId);

    const queue = await prisma.queue.create({
      data: {
        queueNumber,
        patientId: data.patientId,
        serviceId: data.serviceId,
        priorityCategory,
        priorityLevel,
        notes: data.notes,
        status: QueueStatus.WAITING,
        events: {
          create: {
            eventType: QueueEventType.CREATED,
            notes: "Antrian dibuat",
          },
        },
      },
      include: { patient: true, service: true },
    });

    return queue;
  },

  async callNext(serviceId: number, counterId?: number) {
    const nextQueue = await prisma.queue.findFirst({
      where: {
        serviceId,
        status: QueueStatus.WAITING,
      },
      orderBy: [{ priorityLevel: "asc" }, { createdAt: "asc" }],
    });

    if (!nextQueue) return null;

    const updated = await prisma.queue.update({
      where: { id: nextQueue.id },
      data: {
        status: QueueStatus.CALLED,
        calledAt: new Date(),
        counterId: counterId ?? null,
        events: {
          create: {
            eventType: QueueEventType.CALLED,
            notes: "Pasien dipanggil",
          },
        },
      },
      include: { patient: true, service: true, counter: true },
    });

    return updated;
  },

  async updateStatus(id: number, data: UpdateQueueStatusData) {
    const now = new Date();

    const timestampFields: Partial<{
      calledAt: Date;
      servingAt: Date;
      finishedAt: Date;
      cancelledAt: Date;
    }> = {};

    if (data.status === QueueStatus.CALLED) timestampFields.calledAt = now;
    if (data.status === QueueStatus.SERVING) timestampFields.servingAt = now;
    if (data.status === QueueStatus.FINISHED) timestampFields.finishedAt = now;
    if (data.status === QueueStatus.CANCELLED)
      timestampFields.cancelledAt = now;

    const updated = await prisma.queue.update({
      where: { id },
      data: {
        status: data.status,
        counterId: data.counterId ?? undefined,
        ...timestampFields,
        events: {
          create: {
            eventType: data.status as unknown as QueueEventType,
            notes: data.notes ?? `Status diubah menjadi ${data.status}`,
          },
        },
      },
      include: { patient: true, service: true },
    });

    return updated;
  },

  async getDisplay(serviceId?: number) {
    const whereClause = {
      status: { in: [QueueStatus.CALLED, QueueStatus.SERVING, QueueStatus.WAITING] as QueueStatus[] },
      ...(serviceId && { serviceId }),
    };

    return prisma.queue.findMany({
      where: whereClause,
      include: {
        patient: { select: { name: true } }, // Hanya tampilkan nama
        service: { select: { name: true, code: true } },
        counter: { select: { name: true } },
      },
      orderBy: [{ status: "asc" }, { priorityLevel: "asc" }, { createdAt: "asc" }],
    });
  },
};