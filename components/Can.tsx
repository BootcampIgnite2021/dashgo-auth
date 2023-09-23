import { ReactNode } from "react";
import { Permissions, Roles, useCan } from "../hooks/useCan";

interface CanProps {
  children: ReactNode;
  permissions?: Array<Permissions>;
  roles?: Array<Roles>;
}

export function Can({ children, permissions, roles }: CanProps) {
  const userCanSeeComponent = useCan({ permissions, roles });

  if (!userCanSeeComponent) {
    return null;
  }

  return <>{children}</>;
}
