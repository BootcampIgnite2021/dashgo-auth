import { ReactNode, createContext, useEffect, useState } from "react";
import Router from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { api } from "../services/apiClient";

export type UserProps = {
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
  signOut: () => void;
  isAuthenticated: boolean;
  user: UserProps;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const initialData = {} as AuthContextData;

export const AuthContext = createContext(initialData);

let authChannel: BroadcastChannel;

export function signOut(shouldBroadcast = true) {
  destroyCookie(undefined, "nextauth.token");
  destroyCookie(undefined, "nextauth.refreshToken");

  shouldBroadcast && authChannel.postMessage("signOut");

  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({} as UserProps);
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          signOut(false);
          break;
        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get<UserProps>("/me")
        .then((response) => {
          const { email, permissions, roles } = response?.data;
          setUser({ email, roles, permissions });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  const signIn = async (credentials: CredentialsProps) => {
    try {
      const response = await api.post<ResponseUser>("sessions", credentials);
      const { permissions, roles, refreshToken, token } = response?.data;
      const { email } = credentials;

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, //30 days
        path: "/",
      });

      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, //30 days
        path: "/",
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

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
        signOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
