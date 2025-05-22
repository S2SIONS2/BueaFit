'use client'

import Button from "@/app/components/Button";
import LogOutNav from "@/app/components/LogoutNav";
import ModifyShop from "@/app/modal/modifyShop";
import ModifyUser from "@/app/modal/modifyUser";
import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { useModalStore } from "@/store/useModalStore";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface userInfo {
    name: string;
    email: string;
    role: string;
}

interface shopInfo {
    id: number,
    name: string,
    address: string,
    address_detail: string,
    phone: string,
    business_number: string,
}

export default function Page() {
    const route = useRouter();
    const [userInfo, setUserInfo] = useState<userInfo>(); // 유저 정보
    const [shopInfo, setShopInfo] = useState<shopInfo[]>([]); // 가게 정보

    // 권한 라벨링
    const RoleLabel: Record<string, string> = {
        ADMIN: " 개발관리자",
        MASTER: " 사장님",
        ADMANAGERMIN: " 직원님",
    };

    // 수정 모달
    const openModal = useModalStore((state) => state.openModal);
    // 모달 닫힘 체크
    const [checkClose, setCheckClose] = useState(false);
    const handleModalclose = () => {
        setCheckClose(!checkClose);
    };

    // 유저 정보 불러오기
    const fetchUser = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/users/me`, {
                method: "GET",
                headers: {
                    "Content-Type" : "applictaion/json"
                }
            })

            const data = await res.json();
            if(res.status === 200) {
                setUserInfo(data)
            }
        }catch(e){
            console.error(e)
        }
    }

    // 숍 정보 불러오기
    const fetchShop = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops`, {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json"
                }
            })

            const data = await res.json();
            if(res.status === 200) {
                setShopInfo(data.items)
            }
        }catch(e) {
            console.error(e)
        }
    }

    const modifyShop = () => {
        return;
    }

    useEffect(() => {
        fetchUser();
        fetchShop();
    }, [checkClose])

    return(
        <div>
            <LogOutNav />
            <div className="min-h-screen p-6 max-w-3xl mx-auto space-y-8 bg-gray-50 mt-6 mb-6 shadow">
                {/* 뒤로가기 버튼 */}
                <section>
                    <button
                        type="button"
                        onClick={() => route.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-violet-500 text-sm cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faCircleLeft} />
                        <span>이전으로</span>
                    </button>
                </section>

                {/* 사용자 정보 */}
                <section className="bg-white rounded-xl shadow p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">
                            내 정보
                        </h2>
                        <button
                            type="button"
                            className="mt-2 text-sm text-violet-600 hover:underline cursor-pointer"
                            onClick={() => userInfo && openModal(<ModifyUser onClose={handleModalclose} user={userInfo} />)}
                        >
                            수정
                        </button>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>
                            <strong>이름:</strong> <span>{userInfo?.name}</span>
                            <span className="ml-2 text-xs text-gray-500">
                                {userInfo?.role ? RoleLabel[userInfo.role] || "알 수 없음" : "알 수 없음"}
                            </span>
                        </li>
                        <li>
                            <strong>이메일:</strong> {userInfo?.email}
                        </li>
                    </ul>
                </section>

                {/* 가게 정보 */}
                <section className="bg-white rounded-xl shadow p-4 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">내 가게 목록</h3>
                    <div className="space-y-4">
                        {shopInfo.map((shop, index) => (
                            <ul key={index} className="border p-3 rounded-lg space-y-1 text-sm text-gray-700 bg-gray-30">
                                <div className="flex justify-end mb-2">
                                    <button
                                        type="button"
                                        className="text-sm text-violet-600 hover:underline cursor-pointer"
                                        onClick={() => userInfo && openModal(<ModifyShop onClose={handleModalclose} shopList={shop} />)}
                                    >
                                        수정
                                    </button>
                                </div>
                                <li>
                                    <strong>가게 이름:</strong> {shop.name}
                                </li>
                                <li>
                                    <strong>가게 주소:</strong> {shop.address} {shop.address_detail}
                                </li>
                                <li>
                                    <strong>가게 번호:</strong> {shop.phone}
                                </li>
                            </ul>
                        ))}
                    </div>
                </section>

                {/* 액션 버튼 */}
                <section className="flex justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => route.back()}
                        className="w-1/2 h-10 border bg-white rounded-md text-sm hover:bg-gray-100 cursor-pointer"
                    >
                        ← 뒤로가기
                    </button>
                    <Button
                        type="button"
                        onClick={modifyShop}
                        className="w-1/2 h-10 bg-violet-500 hover:bg-violet-600 text-white rounded-md text-sm"
                    >
                        수정
                    </Button>
                </section>
            </div>
        </div>

    )
}