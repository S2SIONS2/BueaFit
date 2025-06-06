'use client'

import { useState } from "react";
import { fetchInterceptors } from "../utils/fetchInterceptors";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "../components/Button";
import { useModalStore } from "@/store/useModalStore"

interface ModifyProps {
    shopList: shopList;
    onClose: () => void;
}

interface shopList {
    id: number,
    name: string;
    address: string,
    address_detail: string,
    phone: string,
    business_number: string,
}

export default function ModifyShop({shopList, onClose}: ModifyProps,) {
    const [modifyName, setModifyName] = useState(shopList.name || ''); // 시술 메뉴
    const [modifyAddress, setModifyAddress] = useState(shopList.address || '')
    const [modifyPhone, setModifyPhone] = useState(shopList.phone || '');

    const { closeModal } = useModalStore();

    const accessToken = useAuthStore.getState().access_token;

    // 유저 정보 수정
    const modify = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops/${shopList.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    name: modifyName,
                    address: modifyAddress,
                    phone: modifyPhone,
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

    // const deleteTreatment = async () => {
    //     if(!confirm('정보는 삭제한 뒤 복구할 수 없습니다. 정말 삭제하시겠습니까?')) {
    //         return;
    //     }
    //     const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatment-menus/${treatment.id}`, {
    //         method: 'DELETE',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         }
    //     })

    //     if(res.status === 204) {
    //         closeModal();
    //         route.push('/store/treatment');
    //     }
    // }

    return (
        <section className="p-2 bg-white rounded-2xl w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">시술 수정</h1>
            <form className="space-y-4 w-full">
                <label className="relative w-full">
                    <p className="text-base font-medium text-gray-700 mb-1 mt-2">가게 이름</p>
                    <input
                        type="text"
                        value={modifyName}
                        onChange={(e) => setModifyName(e.target.value)}
                        placeholder={shopList.name}
                        className="w-full py-2 border-b border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </label>
                <label className="relative w-full">
                    <p className="text-base font-medium text-gray-700 mb-1 mt-2">주소</p>
                    <input
                        type="text"
                        value={modifyAddress}
                        onChange={(e) => setModifyAddress(e.target.value)}
                        placeholder={shopList.address}
                        className="w-full py-2 border-b border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </label>
                <label className="relative w-full">
                    <p className="text-base font-medium text-gray-700 mb-1 mt-2">전화번호</p>
                    <input
                        type="text"
                        value={modifyPhone}
                        onChange={(e) => setModifyPhone(e.target.value)}
                        placeholder={shopList.phone}
                        className="w-full py-2 border-b border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </label>
                <div className="flex justify-center mt-6 gap-2">
                    <Button type="submit" className="cursor-pointer rounded-sm border border-gary-500 pt-1 pb-1 pl-4 pr-4 w-auto" onClick={modify}>수정</Button>                    
                    {/* <button type="button" className="cursor-pointer rounded-sm border border-gary-500 pt-1 pb-1 pl-4 pr-4 bg-gray-500 text-white" onClick={deleteTreatment}>삭제</button> */}
                </div>
            </form>
        </section>
    )
}