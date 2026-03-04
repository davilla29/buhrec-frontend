import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "../../utils/axios";
import { loginSuccess, logout, setLoading } from "../../redux/auth/authSlice";

const useCheckAuthInit = () => {
  const dispatch = useDispatch();
  const hasChecked = useRef(false); // prevents double call in StrictMode

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkAuth = async () => {
      try {
        dispatch(setLoading(true));

        const res = await axios.get("/auth/check-auth");

        if (res.data.success) {
          dispatch(loginSuccess(res.data.data));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        // If token is expired or invalid
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);
};

export default useCheckAuthInit;
