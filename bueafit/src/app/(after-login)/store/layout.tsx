'use client';

import MainNav from "@/app/components/MainNav"
import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const router = useRouter();
    const accessToken = useAuthStore.getState().access_token;
  
    // 선택된 숍 있는지 체크
    useEffect(() => {
      try{
        const fetchShops = async () => {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops/selected`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
    
            const data = await res.json();

            // 저장된 가게가 없을 때
            if (data.id === null || data.id === undefined) {
                router.replace("/selectstore");
            }
        }
            fetchShops();
        }catch(e) {
            console.error(e)
        }
      }, [router]);

    return (
      <div className="flex w-screen h-screen overflow-hidden">
        <MainNav />
        <main className="w-[calc(100%-350px)] h-screen overflow-auto">
          {children}
        </main>
      </div>
    )
  }