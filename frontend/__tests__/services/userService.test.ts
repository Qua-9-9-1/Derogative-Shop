import { userService } from '../../src/services/userService';

describe('userService', () => {
  it('should have getUserProfile function', () => {
    expect(typeof userService.getUserProfile).toBe('function');
  });
});
