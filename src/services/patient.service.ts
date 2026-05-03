import prisma from "../config/prisma";
import { Gender } from "@prisma/client";

interface CreatePatientData {
  name: string;
  medicalRecordNumber: string;
  nik?: string;
  birthDate?: Date;
  gender?: Gender;
  phone?: string;
}

interface UpdatePatientData {
  name?: string;
  nik?: string;
  birthDate?: Date;
  gender?: Gender;
  phone?: string;
}

export const PatientService = {
  async getAll(search?: string) {
    return prisma.patient.findMany({
      where: {
        isActive: true,
        ...(search && {
          OR: [
            { name: { contains: search } },
            { nik: { contains: search } },
            { medicalRecordNumber: { contains: search } },
          ],
        }),
      },
      orderBy: { name: "asc" },
    });
  },

  async getById(id: number) {
    return prisma.patient.findUnique({
      where: { id },
      include: {
        queues: {
          orderBy: { createdAt: "desc" },
          take: 10, 
        },
      },
    });
  },

  async create(data: CreatePatientData) {
    return prisma.patient.create({ data });
  },

  async update(id: number, data: UpdatePatientData) {
    return prisma.patient.update({
      where: { id },
      data,
    });
  },

  async generateMedicalRecordNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

    const count = await prisma.patient.count({
      where: {
        createdAt: {
          gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        },
      },
    });

    const sequence = String(count + 1).padStart(4, "0");
    return `RM-${dateStr}-${sequence}`;
  },
};