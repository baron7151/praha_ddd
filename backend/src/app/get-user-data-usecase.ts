import { IUserDataQS } from './query-service-interface/user-data-qs'
import { Injectable, Inject } from '@nestjs/common'
import { UserDataDTO } from 'src/domain/user/user-dto'
import { Providers } from 'src/providers'
@Injectable()
export class GetUserDataUseCase {
  public constructor(
    @Inject(Providers.IUserDataQS) private readonly userDataQS: IUserDataQS,
  ) {}
  public async do(name?: string): Promise<UserDataDTO[]> {
    try {
      if (name) {
        return await this.userDataQS.getUsers(name)
      } else {
        return await this.userDataQS.getAllUsers()
      }
    } catch (error) {
      // memo: エラー処理
      throw error
    }
  }
}
