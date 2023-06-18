import { Injectable, Inject } from '@nestjs/common'
import { UserDataDTO } from 'src/domain/user/user-dto'
import { UserFactory } from 'src/domain/user/user-factory'
import { IUserRepository } from 'src/domain/user/user-repository'
import { Providers } from 'src/providers'
@Injectable()
export class PostUserDataUseCase {
  public constructor(
    @Inject(UserFactory) private readonly userFactory: UserFactory,
    @Inject(Providers.IUserRepository)
    private readonly userReposigory: IUserRepository,
  ) {}
  public async do(userName: string, email: string): Promise<void> {
    try {
      const userEntity = await this.userFactory.addUser(userName, email)
      const userData = userEntity.getAllProperties()
      const userDataDTO = new UserDataDTO(userData)
      await this.userReposigory.save(userDataDTO)
    } catch (error) {
      // memo: エラー処理
      throw error
    }
  }
}
