import { UserProps } from "../contexts/authContext";
import { Permissions, Roles } from "../hooks/useCan";

type User = Omit<UserProps, "email">;

type ValidateUserPermissionsParams = {
  user: User;
  permissions?: Array<Permissions>;
  roles?: Array<Roles>;
};

export function validateUserPermissions({
  user,
  permissions = [],
  roles = [],
}: ValidateUserPermissionsParams) {
  if (permissions?.length > 0) {
    const hasAllPermissions = permissions?.every((permission) => {
      return user.permissions?.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles?.length > 0) {
    const hasAllRoles = roles?.some((role) => {
      return user.roles?.includes(role);
    });

    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
}
