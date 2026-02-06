import { authService } from '@/services/authService';

jest.mock('axios');
const axios = require('axios');

describe('authService', () => {
  it('register returns data on success', async () => {
    axios.post.mockResolvedValue({ data: { email: 'a@b.com' } });
    const res = await authService.register('a@b.com', 'pass');
    expect(res).toEqual({ email: 'a@b.com' });
  });

  it('login returns data on success', async () => {
    axios.post.mockResolvedValue({ data: { token: 'tok' } });
    const res = await authService.login('a@b.com', 'pass');
    expect(res).toEqual({ token: 'tok' });
  });

  it('logout calls axios.post', async () => {
    axios.post.mockResolvedValue({});
    await authService.logout();
    expect(axios.post).toHaveBeenCalled();
  });
});
