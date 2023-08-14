export const mockUserRepository = {
  findByEmail: jest.fn(),
  findByUserId: jest.fn(),
  exists: jest.fn(),
  save: jest.fn(),
}

export const mockPairRepository = {
  findByPairId: jest.fn(),
  exists: jest.fn(),
  save: jest.fn(),
}

export const mockTeamRepository = {
  findByTeamId: jest.fn(),
  exists: jest.fn(),
  save: jest.fn(),
}

export const mockTaskProgressRepository = {
  findByTaskProgressId: jest.fn(),
  save: jest.fn(),
  findByUserIdByTaskId: jest.fn(),
}
