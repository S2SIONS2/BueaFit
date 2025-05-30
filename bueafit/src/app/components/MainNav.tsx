"use client"

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faRectangleList, faUserPen, faGear, faRightFromBracket, faCaretDown, faSprayCan, faCircle, faCalendarDay, faShop } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchInterceptors } from "../utils/fetchInterceptors";
import { useAuthStore } from "@/store/useAuthStore";

export default function MainNav() {
    // nav 경로 따라 배경색 변경
    const path = usePathname();

    // zustand에 있는 액세스 토큰
    const accessToken = useAuthStore.getState().access_token;

    // user name
    const [name, setName] = useState('')

    // 내 정보 가져오기
    const fetchUser = async () => {
        const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/users/me`, {
            method: "GET",
            // credentials: true
        })
        const data = await res.json();

        if(res.status === 200) {
            setName(data.name)
        }
    }

    // 현재 선택된 가게 정보 가져오기
    const [list, setList] = useState<{ name?: string, id?: number }>({ id: 0, name: "" });
    useEffect(() => {
        const getList = async () => {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops/selected`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })

            const data = await res.json()
            if(res.status === 200) {
                setList(data)
            }
        }

        getList();
        fetchUser();
    }, [])

    const logout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            
            return response;
        }catch(e) {
            console.error(e);
        }finally {
            window.location.href = '/login';
        }
    }
    
    return (
        <nav className="Nav w-[350px] h-screen bg-white shadow-md flex flex-col justify-between p-6">
            <div>
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-300">
                    <div className="w-[50px] h-[50px] bg-slate-100 flex items-center justify-center rounded-[50%]">
                        <FontAwesomeIcon icon={faStore} className="text-[25px] text-violet-400" />
                    </div>
                    <ul className="w-[calc(100%-50px)]">
                        <li className="text-gray-700 text-base font-bold">
                            <Link href={'/selectstore'} className="flex items-center">
                                {list.name}
                                <span className="ml-1">
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </span>
                            </Link>
                        </li>
                        <li className="text-gray-700 text-base">
                            {name}
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col space-y-2 text-[18px]">
                    <Link
                        href="/store/main"
                        className={`
                            text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md transition-all
                            ${
                                path === '/store/main' 
                                    ? 'bg-gray-100 text-[#111]'
                                    : ''
                            }
                        `}
                    >
                    <FontAwesomeIcon icon={faRectangleList} className="text-violet-300 mr-[10px] text-[20px] w-[20px]"/>
                        금일 현황
                    </Link>
                    <Link 
                        href={"/store/booking/calendar"}
                        className={`
                            text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md transition-all
                            ${
                                path === '/store/booking/add' || path === '/store/booking/calendar' 
                                    ? 'bg-gray-100 text-[#111]'
                                    : ''
                            }
                        `}
                    >
                        <FontAwesomeIcon icon={faCalendarDay} className="text-violet-300 mr-[10px] text-[20px] w-[20px]" />
                        예약 관리
                    </Link>
                    {
                        (path === '/store/booking/add' || path === '/store/booking/calendar') && (
                            <ul>
                                <li className="pl-5">
                                    <Link 
                                        href={"/store/booking/calendar"} 
                                        className={`flex items-center gap-2 text-[16px] mb-1 
                                            ${
                                                path === '/store/booking/calendar'
                                                    ? 'font-bold'
                                                    : ''
                                            }`}
                                    >
                                        <FontAwesomeIcon icon={faCircle} className="text-[5px]"/>
                                        예약 캘린더
                                    </Link>
                                </li>
                                <li className="pl-5">
                                    <Link 
                                        href={"/store/booking/add"} 
                                        className={`flex items-center gap-2 text-[16px] mb-1 
                                            ${
                                                path === '/store/booking/add'
                                                    ? 'font-bold'
                                                    : ''
                                            }`}
                                    >
                                        <FontAwesomeIcon icon={faCircle} className="text-[5px]"/>
                                        예약 추가
                                    </Link>
                                </li>
                            </ul>
                        )
                    }
                    {/* <Link
                        href="/store/statistics"
                        className={`
                            text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md transition-all
                            ${
                                path === '/store/statistics' 
                                    ? 'bg-gray-100 text-[#111]'
                                    : ''
                            }
                        `}
                    >
                        <FontAwesomeIcon icon={faCoins} className="text-violet-300 mr-[10px] text-[20px] w-[20px]" />
                        가게 통계
                    </Link> */}
                    <Link
                        href="/store/customer"
                        className={`
                            text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md transition-all
                            ${
                                path === '/store/customer' 
                                    ? 'bg-gray-100 text-[#111]'
                                    : ''
                            }
                        `}
                    >
                        <FontAwesomeIcon icon={faUserPen} className="text-violet-300 mr-[10px] text-[20px] w-[20px]" />
                        고객 관리
                    </Link>
                    <Link 
                        href={"/store/treatment"}
                        className={`
                            text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md transition-all
                            ${
                                path === '/store/treatment' 
                                    ? 'bg-gray-100 text-[#111]'
                                    : ''
                            }
                        `}
                    >
                        <FontAwesomeIcon icon={faSprayCan} className="text-violet-300 mr-[10px] text-[20px] w-[20px]" />
                        시술 메뉴 관리
                    </Link>
                    <Link 
                        href={{
                            pathname: `/store/manage/${list.id}`,
                        }}
                        className={`
                            text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md transition-all
                            ${path === `/store/manage/${encodeURIComponent(list.id ?? 0)}` ? 'bg-gray-100 text-[#111]' : ''}
                        `}
                        >
                        <FontAwesomeIcon icon={faShop} className="text-violet-300 mr-[10px] text-[20px] w-[20px]" />
                        직원 관리
                    </Link>
                </div>
            </div>
            <div className="flex flex-col text-gray-500 mb-[30px]">
                <Link href={'/mypage'} className="mb-[15px] hover:text-stone-700 cursor-pointer">
                    <FontAwesomeIcon icon={faGear} className="mr-[10px] w-[20px] "/>
                    My page
                </Link>
                <div className="hover:text-stone-700">
                    <button onClick={logout} className="cursor-pointer">
                        <FontAwesomeIcon icon={faRightFromBracket}  className="mr-[10px] w-[20px]"/>
                        로그아웃
                    </button>
                </div>
            </div>
        </nav>      
    )
}
