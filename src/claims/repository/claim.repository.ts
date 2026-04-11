import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Claim, ClaimStatus, Prisma } from '@prisma/client';

@Injectable()
export class ClaimsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ClaimCreateInput): Promise<Claim> {
    return this.prisma.claim.create({
      data,
    });
  }

  async findAll(params: { skip?: number; take?: number }) {
    const { skip, take } = params;

    return this.prisma.claim.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByStatus(params: {
    skip?: number;
    take?: number;
    status?: ClaimStatus;
  }) {
    const { skip, take, status } = params;

    return this.prisma.claim.findMany({
      where: status ? { status } : undefined,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Claim | null> {
    return this.prisma.claim.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.ClaimUpdateInput): Promise<Claim> {
    return this.prisma.claim.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Claim> {
    return this.prisma.claim.delete({
      where: { id },
    });
  }
}
