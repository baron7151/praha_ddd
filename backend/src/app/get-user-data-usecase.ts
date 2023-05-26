import {
  IUserDataQS,
  UserDataDTO,
} from './query-service-interface/user-data-qs'

export class GetUserDataUseCase {
  private readonly userDataQS: IUserDataQS
  public constructor(userDataQS: IUserDataQS) {
    this.userDataQS = userDataQS
  }
  public async do(name: string): Promise<UserDataDTO[]> {
    try {
      return await this.userDataQS.getUsers(name)
    } catch (error) {
      // memo: エラー処理
      throw error
    }
  }
}
