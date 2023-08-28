import { useContext } from "react";
import {
  AuthContext,
  AuthContextData,
  initialData,
} from "../contexts/authContext";

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (context === initialData || !context) {
    throw new Error("Error in AuthContext");
  }

  return context;
}
