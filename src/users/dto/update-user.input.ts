import { Field, InputType } from '@nestjs/graphql';
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
import { ExistingTypes, Exists } from '../../common/validators/isExists';
import { User } from '../entities/user.entity';
import { UserType } from '../../common/enums/user-type.enum';
import { Gender } from '../../common/enums/gender.enum';
import { Language } from '../../common/enums/language.enum';
import { Not } from 'typeorm';
import { Certificate } from '../../certificates/entities/certificate.entity';

@InputType()
export class UpdateUserInput {
  @Field()
  @IsInt()
  @IsNotEmpty()
  @Validate(
    Exists,
    [User, ({ object: { id } }) => ({ id }), ExistingTypes.ShouldBeExisted],
    {
      message: ({ property }: ValidationArguments) => 'User is not exist',
    },
  )
  id: number;

  @Field({ nullable: true })
  @Expose()
  @IsInt()
  @Validate(
    Exists,
    [
      Certificate,
      ({ object: { certificate_id } }) => ({ id: certificate_id }),
      ExistingTypes.ShouldBeExisted,
    ],
    {
      message: ({ property }: ValidationArguments) =>
        'Certificate is not exist',
    },
  )
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
  @Validate(
    Exists,
    [User, ({ object: { id, email } }) => ({ id: Not(id), email })],
    {
      message: ({ property }: ValidationArguments) =>
        `${property} is already exist`,
    },
  )
  email: string;

  @Field({ nullable: true })
  @Expose()
  @IsPhoneNumber('TR')
  @IsOptional()
  @Validate(
    Exists,
    [User, ({ object: { id, phone } }) => ({ id: Not(id), phone })],
    {
      message: ({ property }: ValidationArguments) =>
        `${property} is already exist`,
    },
  )
  phone?: string;

  @Field({ nullable: true })
  @Expose()
  @IsOptional()
  @IsEnum(UserType)
  user_type?: string;

  @Field({ nullable: true })
  @Expose()
  @IsOptional()
  @IsEnum(Gender)
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
  @IsEnum(Language)
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
