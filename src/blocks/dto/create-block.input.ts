import { Field, InputType, Int } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateBlockInput {
  @Field()
  @Expose()
  @IsString()
  @IsNotEmpty()
  b_hash: string;

  @Field(() => Int)
  @Expose()
  @IsInt()
  @IsNotEmpty()
  b_number: number;

  @Field(() => [String])
  @Expose()
  @IsNotEmpty()
  @IsArray()
  transactions: string[];
}
