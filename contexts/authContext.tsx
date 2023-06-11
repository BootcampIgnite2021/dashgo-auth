import { ReactNode, createContext, useState } from "react";
import { api } from "../services/api";
import Router from "next/router";
import { setCookie } from "nookies";

type UserProps = {
  email: string;
  permissions: Array<string>;
  roles: Array<string>;
};

type ResponseUser = Omit<UserProps, "email"> & {
  token: string;
  refreshToken: string;
};

type CredentialsProps = {
  email: string;
  password: string;
};

export type AuthContextData = {
  signIn: (credentials: CredentialsProps) => Promise<void>;
  isAuthenticated: boolean;
  user: UserProps;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const initialData = {} as AuthContextData;

export const AuthContext = createContext(initialData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({} as UserProps);
  const isAuthenticated = !!user;

  const signIn = async (credentials: CredentialsProps) => {
    try {
      const response = await api.post<ResponseUser>("sessions", credentials);
      const { permissions, roles, refreshToken, token } = response.data;
      const { email } = credentials;

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, //30 days
        path: "/",
      });

      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, //30 days
        path: "/",
      });

      setUser({
        email,
        permissions,
        roles,
      });

      Router.push("/dashboard");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
