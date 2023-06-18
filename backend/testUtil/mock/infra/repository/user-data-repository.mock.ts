export const mockUserRepository = {
  findByEmail: jest.fn(),
  findByUserId: jest.fn(),
  exists: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
}
