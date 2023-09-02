import { Injectable, Inject } from '@nestjs/common'
import { Providers } from 'src/providers'
import { DomainError } from '../common/domain-error'
import { Email } from '../common/email'
import { TeamId } from '../team/team-entity'
import { UserEntity, UserId, UserStatus, UserName } from '../user/user-entity'
import { PairEntity, PairId, PairName } from './pair-entity'
import { IPairRepository } from './pair-repository'
import { ITeamRepository } from '../team/team-repository'
import { IUserRepository } from '../user/user-repository'

@Injectable()
export class PairFactory {
  constructor(
    @Inject(Providers.IPairRepository)
    private pairRepository: IPairRepository,
    @Inject(Providers.ITeamRepository)
    private teamRepository: ITeamRepository,
    @Inject(Providers.IUserRepository)
    private userRepository: IUserRepository,
  ) {}
  static create(props: {
    pairId: string
    pairName: string
    teamId?: string | null
    userIds?: string[] | null
  }): PairEntity {
    const { pairId, pairName, teamId, userIds } = props
    const mappedUserIds =
      userIds != null && userIds.length > 0
        ? userIds.map((userId) => new UserId(userId))
        : undefined
    return new PairEntity(
      new PairId(pairId),
      new PairName(pairName),
      teamId != null ? new TeamId(teamId) : undefined,
      mappedUserIds,
    )
  }

  public async reconstruct(props: {
    pairEntity: PairEntity
    newPairName?: string
    newTeamId?: string
    newUserIds?: string[]
  }): Promise<PairEntity> {
    const { pairEntity, newPairName, newTeamId, newUserIds } = props
    const { pairId, pairName, teamId, userIds } = pairEntity.getAllProperties()
    if (newPairName) {
      const duplicatePairNameCheck = await this.pairRepository.exists(
        new PairName(newPairName),
      )
      if (duplicatePairNameCheck) {
        throw new DomainError(
          `This PairName is already registered. ${newPairName}`,
        )
      }
    }
    if (newTeamId) {
      const existsTeamCheck = await this.teamRepository.findByTeamId(
        new TeamId(newTeamId),
      )
      if (existsTeamCheck === undefined) {
        throw new DomainError(`This TeamId is not exists. ${newTeamId}`)
      }
    }
    if (newUserIds) {
      const procs = newUserIds.map((userId) =>
        this.userRepository.findByUserId(new UserId(userId)),
      )
      const results = await Promise.all(procs)
      results.map((result) => {
        if (result === undefined) {
          throw new DomainError(`This UserIds is not exists. ${newUserIds}`)
        }
      })
    }
    return new PairEntity(
      pairId,
      newPairName === undefined ? pairName : new PairName(newPairName),
      newTeamId === undefined
        ? teamId === undefined
          ? undefined
          : new TeamId(teamId.value)
        : new TeamId(newTeamId),
      newUserIds === undefined
        ? userIds === undefined
          ? undefined
          : userIds
        : newUserIds.map((userId) => new UserId(userId)),
    )
  }
  public async register(pairEntity: PairEntity) {
    await this.pairRepository.save(pairEntity)
  }
}
