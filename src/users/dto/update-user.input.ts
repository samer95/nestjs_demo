import { CreateUserInput } from './create-user.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Validate,
  ValidationArguments,
} from 'class-validator';
import { Exists } from '../../validators/isExists';
import { User } from '../entities/user.entity';
import { UserTypes } from '../../enums/UserTypes';
import { Genders } from '../../enums/Genders';
import { Languages } from '../../enums/Languages';
import { Not } from 'typeorm';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field()
  @IsInt()
  @IsNotEmpty()
  @Validate(Exists, [User, ({ object: { id } }) => ({ id: Not(id) })], {
    message: ({ property }: ValidationArguments) => 'User is not exist',
  })
  id: number;

  @Field()
  @Expose()
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @Field()
  @Expose()
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @Field()
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @Validate(Exists, [User, ({ object: { id, email } }) => ({ id: Not(id), email }), { 'users.id != :id': { id: 5 } }], {
    message: ({ property }: ValidationArguments) => `${property} is already exist`,
  })
  email: string;

  @Field({ nullable: true })
  @Expose()
  @IsPhoneNumber('TR')
  @IsOptional()
  @Validate(Exists, [User, ({ object: { id, phone } }) => ({ id: Not(id), phone })], {
    message: ({ property }: ValidationArguments) => `${property} is already exist`,
  })
  phone?: string;

  @Field({ nullable: true })
  @Expose()
  @IsOptional()
  @IsEnum(UserTypes)
  user_type?: string;

  @Field({ nullable: true })
  @Expose()
  @IsOptional()
  @IsEnum(Genders)
  gender?: string;

  @Field({ nullable: true })
  @Expose()
  @IsOptional()
  @IsDate()
  birthdate?: string;

  @Field({ nullable: true })
  @Expose()
  @IsOptional()
  @IsInt()
  max_facilities_count?: number;

  @Field({ nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  @IsEnum(Languages)
  lang?: string;

  @Field({ nullable: true })
  @Expose()
  @IsString()
  @IsOptional()
  about?: string;

  @Field({ nullable: true })
  @Expose()
  @IsString()
  @IsOptional()
  address?: string;
}
