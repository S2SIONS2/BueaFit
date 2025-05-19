'use client'

import { useEffect, useState } from "react";
import { fetchInterceptors } from "../utils/fetchInterceptors";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "../components/Button";
import { useModalStore } from "@/store/useModalStore";
import { useRouter } from "next/navigation";

interface ModifyProps {
    treatment: TreatmentInfo;
    onClose: () => void;
}

interface TreatmentInfo {
    id: number;
    name: string;
    details: TreatmentDetail[];
}

interface TreatmentDetail {
    id: number
    menu_id: number;
    base_price: number;
    duration_min: number;
    name: string;
}

export default function ModifyTreatmentMenu({treatment, onClose}: ModifyProps,) {
    const [menuList, setMenuList] = useState<any[]>([]); // 시술 api 정보
    const [modifyMenu, setModifyMenu] = useState(treatment.name || ''); // 시술 메뉴
    const [showMenuList, setShowMenuList] = useState(false); // 시술 메뉴 리스트 노출 여부

    const route = useRouter();

    const { closeModal } = useModalStore();

    const accessToken = useAuthStore.getState().access_token;

    // 시술 메뉴 조회
    const fetchTreatmentMenu = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatment-menus`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            const data = await res.json()
            
            if(res.status === 200){            
                setMenuList(data.items);
            }
        }catch(e) {
            console.error(e);
        }
    }
        
    useEffect(() => {
        fetchTreatmentMenu();
    }, [modifyMenu])

    const modify = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatment-menus/${treatment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    name: modifyMenu,
                }),
            })
            
            if(res.status === 200){            
                onClose();
                closeModal();
            }
        }catch(e) {
            console.error(e);
        }
    }

    const deleteTreatment = async () => {
        if(!confirm('정보는 삭제한 뒤 복구할 수 없습니다. 정말 삭제하시겠습니까?')) {
            return;
        }
        const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatment-menus/${treatment.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if(res.status === 204) {
            closeModal();
            route.push('/store/treatment');
        }
    }

    return (
        <section className="p-2 bg-white rounded-2xl w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">시술 수정</h1>
            <form className="space-y-4 w-full">
                <label className="relative w-full">
                    <p className="text-base font-medium text-gray-700 mb-1">시술 메뉴</p>
                    <input
                        type="text"
                        value={modifyMenu}
                        onChange={(e) => setModifyMenu(e.target.value)}
                        placeholder={treatment.name}
                        onFocus={() => setShowMenuList(true)}
                        className="w-full py-2 border-b border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    {
                        showMenuList && modifyMenu !== treatment.name && (
                            <ul className="z-10 bg-white w-full border-l border-r border-gray-400 max-h-40 overflow-y-auto p-0">
                                {
                                    menuList.map((menu, index) => (
                                        <li
                                            key={index}
                                            className="text-sm text-gray-800 cursor-pointer hover:text-violet-500 h-[35px] border-b border-gray-400 flex items-center pl-2"
                                            onClick={() => {
                                                setModifyMenu(menu.name);
                                                setMenuList([]);
                                                setShowMenuList(false);                                                
                                            }}
                                        >
                                            {menu.name}
                                        </li>
                                    ))
                                }   
                            </ul>
                        )
                    }
                </label>
                <div className="flex justify-center mt-6 gap-2">
                    <Button type="submit" className="cursor-pointer rounded-sm border border-gary-500 pt-1 pb-1 pl-4 pr-4 w-auto" onClick={modify}>수정</Button>                    
                    <button type="button" className="cursor-pointer rounded-sm border border-gary-500 pt-1 pb-1 pl-4 pr-4 bg-gray-500 text-white" onClick={deleteTreatment}>삭제</button>
                </div>
            </form>
        </section>
    )
}