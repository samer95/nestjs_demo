import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntitySchema, FindConditions, ObjectType } from 'typeorm';

export enum ExistingTypes {
  ShouldBeExisted = 'should_be_existed',
  ShouldNotBeExisted = 'should_not_be_existed',
}

interface ExistsValidationArguments<E> extends ValidationArguments {
  constraints: [
    ObjectType<E> | EntitySchema<E> | string,
    ((validationArguments: ValidationArguments) => FindConditions<E>) | keyof E,
    ExistingTypes,
  ];
}

export abstract class ExistsValidator implements ValidatorConstraintInterface {
  protected constructor(protected readonly connection: Connection) {}

  public async validate<E>(value: string, args: ExistsValidationArguments<E>) {
    const [EntityClass, findCondition = args.property, existing = ExistingTypes.ShouldNotBeExisted] = args.constraints;
    const entitiesCount = await this.connection.getRepository(EntityClass).count({
      where: typeof findCondition === 'function' ? findCondition(args) : { [findCondition || args.property]: value },
    });
    switch (existing) {
      case ExistingTypes.ShouldBeExisted:
        return entitiesCount > 0; // Don't throw an error if the entity is found
      case ExistingTypes.ShouldNotBeExisted:
        return entitiesCount <= 0; // Don't throw an error if the entity is not found
      default: // ExistingTypes.ShouldNotBeExisted
        return entitiesCount <= 0;
    }
  }

  public defaultMessage(args: ValidationArguments) {
    const [EntityClass] = args.constraints;
    const entity = EntityClass.name || 'Entity';
    return `${entity} with the same '${args.property}' already exist`;
  }
}

@ValidatorConstraint({ name: 'exists', async: true })
@Injectable()
export class Exists extends ExistsValidator {
  constructor(@InjectConnection() protected readonly connection: Connection) {
    super(connection);
  }
}
