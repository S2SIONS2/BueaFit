'use client';

import Button from "@/app/components/Button";
import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import useDebounce from "@/app/utils/useDebounce";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Group = {
    group_name: string;
    count: number;
    items: any[];
};

export default function Page() {
    const [name, setName] = useState(""); // 이름
    const [phone, setPhone] = useState(""); // 전화번호
    const [group, setGroup] = useState(""); // 그룹
    const [memo, setMemo] = useState(""); // 메모

    const nameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);

    const route = useRouter(); // customer 페이지로 이동
    const accessToken = useAuthStore.getState().access_token;

    // 그룹 리스트
    const [groupList, setGroupList] = useState<Group[]>([]);

    // 검색 중복 방지
    const debouncedGroup = useDebounce(group, 300);
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
        if (debouncedGroup !== "") {
            searchGroup();
        }
    }, [debouncedGroup]);

    // 신규 고객 등록
    const newCustomer = async () => {
        try {
            // input required 충족 안될 때
            // name 없을 때
            if(name === ""){            
                nameRef.current?.focus()
                return;
            }
            if(phone === "") {
                phoneRef.current?.focus()
                return;
            }
            const response = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/phonebooks`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    "name" : name,
                    "phone_number" : phone,
                    "group_name" : group,
                    "memo" : memo
                })            
            })
            
            if(response.status === 201) {
                route.push('/store/customer')
                return;
            }

            if(response.status === 409) {
                alert('등록 된 전화번호 입니다.')
            }

            if(response.status === 422) {
                const errorMsg = response.json();
                errorMsg.then((res) => alert(res.detail[0].msg));
            }
        }catch(e){
            console.error(e)
            alert('고객 추가 등록 중 오류가 발생했습니다. 다시 등록해주세요.')
        }
    }

    return (
        <div className="min-h-screen h-full py-6 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto h-full bg-white rounded-2xl flex flex-col justify-between">
                <div className="grow">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">
                        신규 고객 등록
                    </h1>
                    <p className="mb-8">신규로 등록할 고객 정보를 입력해주세요.</p>

                    <form className="space-y-10 rounded-2xl shadow-sm p-6 h-full max-h-[600px]">
                        <div>
                            <label className="block mb-2 text-base font-bold font-medium text-gray-700">
                                고객 명
                                <span className="text-red-900"> *</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                ref={nameRef}
                                placeholder="고객명을 입력해주세요."
                                onChange={(e) => setName(e.target.value)}
                                onFocus={() => setShowGroupList(false)}
                                required
                                className="w-full h-[30px] border border-t-[0] border-l-[0] border-r-[0] rounded-none border-gray-300 focus:outline-none focus:ring-1 focus:ring-top-none focus:ring-violet-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-base font-bold font-medium text-gray-700">
                                전화번호
                                <span className="text-red-900"> *</span>
                            </label>
                            <p className="text-sm text-gray-600 mb-1">-를 제외한 숫자만 적어주세요.</p>
                            <input
                                type="number"
                                inputMode="numeric"
                                value={phone}
                                ref={phoneRef}
                                placeholder="전화번호를 입력해주세요."
                                onChange={(e) => setPhone(e.target.value)}
                                onFocus={() => setShowGroupList(false)}
                                required
                                className="w-full h-[30px] border border-t-[0] border-l-[0] border-r-[0] rounded-none border-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-base font-bold font-medium text-gray-700">그룹</label>
                            <input
                                type="text"
                                value={group}
                                placeholder="그룹을 입력해주세요."
                                onChange={(e) => setGroup(e.target.value)}
                                onFocus={() => setShowGroupList(true)}
                                className="w-full h-[30px] border border-t-[0] border-l-[0] border-r-[0] rounded-none border-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                            />
                            {
                                showGroupList && (
                                    <ul className="absolute z-10 bg-white w-full border-l border-r border-gray-400 max-h-40 overflow-y-auto p-0">
                                        {
                                            groupList.map((group, index) => (
                                                <li
                                                    key={index}
                                                    className="text-sm text-gray-800 cursor-pointer hover:text-violet-500 h-[35px] border-b border-gray-400 flex items-center pl-2"
                                                    onClick={() => {
                                                        setGroup(group.group_name);
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
                        </div>

                        <div>
                            <label className="block mb-2 text-base font-bold font-medium text-gray-700">메모</label>
                            <input
                                type="text"
                                value={memo}
                                placeholder="메모를 입력해주세요."
                                onChange={(e) => setMemo(e.target.value)}
                                onFocus={() => setShowGroupList(false)}
                                className="w-full h-[30px] border border-t-[0] border-l-[0] border-r-[0] rounded-none border-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                            />
                        </div>

                    </form>
                </div>

                <div className="pt-5 mb-5 flex items-center space-x-3">
                    <button 
                        type="button"
                        className="w-full h-[40px] cursor-pointer border border-gray-300 box-border"
                        onClick={() => {
                            if(name === "" && phone === "" && group === "" && memo === "" ) {
                                route.push('/store/customer');
                            }else {
                                if(confirm('작성된 정보가 있습니다. 정말 취소하시겠습니까?')) {
                                    route.push('/store/customer')
                                }
                            }
                        }}
                    >
                        등록 취소
                    </button>
                    <Button
                        type="button"
                        className="w-full h-[40px] bg-violet-400 hover:bg-violet-500 text-white font-semibold py-2 px-4"
                        onClick={() => {newCustomer()}}
                    >
                    고객 등록
                    </Button>
                </div>
            </div>
        </div>
    );
}
