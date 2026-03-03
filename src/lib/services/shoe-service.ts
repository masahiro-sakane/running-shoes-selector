import { prisma } from "@/lib/db/prisma";
import type { ShoeFilterParsed } from "@/lib/validations/shoe-schema";
import type { Prisma } from "@/generated/prisma/client";

export interface ShoeListResult {
  shoes: ShoeWithFit[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ShoeWithFit {
  id: string;
  brand: string;
  model: string;
  version: string | null;
  year: number | null;
  price: number;
  currency: string;
  weightG: number | null;
  dropMm: number | null;
  stackHeightHeel: number | null;
  stackHeightFore: number | null;
  cushionType: string | null;
  cushionMaterial: string | null;
  outsoleMaterial: string | null;
  upperMaterial: string | null;
  widthOptions: string;
  surfaceType: string;
  pronationType: string;
  category: string;
  durabilityKm: number | null;
  officialUrl: string | null;
  imageUrl: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  trainingFit: {
    dailyJog: number;
    paceRun: number;
    interval: number;
    longRun: number;
    race: number;
    recovery: number;
  } | null;
}

function buildWhere(filters: ShoeFilterParsed): Prisma.ShoeWhereInput {
  const where: Prisma.ShoeWhereInput = {};

  if (filters.brand && filters.brand.length > 0) {
    where.brand = { in: filters.brand };
  }
  if (filters.category && filters.category.length > 0) {
    where.category = { in: filters.category };
  }
  if (filters.pronationType && filters.pronationType.length > 0) {
    where.pronationType = { in: filters.pronationType };
  }
  if (filters.cushionType && filters.cushionType.length > 0) {
    where.cushionType = { in: filters.cushionType };
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }
  if (filters.minWeight !== undefined || filters.maxWeight !== undefined) {
    where.weightG = {
      ...(filters.minWeight !== undefined ? { gte: filters.minWeight } : {}),
      ...(filters.maxWeight !== undefined ? { lte: filters.maxWeight } : {}),
    };
  }
  if (filters.minDrop !== undefined || filters.maxDrop !== undefined) {
    where.dropMm = {
      ...(filters.minDrop !== undefined ? { gte: filters.minDrop } : {}),
      ...(filters.maxDrop !== undefined ? { lte: filters.maxDrop } : {}),
    };
  }
  if (filters.query) {
    const q = filters.query.trim();
    where.OR = [
      { brand: { contains: q } },
      { model: { contains: q } },
      { description: { contains: q } },
    ];
  }

  return where;
}

function buildOrderBy(sort: ShoeFilterParsed["sort"]): Prisma.ShoeOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "weight_asc":
      return { weightG: "asc" };
    case "weight_desc":
      return { weightG: "desc" };
    case "name_desc":
      return { model: "desc" };
    case "newest":
      return { createdAt: "desc" };
    default:
      return { brand: "asc" };
  }
}

export async function getShoes(filters: ShoeFilterParsed): Promise<ShoeListResult> {
  const where = buildWhere(filters);
  const orderBy = buildOrderBy(filters.sort);
  const skip = (filters.page - 1) * filters.limit;

  const [shoes, total] = await Promise.all([
    prisma.shoe.findMany({
      where,
      orderBy,
      skip,
      take: filters.limit,
      include: { trainingFit: true },
    }),
    prisma.shoe.count({ where }),
  ]);

  return {
    shoes: shoes as ShoeWithFit[],
    total,
    page: filters.page,
    limit: filters.limit,
    totalPages: Math.ceil(total / filters.limit),
  };
}

export async function getShoeById(id: string): Promise<ShoeWithFit | null> {
  const shoe = await prisma.shoe.findUnique({
    where: { id },
    include: { trainingFit: true },
  });
  return shoe as ShoeWithFit | null;
}

export async function getRelatedShoes(shoe: ShoeWithFit, limit = 4): Promise<ShoeWithFit[]> {
  const shoes = await prisma.shoe.findMany({
    where: {
      category: shoe.category,
      id: { not: shoe.id },
    },
    take: limit,
    include: { trainingFit: true },
  });
  return shoes as ShoeWithFit[];
}
