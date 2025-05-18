'use client';

import { useState } from "react";
import Button from "../components/Button";
import { fetchInterceptors } from "../utils/fetchInterceptors";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/store/useModalStore";

interface ModifyProps {
    customer: CustomerInfo;
    onClose: () => void;
}

interface CustomerInfo {
    id: number;
    name: string;
    phone_number: string | number;
    memo?: string;
    group_name?: string;
}

export default function ModifyCustomerModal({customer, onClose}: ModifyProps,) {
    const [modifyGroup, setModifyGroup] = useState(customer.group_name || '');
    const [modifyName, setModifyName] = useState(customer.name || '');
    const [modifyPhone, setModifyPhone] = useState(customer.phone_number || '');
    const [modifyMemo, setModifyMemo] = useState(customer.memo || '');

    const route = useRouter();

    const { closeModal } = useModalStore();

    // 내용 수정
    const modify = async () => {
        const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/phonebooks/${customer.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_name: modifyGroup,
                name: modifyName,
                phone_number: modifyPhone,
                memo: modifyMemo
            })
        })

        if(res.status === 200) {
            onClose()
            closeModal();
            
        }
    }
    // 고객 삭제
    const deleteCustomer = async () => {
        if(!confirm('정보는 삭제한 뒤 복구할 수 없습니다. 정말 삭제하시겠습니까?')) {
            return;
        }
        const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/phonebooks/${customer.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if(res.status === 204) {
            closeModal();
            route.push('/store/customer');
        }
    }
    return (
        <section className="p-2 bg-white rounded-2xl w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">고객 수정</h1>
            <form className="space-y-4">
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">그룹</p>
                    <input
                        type="text"
                        value={modifyGroup}
                        onChange={(e) => setModifyGroup(e.target.value)}
                        placeholder={customer.group_name}
                        className="w-full py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">이름</p>
                    <input
                        type="text"
                        value={modifyName}
                        onChange={(e) => setModifyName(e.target.value)}
                        placeholder={customer.name}
                        className="w-full py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">전화번호</p>
                    <input
                        type="text"
                        value={modifyPhone}
                        onChange={(e) => setModifyPhone(e.target.value)}
                        placeholder={customer.phone_number.toString()}
                        className="w-full py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">메모</p>
                    <input
                        type="text"
                        value={modifyMemo}
                        onChange={(e) => setModifyMemo(e.target.value)}
                        placeholder={customer.memo}
                        className="w-full py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
                <div className="flex justify-center mt-6 gap-2">
                    <Button type="submit" className="cursor-pointer rounded-sm border border-gary-500 pt-1 pb-1 pl-4 pr-4 w-auto" onClick={modify}>수정</Button>                    
                    <button type="button" className="cursor-pointer rounded-sm border border-gary-500 pt-1 pb-1 pl-4 pr-4 bg-gray-500 text-white" onClick={deleteCustomer}>삭제</button>
                </div>
            </form>
        </section>
    )
}