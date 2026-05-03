import prisma from "../config/prisma";
import bcrypt from "bcrypt";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

export const UserService = {
  async getAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async create(data: CreateUserData) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error("Email sudah digunakan");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role as any,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  },

  async update(id: number, data: UpdateUserData) {
    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.role) updateData.role = data.role;

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });
  },

  async toggle(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) throw new Error("User tidak ditemukan");

    return prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  },

  async deactivate(id: number) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  },
};