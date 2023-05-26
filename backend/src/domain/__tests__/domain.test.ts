import { PairEntity, PairName } from '../pair/pairEntity'
import { Id } from '../id'
import { TeamEntity, TeamName } from '../team/team-entity'
import { Name } from 'src/domain/name'
import { UserEntity } from '../user/user-entity'
import { createRandomIdString } from 'src/util/random'
import { Email } from '../email'

test('test PairEntity', () => {
  const pairName = new PairName('a')
  const teamId = createRandomIdString()
  const pairId = createRandomIdString()
  const pairId2 = createRandomIdString()
  const pair1 = new PairEntity(pairName, pairId, teamId)
  const pair2 = new PairEntity(pairName, pairId, teamId)
  const pair3 = new PairEntity(pairName, pairId2, teamId)
  expect(pair1.equals(pair2)).toBe(true)
  expect(pair3.equals(pair1)).toBe(false)
  expect(pair1.equals(pair1.changePairName(new PairName('b')))).toBe(true)
})

test('test PairName', () => {
  expect(() => {
    new PairName('123')
  }).toThrowError('Team Name must be alphabet.')

  expect(() => {
    new PairName('abc')
  }).toThrowError('Team names must be one letter.')

  expect(() => {
    const pairName = new PairName('a')
    pairName.changePairName('1')
  }).toThrowError('Team Name must be alphabet.')

  expect(() => {
    const pairName = new PairName('a')
    pairName.changePairName('bc')
  }).toThrowError('Team names must be one letter.')
})

test('test TeamName', () => {
  expect(() => {
    new TeamName('team')
  }).toThrowError('Team Name must be numbers.')

  expect(() => {
    new TeamName('1234')
  }).toThrowError(
    'Team names must be at least one and no more than three letters.',
  )

  expect(() => {
    const teamName = new TeamName('123')
    teamName.changeTeamName('team')
  }).toThrowError('Team Name must be numbers.')

  expect(() => {
    const teamName = new TeamName('123')
    teamName.changeTeamName('1234')
  }).toThrowError(
    'Team names must be at least one and no more than three letters',
  )
})

test('test TeamEntity', () => {
  const teamName = new TeamName('123')
  const teamId1 = createRandomIdString()
  const teamId2 = createRandomIdString()
  const team1 = new TeamEntity(teamName, teamId1)
  const team2 = new TeamEntity(teamName, teamId1)
  const team3 = new TeamEntity(teamName, teamId2)
  expect(team1.equal(team2.changeTeamName(new TeamName('234')))).toBe(true)
  expect(team1.equal(team3)).toBe(false)
})

test('Name', () => {
  const name = new Name('abc')
  expect(name.changeName('123') instanceof Name).toBe(true)
})

test('test userEntity', () => {
  const userId = createRandomIdString()
  const name = new Name('test1')
  const email = new Email('test@test.com')
  const status = 'registered'
  const user = new UserEntity(userId, name, email, status)
  expect(user instanceof UserEntity).toBe(true)
  const properties = user.getAllProperties()
  expect(properties.userId).toBe(userId)
  expect(properties.pairId).toBe(undefined)
})
