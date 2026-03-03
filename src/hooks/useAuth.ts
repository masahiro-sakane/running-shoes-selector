import { useAuthContext } from "@/contexts/AuthContext";

/**
 * 認証状態を取得するフック。
 * AuthProvider の配下で使用すること。
 *
 * @returns { user, session, isLoading, signOut }
 */
export function useAuth() {
  return useAuthContext();
}
