import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  Validate,
  ValidationArguments,
} from 'class-validator';
import { ExistingTypes, Exists } from '../../common/validators/isExists';
import { User } from '../entities/user.entity';
import { ObjectsKeys } from '../../permissions/constants/objects.constant';
import { Action } from '../../common/enums/action.enum';

@ObjectType()
@InputType()
export class SinglePermission {
  @Field()
  action: Action;

  @Field({ nullable: true })
  object?: ObjectsKeys;
}

@InputType()
export class UpdateUserPermissionsInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  @Expose()
  @Validate(
    Exists,
    [User, ({ object: { id } }) => ({ id }), ExistingTypes.ShouldBeExisted],
    {
      message: ({ property }: ValidationArguments) => 'User is not exist',
    },
  )
  id: number;

  @Field(() => [SinglePermission])
  @Expose()
  @IsArray()
  @IsNotEmpty({ each: true })
  permissions: SinglePermission[];
}
