'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogOutNav from "@/app/components/LogoutNav";
import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { useAuthStore } from "@/store/useAuthStore";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [shops, setShops] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();
  const accessToken = useAuthStore.getState().access_token;

  useEffect(() => {
    try{
      const fetchShops = async () => {
        const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });
  
        const data = await res.json();

        // 저장된 가게가 없을 때
        if (data.length === 0) {
          router.replace("/setstore");
        } else {
          setShops(data.items);
          setLoading(false)
        }
      }
      fetchShops();
    }catch(e) {
      console.error(e)
    }
  }, [router]);

  const handleSelectShop = async (shopName: string, shopId: number | string) => {
    const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops/selected`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      body: JSON.stringify({ shop_id: shopId }),
    });

    if (res.status === 204) {
      router.push(`/store/main`);
    } else {
      alert("가게 선택에 실패했습니다.");
    }
  };

  return (
    <section className="min-h-screen flex flex-col bg-gray-50">
      <LogOutNav />
      <div className="min-h-[calc(100vh-50px)] flex items-center justify-center ">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            관리하실 가게를 선택해주세요.
          </h2>
          <ul className="space-y-4">
            {
              loading && (
                <div className="flex items-center justify-center">
                  <LoadingSpinner className="w-10 h-10"/>
                </div>
              )
            }
            {shops.map((shop) => (
              <li key={shop.id}>
                <button
                  type="button"
                  onClick={() => handleSelectShop(shop.name, shop.id)}
                  className="w-full text-center bg-violet-300 hover:bg-violet-400 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-colors duration-200 cursor-pointer"
                >
                  {shop.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

