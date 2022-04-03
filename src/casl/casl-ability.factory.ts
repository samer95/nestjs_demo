import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { User } from '../users/entities/user.entity';
import { Action } from '../common/enums/action.enum';
import { Injectable } from '@nestjs/common';
import { Certificate } from '../certificates/entities/certificate.entity';
import { PERMISSIONS } from '../permissions/permissions.data';
import { PermissionType } from '../permissions/decorators/permission-type.enum';
import { OBJECTS } from '../permissions/constants/objects.constant';
import { Permission } from '../permissions/entities/permission.entity';

// TODO: Add more subject type here
type Subjects =
  | InferSubjects<typeof Certificate | typeof User | typeof Permission>
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    this.initUserAccessibility(user, can, cannot);

    return build({
      detectSubjectType: item =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  initUserAccessibility(user: User, can, cannot) {
    if (user.is_admin) {
      can(Action.Manage, 'all'); // read-write access to everything
    }

    const userPermissions = user.permissions.map(
      p => `${p.action}.${p.object}`,
    );
    PERMISSIONS.filter(p => p.permissionType === PermissionType.CRUD).forEach(
      ({ objectKey, permissions, objectName }) => {
        permissions.forEach(({ key }) => {
          if (userPermissions.includes(`${key}.${objectKey}`)) {
            can(key, OBJECTS[objectName]);
          } else {
            cannot(key, objectKey);
          }
        });
      },
    );

    // TODO: handle custom permissions
    // can(Action.Update, Article, { authorId: user.id });
    // cannot(Action.Delete, Article, { isPublished: true });
  }
}
