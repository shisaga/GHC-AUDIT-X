import { useMutation } from "react-query";

const logout = async (): Promise<string> => {
  // const { data } = await axios.post("/api/logout")
  // return data
  return "";
};

export function useLogout() {
  const { isLoading, mutateAsync } = useMutation(logout);

  return { isLoggingOut: isLoading, logout: mutateAsync };
}
