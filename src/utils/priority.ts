import { PriorityCategory } from "@prisma/client";

export function getPriorityLevel(category: PriorityCategory): number {
  const priorityMap: Record<PriorityCategory, number> = {
    DISABILITAS: 1,
    LANSIA: 2,
    IBU_HAMIL: 3,
    ANAK_KECIL: 4,
    NORMAL: 5,
  };

  return priorityMap[category] ?? 5;
}