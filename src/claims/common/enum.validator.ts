import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isEnumCaseInsensitive', async: false })
export class ValidateEnum implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const enumObject = args.constraints[0];

    if (typeof value !== 'string') return false;

    const normalized = value.toUpperCase();

    return Object.values(enumObject).includes(normalized);
  }

  defaultMessage(args: ValidationArguments) {
    const enumObject = args.constraints[0];
    return `Invalid value. Allowed values: ${Object.values(enumObject).join(', ')}`;
  }
}
