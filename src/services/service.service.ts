import prisma from "../config/prisma";
import { ServiceType } from "@prisma/client";

interface CreateServiceData {
  name: string;
  code: string;
  type: ServiceType;
}

interface UpdateServiceData {
  name?: string;
  code?: string;
  type?: ServiceType;
  isActive?: boolean;
}

export const ServiceService = {
  async getAll() {
    return prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  },

  async getById(id: number) {
    return prisma.service.findUnique({
      where: { id },
      include: { counters: true },
    });
  },

  async create(data: CreateServiceData) {
    return prisma.service.create({ data });
  },

  async update(id: number, data: UpdateServiceData) {
    return prisma.service.update({
      where: { id },
      data,
    });
  },

  async deactivate(id: number) {
    return prisma.service.update({
      where: { id },
      data: { isActive: false },
    });
  },
};