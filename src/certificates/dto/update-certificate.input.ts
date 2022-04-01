import { CreateCertificateInput } from './create-certificate.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidationArguments,
} from 'class-validator';
import { ExistingTypes, Exists } from '../../validators/isExists';
import { Certificate } from '../entities/certificate.entity';
import { Expose } from 'class-transformer';

@InputType()
export class UpdateCertificateInput extends PartialType(
  CreateCertificateInput,
) {
  @Field()
  @IsInt()
  @IsNotEmpty()
  @Validate(
    Exists,
    [
      Certificate,
      ({ object: { id } }) => ({ id }),
      ExistingTypes.ShouldBeExisted,
    ],
    {
      message: ({ property }: ValidationArguments) =>
        'Certificate is not exist',
    },
  )
  id: number;

  @Field()
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @Field()
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code: string;

  @Field()
  @Expose()
  @IsString()
  @IsNotEmpty()
  description: string;
}
