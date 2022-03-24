import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidationArguments,
} from 'class-validator';
import { IsEqualToProp } from '../../validators/isEqualToProp';
import { Expose } from 'class-transformer';
import { ExistingTypes, Exists } from '../../validators/isExists';
import { User } from '../entities/user.entity';
import { Certificate } from '../../certificates/entities/certificate.entity';

@InputType()
export class CreateUserInput {
  @Field({ nullable: true })
  @IsInt()
  @Validate(Exists, [Certificate, ({ object: { id } }) => ({ id }), ExistingTypes.ShouldBeExisted], {
    message: ({ property }: ValidationArguments) => 'Certificate is not exist',
  })
  certificate_id: number;

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
  @Validate(Exists, [User, ({ object: { email } }) => ({ email })], {
    message: ({ property }: ValidationArguments) => `${property} is already exist`,
  })
  email: string;

  @Field({ nullable: true })
  @Expose()
  @IsPhoneNumber('TR')
  @IsOptional()
  @Validate(Exists, [User, ({ object: { phone } }) => ({ phone })], {
    message: ({ property }: ValidationArguments) => `${property} is already exist`,
  })
  phone?: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(10)
  @IsNotEmpty()
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEqualToProp('password')
  password_confirmation: string;
}
