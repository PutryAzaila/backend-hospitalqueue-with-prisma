import { Request, Response } from "express";
import { QueueService } from "../services/queue.service";
import { emitQueueUpdated } from "../socket";

interface IdParam {
    id: string;
}

interface ServiceIdParam {
    serviceId: string;
}

export const QueueController = {
    async getAll(req: Request, res: Response) {
        try {
            const { status, serviceId } = req.query;
            const queues = await QueueService.getAll({
                status: status as any,
                serviceId: serviceId ? parseInt(serviceId as string) : undefined,
            });
            res.json({ success: true, data: queues });
        } catch (error) {
            res.status(500).json({ success: false, message: "Gagal mengambil antrian", error });
        }
    },

    async getById(req: Request<IdParam>, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const queue = await QueueService.getById(id);

            if (!queue) {
                return res.status(404).json({ success: false, message: "Antrian tidak ditemukan" });
            }

            res.json({ success: true, data: queue });
        } catch (error) {
            res.status(500).json({ success: false, message: "Gagal mengambil antrian", error });
        }
    },

    async create(req: Request, res: Response) {
        try {
            const { patientId, serviceId, priorityCategory, notes } = req.body;

            if (!patientId || !serviceId) {
                return res.status(400).json({ success: false, message: "patientId dan serviceId wajib diisi" });
            }

            const queue = await QueueService.create({ patientId, serviceId, priorityCategory, notes });

            emitQueueUpdated(serviceId, queue);

            res.status(201).json({ success: true, data: queue, message: `Antrian ${queue.queueNumber} berhasil dibuat` });
        } catch (error) {
            console.error("ERROR CREATE QUEUE:", error);
            res.status(500).json({
                success: false,
                message: "Gagal membuat antrian",
                error: error instanceof Error ? error.message : String(error)
            });
        }
    },

    async callNext(req: Request, res: Response) {
        try {
            const { serviceId, counterId } = req.body;

            if (!serviceId) {
                return res.status(400).json({ success: false, message: "serviceId wajib diisi" });
            }

            const queue = await QueueService.callNext(serviceId, counterId);

            if (!queue) {
                return res.status(404).json({ success: false, message: "Tidak ada antrian yang menunggu" });
            }

            emitQueueUpdated(serviceId, queue);

            res.json({ success: true, data: queue, message: `Memanggil antrian ${queue.queueNumber}` });
        } catch (error) {
            res.status(500).json({ success: false, message: "Gagal memanggil antrian", error });
        }
    },

    async updateStatus(req: Request<IdParam>, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { status, notes, counterId } = req.body;

            if (!status) {
                return res.status(400).json({ success: false, message: "Status wajib diisi" });
            }

            const queue = await QueueService.updateStatus(id, { status, notes, counterId });

            emitQueueUpdated(queue.serviceId, queue);

            res.json({ success: true, data: queue, message: `Status antrian diubah menjadi ${status}` });
        } catch (error) {
            res.status(500).json({ success: false, message: "Gagal mengubah status antrian", error });
        }
    },

    async getDisplay(req: Request, res: Response) {
        try {
            const queues = await QueueService.getDisplay();
            res.json({ success: true, data: queues });
        } catch (error) {
            res.status(500).json({ success: false, message: "Gagal mengambil data display", error });
        }
    },

    async getDisplayByService(req: Request<ServiceIdParam>, res: Response) {
        try {
            const serviceId = parseInt(req.params.serviceId);
            const queues = await QueueService.getDisplay(serviceId);
            res.json({ success: true, data: queues });
        } catch (error) {
            res.status(500).json({ success: false, message: "Gagal mengambil display layanan", error });
        }
    },
};