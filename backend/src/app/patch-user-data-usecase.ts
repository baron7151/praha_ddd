import { Injectable, Inject } from '@nestjs/common'
import { UserDataDTO } from 'src/domain/user/user-dto'
import { UserFactory } from 'src/domain/user/user-factory'
import { IUserRepository } from 'src/domain/user/user-repository'
import { Providers } from 'src/providers'
@Injectable()
export class PatchUserDataUseCase {
  public constructor(
    @Inject(Providers.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}
  public async do(data: {
    userId: string
    userName?: string
    email?: string
    status?: string
  }): Promise<void> {
    const { userId, email, userName, status } = data
    try {
      const userData = await this.userRepository.findByUserId(userId)
      if (userData !== undefined) {
        const newUserData = new UserDataDTO({
          ...userData,
          userName: userName !== undefined ? userName : userData.userName,
          email: email !== undefined ? email : userData.email,
          status: status !== undefined ? status : userData.status,
        })
        this.userRepository.update(newUserData, userId)
      } else {
        throw new Error('Not Found.')
      }
    } catch (error) {
      throw error
    }
  }
}
