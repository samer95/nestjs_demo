import { Field, InputType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateCertificateInput {
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
