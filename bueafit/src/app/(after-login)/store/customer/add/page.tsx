'use client';

import Button from "@/app/components/Button";
import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function Page() {
    const [name, setName] = useState(""); // 이름
    const [phone, setPhone] = useState(""); // 전화번호
    const [group, setGroup] = useState(""); // 그룹
    const [memo, setMemo] = useState(""); // 메모

    const nameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);

    const route = useRouter(); // customer 페이지로 이동
    const accessToken = useAuthStore.getState().access_token;
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
        <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto bg-white rounded-2xl">
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                    신규 고객 등록
                </h1>
                <p className="mb-8">신규로 등록할 고객 정보를 입력해주세요.</p>

                <form className="space-y-7">
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
                            required
                            className="w-full h-[30px] border border-t-[0] border-l-[0] border-r-[0] rounded-none border-gray-300 focus:outline-none focus:ring-1 focus:ring-top-none focus:ring-violet-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-base font-bold font-medium text-gray-700">
                            전화번호
                            <span className="text-red-900"> *</span>
                        </label>
                        <input
                            type="number"
                            inputMode="numeric"
                            value={phone}
                            ref={phoneRef}
                            placeholder="전화번호를 입력해주세요."
                            onChange={(e) => setPhone(e.target.value)}
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
                            className="w-full h-[30px] border border-t-[0] border-l-[0] border-r-[0] rounded-none border-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-base font-bold font-medium text-gray-700">메모</label>
                        <input
                            type="text"
                            value={memo}
                            placeholder="메모를 입력해주세요."
                            onChange={(e) => setMemo(e.target.value)}
                            className="w-full h-[30px] border border-t-[0] border-l-[0] border-r-[0] rounded-none border-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                    </div>

                    <div className="pt-5 mt-5 flex items-center space-x-3">
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
                            type="submit"
                            className="w-full h-[40px] bg-violet-400 hover:bg-violet-500 text-white font-semibold py-2 px-4"
                            onClick={() => {newCustomer()}}
                        >
                        고객 등록
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
