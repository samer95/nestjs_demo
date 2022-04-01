import { Field, ObjectType } from '@nestjs/graphql';
import { PermissionItem } from '../decorators/permission-item.decorator';

@ObjectType()
export class Permission {
  @Field()
  objectKey: string;

  @Field()
  objectName: string;

  @Field()
  objectLabel: string;

  @Field()
  permissionType: string;

  @Field(type => [PermissionItem])
  permissions: PermissionItem[];
}
