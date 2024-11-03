import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'MatchPass',
  async: false,
})
export class MatchPass implements ValidatorConstraintInterface {
  validate(
    password: any,
    args: ValidationArguments,
  ): Promise<boolean> | boolean {
    if (password !== (args.object as any)[args.constraints[0]]) return false;

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'El password y confirmación deben coincidir';
  }
}
