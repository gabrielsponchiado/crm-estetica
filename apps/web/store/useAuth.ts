import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  clinicId: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => {
        Cookies.set("crm_auth_token", token, { expires: 7 }); // 7 days
        set({ user, token });
      },
      logout: () => {
        Cookies.remove("crm_auth_token");
        set({ user: null, token: null });
        window.location.href = "/login";
      },
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
    }
  )
);
