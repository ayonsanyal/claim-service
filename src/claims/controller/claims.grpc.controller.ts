import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ClaimsService } from 'src/claims/service/claim.service';
import { ClaimStatus } from '@prisma/client';

@Controller()
export class ClaimsGrpcController {
  constructor(private readonly service: ClaimsService) {}

  // ✅ Create
  @GrpcMethod('ClaimsService', 'CreateClaim')
  async createClaim(data: { title: string; description: string }) {
    const claim = await this.service.create(data);
    return { claim };
  }

  @GrpcMethod('ClaimsService', 'GetClaims')
  async getClaims(data: { limit?: number; offset?: number }) {
    const query = {
      limit: data.limit ?? 10,
      offset: data.offset ?? 0,
    };

    const result = await this.service.findAll(query as any);

    return {
      limit: result.limit,
      offset: result.offset,
      count: result.count,
      data: result.data,
    };
  }

  @GrpcMethod('ClaimsService', 'GetClaimsByStatus')
  async getClaimsByStatus(data: {
    status: string;
    limit?: number;
    offset?: number;
  }) {
    const query = {
      limit: data.limit ?? 10,
      offset: data.offset ?? 0,
      status: data.status,
      getNormalizedStatus: () => data.status.toUpperCase() as ClaimStatus,
    };

    const result = await this.service.findAllByStatus(query as any);

    return {
      limit: result.limit,
      offset: result.offset,
      count: result.count,
      data: result.data,
    };
  }

  @GrpcMethod('ClaimsService', 'GetClaimById')
  async getClaimById(data: { id: string }) {
    const claim = await this.service.findOne(data.id);
    return { claim };
  }

  @GrpcMethod('ClaimsService', 'UpdateClaim')
  async updateClaim(data: {
    id: string;
    title?: string;
    description?: string;
    status?: string;
  }) {
    const normalizedStatus = data.status
      ? (data.status.toUpperCase() as ClaimStatus)
      : undefined;

    const claim = await this.service.update(data.id, {
      ...data,
      status: normalizedStatus,
    });

    return { claim };
  }

  @GrpcMethod('ClaimsService', 'DeleteClaim')
  async deleteClaim(data: { id: string }) {
    const claim = await this.service.delete(data.id);
    return { claim };
  }

  @GrpcMethod('ClaimsService', 'ChangeStatus')
  async changeStatus(data: { id: string; status: string }) {
    const status = data.status.toUpperCase() as ClaimStatus;

    const claim = await this.service.changeStatus(data.id, status);

    return { claim };
  }
}
