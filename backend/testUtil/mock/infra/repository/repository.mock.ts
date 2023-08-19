export const mockUserRepository = {
  findByEmail: jest.fn(),
  findByUserId: jest.fn(),
  findByTeamId: jest.fn(),
  findByPairId: jest.fn(),
  findByManyUserIds: jest.fn(),
  exists: jest.fn(),
  save: jest.fn(),
}

export const mockPairRepository = {
  findByPairId: jest.fn(),
  findByTeamId: jest.fn(),
  exists: jest.fn(),
  save: jest.fn(),
}

export const mockTeamRepository = {
  findByTeamId: jest.fn(),
  findAllTeams: jest.fn(),
  exists: jest.fn(),
  save: jest.fn(),
}

export const mockTaskProgressRepository = {
  findByTaskProgressId: jest.fn(),
  save: jest.fn(),
  findByUserIdByTaskId: jest.fn(),
}
