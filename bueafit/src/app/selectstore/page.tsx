'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogOutNav from "@/components/LogoutNav";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Page() {
  const [shops, setShops] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // 가게 목록 가져오기
  useEffect(() => {
    const fetchShops = async () => {
      const res = await fetch(`/api/shop`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const data = await res.json();
      if (data.length === 0) {
        router.replace("/setstore");
      } else {
        setShops(data);
        setLoading(false);
      }
    };

    fetchShops();
  }, [router]);

  // 가게 선택하기
  const handleSelectShop = async (shopName: string, shopId: number | string) => {
    const res = await fetch(`/api/shop/select`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ shop_id: shopId }),
    });

    if (res.status === 204) {
      router.push(`/store/${encodeURIComponent(shopName)}`);
    } else {
      alert("가게 선택에 실패했습니다.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50">
      <LogOutNav />
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          관리하실 가게를 선택해주세요.
        </h2>
  
        {loading ? (
          <div className="flex justify-center">
            <LoadingSpinner className="w-10 h-10" />
          </div>
        ) : (
          <ul className="space-y-4">
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
        )}
      </div>
    </section>
  );  
}