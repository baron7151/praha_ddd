import { Injectable, Inject } from '@nestjs/common'

import { Providers } from 'src/providers'
import {
  IUserDataQS,
  UserDataDTO,
} from '../query-service-interface/user-data-qs'
@Injectable()
export class GetUserDataUseCase {
  public constructor(
    @Inject(Providers.IUserDataQS) private readonly userDataQS: IUserDataQS,
  ) {}
  public async do(name?: string): Promise<UserDataDTO[]> {
    if (name) {
      return await this.userDataQS.getUsers(name)
    } else {
      return await this.userDataQS.getAllUsers()
    }
  }
}
