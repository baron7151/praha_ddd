import { Injectable } from '@nestjs/common'

import { prisma } from 'src/prisma'
import {
  IPairDataQS,
  PairDataDTO,
} from 'src/app/query-service-interface/pair-data-qs'
import { UserDataDTO } from 'src/app/query-service-interface/user-data-qs'

@Injectable()
export class PairDataQS implements IPairDataQS {
  public async getAllPairs(): Promise<PairDataDTO[]> {
    const pairs = await prisma.pair.findMany({ include: { user: true } })
    // TODO:pairsがnullの場合の処理を追加
    return pairs.map(
      (pair) =>
        new PairDataDTO({
          pairId: pair.pairId,
          pairName: pair.pairName,
          teamId: pair.teamId ?? undefined,
          users: pair.user.map(
            (user) =>
              new UserDataDTO({
                userId: user.userId,
                userName: user.userName,
                email: user.email,
                status: user.status,
                pairId: user.pairId ?? undefined,
                teamId: user.teamId ?? undefined,
              }),
          ),
        }),
    )
  }
}
