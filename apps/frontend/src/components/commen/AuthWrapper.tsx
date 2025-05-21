"use client";
import { logoutUser, updateIsLoading, updateToken, updateUser } from "@/lib/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getLocalInfo } from "@/utils/secureStorage";
import React, { ReactNode, useEffect } from "react";

const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const userKey = `${process.env.NEXT_PUBLIC_USER_INFO_KEY}`;
  const tokenKey = `${process.env.NEXT_PUBLIC_TOKEN_KEY}`;
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((store) => store.auth);


  useEffect(() => {
    const userInfo = getLocalInfo(userKey);
    const token = getLocalInfo(tokenKey);

    if(token && userInfo){
        dispatch(updateToken(token));
        dispatch(updateUser(userInfo));
    } else {
        dispatch(logoutUser())
    }
    dispatch(updateIsLoading(false));

  }, []);

  if(isLoading){
    return;
  }

  return children;
};

export default AuthWrapper;
