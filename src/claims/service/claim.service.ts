import { Injectable, BadRequestException } from '@nestjs/common';
import { ClaimsRepository } from 'src/claims/repository/claim.repository';
import { Claim, ClaimStatus } from '@prisma/client';
import { QueryClaimDto } from 'src/claims/query.claim.dto';

@Injectable()
export class ClaimsService {
  constructor(private readonly claimsRepository: ClaimsRepository) {}

  async create(
    data: { title: string; description: string },
    userId: string,
  ): Promise<Claim> {
    return this.claimsRepository.create({
      ...data,
      status: ClaimStatus.OPEN,
      userId,
    });
  }

  async findAll(query: QueryClaimDto, userId: string) {
    const data = await this.claimsRepository.findAll({
      offset: query.offset,
      limit: query.limit,
      userId,
    });

    return {
      limit: query.limit,
      offset: query.offset,
      count: data.length,
      data,
    };
  }

  async findAllByStatus(query: QueryClaimDto, userId: string) {
    const claimStatus = query.getNormalizedStatus();
  
    const data = await this.claimsRepository.findAllByStatus({
      offset: query.offset,
      limit: query.limit,
      status: claimStatus,
      userId,
    });
  
    return {
      limit: query.limit,
      offset: query.offset,
      count: data.length,
      data,
    };
  }

  async findOne(id: string, userId: string): Promise<Claim> {
    const claim = await this.claimsRepository.findById(id, userId);
    if (!claim) throw new BadRequestException('Claim not found');
    return claim;
  }

  async update(id: string, userId: string, data: any): Promise<Claim> {
    await this.findOne(id, userId);
    return this.claimsRepository.update(id, userId, data);
  }

  async delete(id: string, userId: string): Promise<Claim> {
    await this.findOne(id, userId);
    return this.claimsRepository.delete(id, userId);
  }

  async changeStatus(
    id: string,
    userId: string,
    newStatus: ClaimStatus,
  ): Promise<Claim> {
    const claim = await this.findOne(id, userId);
    
    const validTransitions: Record<ClaimStatus, ClaimStatus[]> = {
      [ClaimStatus.OPEN]: [ClaimStatus.IN_REVIEW],
      [ClaimStatus.IN_REVIEW]: [ClaimStatus.CLOSED],
      [ClaimStatus.CLOSED]: [],
    };

    if (!validTransitions[claim.status].includes(newStatus)) {
      throw new BadRequestException('Invalid transition');
    }

    return this.claimsRepository.update(id, userId, { status: newStatus });
  }
}
