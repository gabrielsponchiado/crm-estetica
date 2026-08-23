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
        set({ user, token });
      },
      logout: async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch (e) {}
        set({ user: null, token: null });
        window.location.href = "/login";
      },
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      // Persiste apenas o usuário (dados não sensíveis) em localStorage.
      // O token nunca é gravado ali — a cookie 'crm_auth_token' já é a
      // única fonte de verdade para autenticação (lib/api.ts e middleware.ts
      // leem de lá), então mantê-lo também em localStorage era redundante
      // e ampliava a superfície de roubo via XSS.
      partialize: (state) => ({ user: state.user }),
    }
  )
);