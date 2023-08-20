import { mockUserRepository } from '@testUtil/mock/infra/repository/repository.mock'
import { UserFactory } from '../user/user-factory'
import { uuid } from 'uuidv4'
import { UserStatus, UserEntity, UserName } from '../user/user-entity'
import { TeamName } from '../team/team-entity'
import { UserService } from '../user/user-service'

describe('UserService', () => {
  beforeEach(() => {})

  describe('notifyWithTeamMemberDecrease', () => {
    it('should output Team Member Decrease notification.', async () => {
      const testTeamName = new TeamName('1')
      const testChangeStatusUserName = new UserName('test1')
      const testTeamUserName1 = new UserName('test2')
      const testTeamUserName2 = new UserName('test3')
      const testTeamUserNames = [testTeamUserName1, testTeamUserName2]
      const spy = jest.spyOn(console, 'log')
      UserService.notifyWithTeamMemberDecrease(
        testTeamName,
        testTeamUserNames,
        testChangeStatusUserName,
      )
      expect(spy).toHaveBeenCalledWith(
        `参加者の退会・休会に伴い、チームが２名以下になりましたので、お知らせします。\n退会・休会会員：${
          testChangeStatusUserName.value
        }\nチーム名：${
          testTeamName.value
        }\nチームの現在の参加者名：${testTeamUserNames.map(
          (teamUserName) => teamUserName.value,
        )}`,
      )
      spy.mockRestore()
    })
  })
  describe('notifyNotFoundMovePair', () => {
    it('should output Team Member Decrease notification.', async () => {
      const testChangeStatusUserName = new UserName('test1')
      const testMoveUserName1 = new UserName('test2')
      const testMoveUserName2 = new UserName('test3')
      const testMoveUserNames = [testMoveUserName1, testMoveUserName2]
      const spy = jest.spyOn(console, 'log')
      UserService.notifyNotFoundMovePair(
        testChangeStatusUserName,
        testMoveUserNames,
      )
      expect(spy).toHaveBeenCalledWith(
        `参加者の退会・休会に伴い、ペアの移動が必要になった参加者がいましたが、移動先のペアが見つかりませんでした。\n退会・休会会員：${
          testChangeStatusUserName.value
        }\n移動が必要な参加者名：${testMoveUserNames.map(
          (moveUserName) => moveUserName.value,
        )}}`,
      )
      spy.mockRestore()
    })
  })
})
