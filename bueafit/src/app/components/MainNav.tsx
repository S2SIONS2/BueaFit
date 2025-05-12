"use client"

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faCalendarCheck, faUserPen, faGear, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

export default function MainNav() {
    // nav 경로 따라 배경색 변경
    const path = usePathname();

    const logout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })            
            return response;
        }catch(e) {
            console.error(e);
        }
    }
    
    return (
        <nav className="Nav w-[350px] h-screen bg-white shadow-md flex flex-col justify-between p-6">
            <div>
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-300">
                    <div className="w-[50px] h-[50px] bg-slate-100 flex items-center justify-center rounded-[50%]">
                        <FontAwesomeIcon icon={faStore} className="text-[25px] text-violet-400" />
                    </div>
                    <ul>
                        <li className="text-gray-700 text-base font-bold">BueaLine</li>
                        <li className="text-gray-700 text-base">이시온</li>
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
                        <FontAwesomeIcon icon={faCalendarCheck} className="text-violet-300 mr-[10px] text-[20px] w-[20px]"/>
                        메인
                    </Link>
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
