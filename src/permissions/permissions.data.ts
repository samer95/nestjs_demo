import { PermissionItem } from './decorators/permission-item.decorator';
import { PermissionMode } from './decorators/permission-mode.enum';
import { PermissionType } from './decorators/permission-type.enum';
import { Permission } from './entities/permission.entity';
import { PERMISSIONS_DEF } from './constants/permissions-def.constant';
import { CRUD_PERMISSIONS } from './constants/crud-permissions.constant';

function renderValue(
  renderType: PermissionMode,
  key: (() => PermissionItem) | string,
): string {
  if (typeof key === 'string') {
    const permission = CRUD_PERMISSIONS[key];
    return permission ? permission[renderType] : key;
  }

  if (typeof key === 'function') {
    return key()[renderType];
  }

  return key;
}

export const PERMISSIONS: Permission[] = (() => {
  return PERMISSIONS_DEF.map(permission => ({
    objectKey: permission.key,
    objectName: permission.object || '',
    objectLabel: permission.description,
    permissionType: permission.permissionType || PermissionType.CRUD,
    permissions: permission.perm.map(perm => ({
      key: renderValue(PermissionMode.KEY, perm),
      label: renderValue(PermissionMode.LABEL, perm),
    })),
  }));
})();
