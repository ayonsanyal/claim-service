import { Injectable, BadRequestException } from '@nestjs/common';
import { ClaimsRepository } from 'src/claims/repository/claim.repository';
import { Claim, ClaimStatus } from '@prisma/client';
import { QueryClaimDto } from '../qury.claim.dto';

@Injectable()
export class ClaimsService {
  constructor(private readonly repo: ClaimsRepository) {}

  async create(data: { title: string; description: string }): Promise<Claim> {
    return this.repo.create({
      ...data,
      status: ClaimStatus.OPEN,
    });
  }

  async findAll(query: QueryClaimDto) {
    const data = await this.repo.findAll({
      skip: query.offset,
      take: query.limit,
    });

    return {
      limit: query.limit,
      offset: query.offset,
      count: data.length,
      data,
    };
  }

  async findAllByStatus(query: QueryClaimDto) {
    const claimStatus = query.getNormalizedStatus();

    const data = await this.repo.findAllByStatus({
      skip: query.offset,
      take: query.limit,
      status: claimStatus,
    });

    return {
      limit: query.limit,
      offset: query.offset,
      count: data.length,
      data,
    };
  }

  async findOne(id: string): Promise<Claim> {
    const claim = await this.repo.findById(id);
    if (!claim) {
      throw new BadRequestException('Claim not found');
    }
    return claim;
  }

  async update(id: string, data: any): Promise<Claim> {
    await this.findOne(id); // ensure exists
    return this.repo.update(id, data);
  }

  async delete(id: string): Promise<Claim> {
    await this.findOne(id);
    return this.repo.delete(id);
  }

  async changeStatus(id: string, newStatus: ClaimStatus): Promise<Claim> {
    const claim = await this.findOne(id);

    const validTransitions: Record<ClaimStatus, ClaimStatus[]> = {
      [ClaimStatus.OPEN]: [ClaimStatus.IN_REVIEW],
      [ClaimStatus.IN_REVIEW]: [ClaimStatus.CLOSED],
      [ClaimStatus.CLOSED]: [],
    };

    if (!validTransitions[claim.status].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid transition from ${claim.status} to ${newStatus}`,
      );
    }

    return this.repo.update(id, { status: newStatus });
  }
}
