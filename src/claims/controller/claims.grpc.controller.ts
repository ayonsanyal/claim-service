import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ClaimsService } from 'src/claims/service/claim.service';
import { ClaimStatus } from '@prisma/client';

@Controller()
export class ClaimsGrpcController {
  constructor(private readonly service: ClaimsService) {}

  @GrpcMethod('ClaimsService', 'CreateClaim')
  async createClaim(data: {
    title: string;
    description: string;
    userId: string;
  }) {
    const claim = await this.service.create(
      { title: data.title, description: data.description },
      data.userId,
    );
    return { claim };
  }

  @GrpcMethod('ClaimsService', 'GetClaims')
  async getClaims(data: {
    limit?: number;
    offset?: number;
    userId: string;
  }) {
    const result = await this.service.findAll(
      {
        limit: data.limit ?? 10,
        offset: data.offset ?? 0,
      } as any,
      data.userId,
    );

    return result;
  }

  @GrpcMethod('ClaimsService', 'GetClaimsByStatus')
  async getClaimsByStatus(data: {
    status: string;
    limit?: number;
    offset?: number;
    userId: string;
  }) {
    const query = {
      limit: data.limit ?? 10,
      offset: data.offset ?? 0,
      getNormalizedStatus: () =>
        data.status.toUpperCase() as ClaimStatus,
    };

    const result = await this.service.findAllByStatus(
      query as any,
      data.userId,
    );

    return result;
  }

  @GrpcMethod('ClaimsService', 'GetClaimById')
  async getClaimById(data: { id: string; userId: string }) {
    const claim = await this.service.findOne(data.id, data.userId);
    return { claim };
  }

  @GrpcMethod('ClaimsService', 'UpdateClaim')
  async updateClaim(data: {
    id: string;
    title?: string;
    description?: string;
    userId: string;
  }) {
    const claim = await this.service.update(
      data.id,
      data.userId,
      {
        title: data.title,
        description: data.description,
      },
    );

    return { claim };
  }

  @GrpcMethod('ClaimsService', 'DeleteClaim')
  async deleteClaim(data: { id: string; userId: string }) {
    const claim = await this.service.delete(data.id, data.userId);
    return { claim };
  }

  @GrpcMethod('ClaimsService', 'ChangeStatus')
  async changeStatus(data: {
    id: string;
    status: string;
    userId: string;
  }) {
    const status = data.status.toUpperCase() as ClaimStatus;

    const claim = await this.service.changeStatus(
      data.id,
      data.userId,
      status,
    );

    return { claim };
  }
}