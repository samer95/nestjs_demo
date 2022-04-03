import { Field, InputType, Int } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class FetchBlocksInput {
  @Field(() => Int)
  @Expose()
  @IsInt()
  @IsNotEmpty()
  startNumber: number;

  @Field(() => Boolean, { defaultValue: false })
  @Expose()
  @IsBoolean()
  resetCache?: boolean;
}
