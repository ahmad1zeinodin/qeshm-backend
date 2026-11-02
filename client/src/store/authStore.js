import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null, // ✅ تغییر نام به accessToken
      
      login: (userData, tokenValue) => {
        localStorage.setItem('accessToken', tokenValue); // ✅ تغییر نام کلید در localStorage
        set({ user: userData, accessToken: tokenValue });
      },

      setAuth: (userData, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ user: userData, accessToken: accessToken });
      },
      
      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);