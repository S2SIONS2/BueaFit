'use client'

import { useEffect, useState } from "react";
import { fetchInterceptors } from "../utils/fetchInterceptors";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "../components/Button";

export default function ModifyTreatmentMenu() {
    const [treatment, setTreatment] = useState<any[]>([]); // 시술 api 정보
    const [menu, setMenu] = useState(''); // 시술 메뉴
    const [modifyName, setModifyName] = useState(''); // 시술 이름

    const accessToken = useAuthStore.getState().access_token;

    // 시술 메뉴 조회
    const fetchTreatment = async () => {
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
                setTreatment(data.items);
            }
        }catch(e) {
            console.error(e);
        }
    }
        
    useEffect(() => {
        fetchTreatment();
    }, [])

    const modify = async () => {
        return;
    }

    const deleteTreatment = async () => {
        return;
    }

    return (
        <section className="p-2 bg-white rounded-2xl w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">시술 수정</h1>
            <form className="space-y-4 w-full">
                <label className="relative w-full">
                    <p className="text-sm font-medium text-gray-700 mb-1">시술 메뉴</p>
                    <input
                        type="text"
                        value={menu}
                        onChange={(e) => setMenu(e.target.value)}
                        // placeholder={customer.group_name}
                        // onFocus={() => setShowGroupList(true)}
                        className="w-full py-2 border-b border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    {
                        treatment && (
                            <ul className="absolute z-10 bg-white w-full border-l border-r border-gray-400 max-h-40 overflow-y-auto p-0">
                                {
                                    treatment.map((group, index) => (
                                        <li
                                            key={index}
                                            className="text-sm text-gray-800 cursor-pointer hover:text-violet-500 h-[35px] border-b border-gray-400 flex items-center pl-2"
                                            onClick={() => {
                                                // setModifyGroup(group.group_name);
                                                // setGroupList([]);
                                                // setShowGroupList(false);                                                
                                            }}
                                        >
                                            {group.group_name}
                                        </li>
                                    ))
                                }   
                            </ul>
                        )
                    }

                </label>
                <label>
                    <p className="text-sm font-medium text-gray-700 mb-1 mt-3">시술 이름</p>
                    <input
                        type="text"
                        value={modifyName}
                        onChange={(e) => setModifyName(e.target.value)}
                        // placeholder={customer.name}
                        // onFocus={() => setShowGroupList(false)}
                        className="w-full py-2 border-b border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 mb-3"
                    />
                </label>
                {/* <label>
                    <p className="text-sm font-medium text-gray-700 mb-1 mt-3">가격</p>
                    <input
                        type="text"
                        value={modifyPhone}
                        onChange={(e) => setModifyPhone(e.target.value)}
                        placeholder={customer.phone_number.toString()}
                        onFocus={() => setShowGroupList(false)}
                        className="w-full py-2 border-b border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </label>
                <label>
                    <p className="text-sm font-medium text-gray-700 mb-1 mt-3">시간</p>
                    <input
                        type="text"
                        value={modifyMemo}
                        onChange={(e) => setModifyMemo(e.target.value)}
                        onFocus={() => setShowGroupList(false)}
                        placeholder={customer.memo}
                        className="w-full py-2 border-b border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </label> */}
                <div className="flex justify-center mt-6 gap-2">
                    <Button type="submit" className="cursor-pointer rounded-sm border border-gary-500 pt-1 pb-1 pl-4 pr-4 w-auto" onClick={modify}>수정</Button>                    
                    <button type="button" className="cursor-pointer rounded-sm border border-gary-500 pt-1 pb-1 pl-4 pr-4 bg-gray-500 text-white" onClick={deleteTreatment}>삭제</button>
                </div>
            </form>
        </section>
    )
}