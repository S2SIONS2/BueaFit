'use client';

import MainNav from "@/app/components/MainNav"
import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const route = useRouter();
    const path = usePathname();

    useEffect(() => {
      if(path !== 'selectstore'){
        const checkSelectedShop = async () => {
          const access_token = useAuthStore.getState().access_token
    
          try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops/selected`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: access_token ? access_token : ''
              }
            })
            const data = await res.json();

            if(res.status === 404 && data.detail.code === 'SHOP_SHOP_NOT_SELECTED'){ 
              route.push('/selectstore');
            }
          }catch(e) {
            console.error(e);
          }
        }  
        checkSelectedShop();
      }

    }, [])
    return (
      <div className="flex w-screen h-screen overflow-hidden">
        <MainNav />
        <main className="w-[calc(100%-350px)] h-screen overflow-auto">
          {children}
        </main>
      </div>
    )
  }