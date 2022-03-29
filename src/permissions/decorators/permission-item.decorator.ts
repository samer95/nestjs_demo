import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PermissionItem {
  @Field({ nullable: true })
  key: string;

  @Field({ nullable: true })
  label: string;
}
