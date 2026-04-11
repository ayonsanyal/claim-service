import { ValidateEnum } from '../common/enum.validator';
import { ValidationArguments } from 'class-validator';

describe('ValidateEnum', () => {
  let validator: ValidateEnum;

  enum TestEnum {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
  }

  const mockArgs = (enumObj: any): ValidationArguments =>
    ({
      constraints: [enumObj],
    }) as any;

  beforeEach(() => {
    validator = new ValidateEnum();
  });

  it('should return true for valid enum values (case-insensitive)', () => {
    const args = mockArgs(TestEnum);

    expect(validator.validate('OPEN', args)).toBe(true);
    expect(validator.validate('open', args)).toBe(true);
    expect(validator.validate('Open', args)).toBe(true);
  });

  it('should return false for invalid enum values', () => {
    const args = mockArgs(TestEnum);

    expect(validator.validate('INVALID', args)).toBe(false);
  });

  it('should return false for non-string values', () => {
    const args = mockArgs(TestEnum);

    expect(validator.validate(123, args)).toBe(false);
    expect(validator.validate(null, args)).toBe(false);
    expect(validator.validate(undefined, args)).toBe(false);
  });

  it('should return correct error message', () => {
    const args = mockArgs(TestEnum);

    const message = validator.defaultMessage(args);

    expect(message).toBe('Invalid value. Allowed values: OPEN, CLOSED');
  });
});
