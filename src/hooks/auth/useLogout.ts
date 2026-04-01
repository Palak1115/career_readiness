'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/store/hooks';
import { logout } from '@/redux/features/auth/authSlice';
import { ROUTES } from '@/routerKeys';

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return () => {
    // Clear auth cookie
    document.cookie = 'auth=; path=/; max-age=0;';

    // Clear Redux state
    dispatch(logout());

    // Redirect to login
    router.replace(ROUTES.WELCOME.WELCOME);
  };
}
