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

  async getFunnelConfig(userId: string) {
    const config = await this.claimsRepository.getConfig();

    const bucket = this.hash(userId) % 2;

    const variantName =
      config.activeVariant === 'split'
        ? bucket === 0
          ? 'A'
          : 'B'
        : config.activeVariant;

    return {
      version: config.version,
      variant: variantName,
      steps: config.variants[variantName].steps,
    };
  }

  async reorderSteps(stepIds: string[]) {
    const config = await this.claimsRepository.getConfig();

    const variant = config.variants[config.activeVariant];

    variant.steps.sort((a, b) => stepIds.indexOf(a.id) - stepIds.indexOf(b.id));

    this.bumpVersion(config);

    this.claimsRepository.saveConfig(config);

    return config;
  }

  async switchVariant(name: string) {
    const config = await this.claimsRepository.getConfig();

    config.activeVariant = name;

    this.bumpVersion(config);

    this.claimsRepository.saveConfig(config);

    return config;
  }

  async restoreVersion(version: number) {
    const config = await this.claimsRepository.getConfig();

    const found = config.history.find((x) => x.version === version);

    if (!found) {
      return {
        message: 'Version not found',
      };
    }

    config.variants = found.variants;

    this.bumpVersion(config);

    this.claimsRepository.saveConfig(config);

    return config;
  }

  async getVersions() {
    const config = await this.claimsRepository.getConfig();

    return config.history.map((x) => ({
      version: x.version,
      savedAt: x.savedAt,
    }));
  }

  private bumpVersion(config: any) {
    config.history.push({
      version: config.version,
      savedAt: new Date().toISOString(),
      variants: JSON.parse(JSON.stringify(config.variants)),
    });

    config.version += 1;
  }

  private hash(str: string) {
    return str.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  }
}
