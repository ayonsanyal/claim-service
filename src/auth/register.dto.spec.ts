import { validate } from 'class-validator';
import { RegisterDto } from 'src/auth/register.dto';

describe('RegisterDto', () => {
  it('should fail for invalid email', async () => {
    const dto = new RegisterDto();
    dto.email = 'invalid-email';
    dto.password = 'abc123';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if password < 6 chars', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@test.com';
    dto.password = 'abc1'; //invalid

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should pass for valid input', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@test.com';
    dto.password = 'abc123';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
