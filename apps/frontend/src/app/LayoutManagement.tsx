"use client";
import Header from "@/components/navigation/Header";
import { userRole } from "@/lib/features/authSlice";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { ToastContainer } from 'react-toastify';

const LayoutManagement = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const {user, token} = useAppSelector(store => store.auth);
  const router = useRouter();
  const adminRoutes = ['/dashboard']

  useEffect(() => {
    const isAuthenticated = (user && user.id && token) || false;
    if(pathname.includes('auth') && isAuthenticated){
      router.push('/home');
    }

    if(!pathname.includes('auth') && !isAuthenticated){
      router.push('/');
    }

    if(isAuthenticated && adminRoutes.includes(pathname) && user?.role !== userRole.ADMIN){
      router.push('/home');
    }
  }, [pathname])
  return (
    <>
     <Header />
     <ToastContainer />
      <main>
        {children}
      </main>
    </>
  );
};

export default LayoutManagement;
