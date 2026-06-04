import { useEffect } from 'react';
import { useGetUserByIdQuery } from '@/store/api/apiSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';

export const useSyncLoggedUser = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  
  const { data: freshUser } = useGetUserByIdQuery(user?.id || '', {
    skip: !token || !user?.id,
    pollingInterval: 0,
  });

  useEffect(() => {
    if (freshUser) {
      dispatch(updateUser(freshUser));
    }
  }, [freshUser, dispatch]);
};
