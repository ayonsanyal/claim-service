import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Claim, ClaimStatus, Prisma } from '@prisma/client';

@Injectable()
export class ClaimsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ClaimUncheckedCreateInput): Promise<Claim> {
    return this.prisma.claim.create({ data });
  }

  async findAll(params: { limit?: number; offset?: number; userId: string }) {
    const { limit, offset, userId } = params;

    return this.prisma.claim.findMany({
      where: { userId },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByStatus(params: {
    limit?: number;
    offset?: number;
    status?: ClaimStatus;
    userId: string;
  }) {
    const { limit, offset, status, userId } = params;

    return this.prisma.claim.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string): Promise<Claim | null> {
    return this.prisma.claim.findFirst({
      where: { id, userId },
    });
  }

  async update(
    id: string,
    userId: string,
    data: Prisma.ClaimUpdateInput,
  ): Promise<Claim> {
    return this.prisma.claim.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<Claim> {
    return this.prisma.claim.delete({
      where: { id },
    });
  }
}
