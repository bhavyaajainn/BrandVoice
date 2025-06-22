import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getBrandRequest } from '@/lib/redux/actions/brandActions';
import { useAuthContext } from '@/lib/AuthContext';
import { getTokenRequest } from '../redux/actions/authActions';

export const useBrandData = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuthContext();
  const { brand, loading: brandLoading, error: brandError } = useAppSelector(state => state.brand);
  const { token } = useAppSelector(state => state.auth);
  useEffect(() => {
          if (user && !token) {
              dispatch(getTokenRequest())
          }
      }, [user, token, dispatch])

  useEffect(() => {
    if (user && token && !brand && !brandLoading && !brandError) {
      dispatch(getBrandRequest(user.uid));
    }
  }, [user, token, brand, brandLoading, brandError, dispatch]);

  return { brand, brandLoading, brandError };
};