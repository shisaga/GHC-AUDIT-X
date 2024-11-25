"use client";
import { useLogin } from "@/hooks/auth/useLogin";
import { useLogout } from "@/hooks/auth/useLogout";
import { useCookie } from "@/hooks/auth/useCookie";
import { useUserInfo } from "@/hooks/useUserInfo";
import { UserInfo } from "@/types/user";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext } from "react";
import { cookies } from "next/headers";

interface AuthContextInterface {
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  userInfo?: UserInfo;
  isFetchingUserInfo: boolean;
  handleRefetch: () => void;
}

export const UserAccessContext = createContext({ role: "" } as any);
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const AuthContext = createContext({} as AuthContextInterface);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authKey, setAuthKey] = useCookie<string>("authKey", "");
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggingIn, login } = useLogin();
  const { isLoggingOut, logout } = useLogout();
  const { data: userInfo, error, isFetching, refetch } = useUserInfo(authKey);

  if (error) {
    if (pathname !== "/signin") {
      router.push("/signin");
    }
  }
  const handleRefetch = async () => {
    try {
      await refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    await login({ email, password })
      .then((data: any) => {
        const key = data.accessToken;
        setAuthKey(key as string);
        return key;
      })
      .catch((err: any) => {
        throw err;
      });
  };

  const handleLogout = async () => {
    await logout()
      .then((data: any) => {
        setAuthKey("");
        
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggingIn,
        isLoggingOut,
        login: handleLogin,
        logout: handleLogout,
        userInfo,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        handleRefetch,
        isFetchingUserInfo: isFetching,
      }}
    >
      <UserAccessContext.Provider
        value={{ role: userInfo ? userInfo?.roles?.[0]?.name : "" }}
      >
        {children}
      </UserAccessContext.Provider>
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
