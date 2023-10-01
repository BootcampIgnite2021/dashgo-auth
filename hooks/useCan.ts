import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { validateUserPermissions } from "../utils/validateUserPermissions";

export type Permissions = "users.list" | "users.create" | "metrics.list";

export type Roles = "administrator" | "editor";

type UseCanParams = {
  permissions?: Array<Permissions>;
  roles?: Array<Roles>;
};

export function useCan({ permissions = [], roles = [] }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserPermissions({
    user,
    permissions,
    roles,
  });

  return userHasValidPermissions;
}
