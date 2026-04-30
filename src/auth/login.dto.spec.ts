import { validate } from 'class-validator';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  it('should pass with valid email and password', async () => {
    const dto = new LoginDto();
    dto.email = 'test@test.com';
    dto.password = 'abc123';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should fail with invalid email', async () => {
    const dto = new LoginDto();
    dto.email = 'invalid-email';
    dto.password = 'abc123';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail when password is too short', async () => {
    const dto = new LoginDto();
    dto.email = 'test@test.com';
    dto.password = 'abc';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);

    const passwordError = errors.find((e) => e.property === 'password');
    expect(passwordError).toBeDefined();
  });

  it('should fail when both email and password are invalid', async () => {
    const dto = new LoginDto();
    dto.email = 'wrong';
    dto.password = '123';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThanOrEqual(2);
  });
});
