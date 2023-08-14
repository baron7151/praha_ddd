import { Injectable, Inject } from '@nestjs/common'
import { Providers } from 'src/providers'
import {
  IPairDataQS,
  PairDataDTO,
} from '../query-service-interface/pair-data-qs'
@Injectable()
export class GetPairDataUseCase {
  public constructor(
    @Inject(Providers.IPairDataQS) private readonly pairDataQS: IPairDataQS,
  ) {}
  public async do(): Promise<PairDataDTO[]> {
    return await this.pairDataQS.getAllPairs()
  }
}
