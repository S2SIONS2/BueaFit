'use client'

import LoadingSpinner from "@/app/components/LoadingSpinner";
import SearchComponent from "@/app/components/Search";
import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { useSearchStore } from "@/store/useSearchStore";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface customerType {
    id: string; 
    group_name: string; 
    name: string; 
    phone_number: string; 
    memo: string; 
}

export default function Page() {
    const [loading, setLoading] = useState(true); // api loading check
    // 고객 리스트
    const [customerList, setCustomerList] = useState<customerType[]>([])
    // const [currentPage, setCurrentPage] = useState(1) // 현재 페이지
    // const [totalPage, setTotalPage] = useState(1) // 전체 페이지
    const route = useRouter();

    // 유저 검색 시
    const word = useSearchStore((state) => state.searchParam);

    // 고객 리스트 호출
    const getList = async () => {
        const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/phonebooks?search=${word}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if(res.status === 200) {
            const data = await res.json();
            setCustomerList(data.items);
            // setCurrentPage(data.page)
            // setTotalPage(data.pages)
            setLoading(false)
        }
    }

    useEffect(() => {
        getList();
    }, [word])

    // 고객 디테일 페이지 이동

    if(loading) {
        return (
            <div className="flex items-center justify-center w-full min-h-screen">
                <LoadingSpinner className="w-15 h-15"/>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6 bg-white">            
            <section className="flex items-center justify-between pb-4">
                <h2 className="text-2xl font-semibold text-gray-800">고객 관리</h2>
            </section>

            <section className="flex flex-wrap items-center gap-3">
                <SearchComponent className={'grow h-[36px]'} placeholder="고객명 혹은 전화번호 혹은 그룹 혹은 메모"/>

                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500">
                    <option disabled selected>고객 그룹</option>
                    <option>전체</option>
                    <option>그룹1</option>
                    <option>그룹2</option>
                    <option>그룹3</option>
                </select>

                <Link
                    href="/store/customer/add"
                    className="bg-violet-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-violet-600 transition"
                >
                    고객 추가
                </Link>
            </section>

            <section className="mt-6">                
                <ul className="w-full grid grid-cols-6 bg-gray-100 text-sm font-semibold text-gray-700 px-4 py-2 rounded-t">
                    <li className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                    </li>
                    <li>그룹</li>
                    <li>고객명</li>
                    <li>전화번호</li>
                    <li>메모</li>
                </ul>
            
                <ul className="rounded-b">
                    {
                        customerList?.map((customer) => (
                            <li key={customer.id} 
                                className="w-full grid grid-cols-6 px-4 py-3 items-center text-sm hover:bg-gray-50 border border-gray-200 mt-2 rounded-lg cursor-pointer"
                                onClick={() => route.push(`/customer/detail/${encodeURIComponent(customer.id)}`)}
                            >
                                <div>
                                    <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                                </div>
                                <div className="truncate">{customer.group_name}</div>
                                <div className="truncate">{customer.name}</div>
                                <div className="truncate">{customer.phone_number}</div>
                                <div className="truncate">{customer.memo}</div>
                            </li>
                        ))
                    }
                </ul>
            </section>

        </div>
    )
}
