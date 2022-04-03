import { Action } from '../../common/enums/action.enum';

export const CRUD_PERMISSIONS = {
  m: {
    key: Action.Manage,
    label: 'Manage',
  },
  c: {
    key: Action.Create,
    label: 'Create',
  },
  r: {
    key: Action.Read,
    label: 'Read',
  },
  u: {
    key: Action.Update,
    label: 'Update',
  },
  d: {
    key: Action.Delete,
    label: 'Delete',
  },
};
