'use client';

import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { useAuthStore } from "@/store/useAuthStore";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const route = useRouter();
    const [menu, setMenu] = useState<any[]>([]); // 시술 메뉴 

    // access token
    const accessToken = useAuthStore.getState().access_token;

    // 시술 메뉴 조회
    const fetchTreatment = async () => {
        const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatment-menus`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        })
        const data = await res.json()
        
        if(res.status === 200){            
            setMenu(data.items);}
        }
        
    useEffect(() => {
        fetchTreatment();
    }, [])

    return (
        <div className="p-6 space-y-6 bg-white">
            <section className="flex items-center justify-between pb-4">
                <h2 className="text-2xl font-bold text-gray-800">시술 메뉴 관리</h2>
            </section>

            <section className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-gray-800">시술 메뉴</h3>
                <Link
                    href="/store/treatment/add"
                    className="bg-violet-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-violet-600 transition"
                >
                    시술 추가
                </Link>
            </section>

            <section className="mt-5">
                {
                    menu.map((item) => (
                        <article 
                            key={item.id} 
                            className="cursor-pointer p-3 shadow rounded-md mb-4 border border-gray-300"
                            onClick={() => route.push(`/store/treatment/detail/${encodeURIComponent(item.id)}`)}
                        >
                            <h3 className="list-none font-bold text-base flex items-center justify-between">
                                {item.name}
                                <span>
                                    <FontAwesomeIcon icon={faBars} />
                                </span>
                            </h3>

                            <div className="mt-3 space-y-2">
                                {item.details.length === 0 && (
                                    <p className="text-sm text-gray-400 pl-2">등록된 시술 항목이 없습니다.</p>
                                )}

                                {item.details.map((detail: any) => (
                                    <div
                                        key={detail.id}
                                        className="border border-gray-200 rounded-md p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50"
                                    >
                                        <div>
                                        <p className="font-semibold text-sm text-gray-800">{detail.name}</p>
                                        <p className="text-sm text-gray-600">
                                            소요 시간: {Math.floor(detail.duration_min / 60)}시간 {detail.duration_min % 60}분 / 가격: {detail.base_price.toLocaleString()}원
                                        </p>
                                        </div>                                        
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))
                }
            </section>
        </div>
    
    )
}