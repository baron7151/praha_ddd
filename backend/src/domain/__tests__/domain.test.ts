import { PairEntity, PairId, PairName } from '../pair/pair-entity'
import { TeamEntity, TeamId, TeamName } from '../team/team-entity'
import { uuid } from 'uuidv4'

test('test PairEntity', () => {
  const pairName = new PairName('a')
  const teamId = new TeamId(uuid())
  const pairId = new PairId(uuid())
  const pairId2 = new PairId(uuid())
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
  const teamId1 = new TeamId(uuid())
  const teamId2 = new TeamId(uuid())
  const team1 = new TeamEntity(teamName, teamId1)
  const team2 = new TeamEntity(teamName, teamId1)
  const team3 = new TeamEntity(teamName, teamId2)
  expect(team1.equal(team2.changeTeamName(new TeamName('234')))).toBe(true)
  expect(team1.equal(team3)).toBe(false)
})
