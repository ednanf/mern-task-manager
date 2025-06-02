const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const hashPassword = require('../utils/hashPasswords');
const comparePasswords = require('../utils/comparePasswords');
const createToken = require('../utils/jwt');

describe('utils/hashPasswords', () => {
  it('hashes a password using bcrypt', async () => {
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashedPassword');
    const result = await hashPassword('plain');
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith('plain', 'salt');
    expect(result).toBe('hashedPassword');
  });
});

describe('utils/comparePasswords', () => {
  it('compares passwords using bcrypt', async () => {
    bcrypt.compare.mockResolvedValue(true);
    const result = await comparePasswords('plain', 'hashed');
    expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hashed');
    expect(result).toBe(true);
  });
});

describe('utils/jwt', () => {
  it('creates a JWT token', () => {
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_LIFETIME = '1h';
    jwt.sign.mockReturnValue('signed-token');
    const payload = { userId: 'abc' };
    const token = createToken(payload);
    expect(jwt.sign).toHaveBeenCalledWith(payload, 'secret', {
      expiresIn: '1h',
    });
    expect(token).toBe('signed-token');
  });
});
