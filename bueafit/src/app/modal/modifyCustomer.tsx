'use client';

import { useEffect, useState } from "react";
import Button from "../components/Button";
import { fetchInterceptors } from "../utils/fetchInterceptors";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/store/useModalStore";
import useDebounce from "../utils/useDebounce";

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

type Group = {
    group_name: string;
    count: number;
    items: any[];
};

export default function ModifyCustomerModal({customer, onClose}: ModifyProps,) {
    // 수정 할 고객 정보
    const [modifyGroup, setModifyGroup] = useState(customer.group_name || '');
    const [modifyName, setModifyName] = useState(customer.name || '');
    const [modifyPhone, setModifyPhone] = useState(customer.phone_number || '');
    const [modifyMemo, setModifyMemo] = useState(customer.memo || '');

    const route = useRouter();
    // 모달 스토어
    const { closeModal } = useModalStore();

    // 그룹 리스트
    const [groupList, setGroupList] = useState<Group[]>([]);

    // 검색 중복 방지
    const debouncedGroup = useDebounce(modifyGroup, 300);
    const [showGroupList, setShowGroupList] = useState(false);

    // 그룹 검색
    const searchGroup = async () => {
        const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/phonebooks/groups`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const data = await res.json()
        const filteredData = data.filter((name) => name.group_name !== "")
        setGroupList(filteredData);
    }

    useEffect(() => {
    if (debouncedGroup !== customer.group_name) {
        searchGroup();
    }
}, [debouncedGroup]);

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

        
        const data = await res.json()
        console.log(data)
        
        if(res.status === 409 && data.detail.code === 'PHONEBOOK_CONFLICT') {
            alert('이미 등록된 전화번호입니다.');
        }

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
            <form className="space-y-4 w-full">
                <label className="relative w-full">
                    <p className="text-sm font-medium text-gray-700 mb-1">그룹</p>
                    <input
                        type="text"
                        value={modifyGroup}
                        onChange={(e) => setModifyGroup(e.target.value)}
                        placeholder={customer.group_name}
                        onFocus={() => setShowGroupList(true)}
                        className="w-full py-2 border-b border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    {
                        showGroupList && modifyGroup !== customer.group_name && (
                            <ul className="absolute z-10 bg-white w-full border-l border-r border-gray-400 max-h-40 overflow-y-auto p-0">
                                {
                                    groupList.map((group, index) => (
                                        <li
                                            key={index}
                                            className="text-sm text-gray-800 cursor-pointer hover:text-violet-500 h-[35px] border-b border-gray-400 flex items-center pl-2"
                                            onClick={() => {
                                                setModifyGroup(group.group_name);
                                                setGroupList([]);
                                                setShowGroupList(false);                                                
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
                    <p className="text-sm font-medium text-gray-700 mb-1 mt-3">이름</p>
                    <input
                        type="text"
                        value={modifyName}
                        onChange={(e) => setModifyName(e.target.value)}
                        placeholder={customer.name}
                        onFocus={() => setShowGroupList(false)}
                        className="w-full py-2 border-b border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 mb-3"
                    />
                </label>
                <label>
                    <p className="text-sm font-medium text-gray-700 mb-1 mt-3">전화번호</p>
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
                    <p className="text-sm font-medium text-gray-700 mb-1 mt-3">메모</p>
                    <input
                        type="text"
                        value={modifyMemo}
                        onChange={(e) => setModifyMemo(e.target.value)}
                        onFocus={() => setShowGroupList(false)}
                        placeholder={customer.memo}
                        className="w-full py-2 border-b border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </label>
                <div className="flex justify-center mt-6 gap-2">
                    <Button type="submit" className="cursor-pointer rounded-sm border border-gary-500 pt-1 pb-1 pl-4 pr-4 w-auto" onClick={modify}>수정</Button>                    
                    <button type="button" className="cursor-pointer rounded-sm border border-gary-500 pt-1 pb-1 pl-4 pr-4 bg-gray-500 text-white" onClick={deleteCustomer}>삭제</button>
                </div>
            </form>
        </section>
    )
}