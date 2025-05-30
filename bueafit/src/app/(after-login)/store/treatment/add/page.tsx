'use client';

import Button from "@/app/components/Button";
import CustomSelect from "@/app/components/CustomSelect";
import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import useDebounce from "@/app/utils/useDebounce";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Group = {
    name: string;
    id: number;
};

export default function Page() {
    const [menu, setMenu] = useState(""); // 시술 메뉴
    const [menuId, setMenuId] = useState<number | null>(null); // 시술 메뉴 ID
    const [name, setName] = useState(""); // 시술 이름
    const [hour, setHour] = useState(0); // 시술 시간 - 시
    const [minute, setMinute] = useState(0); // 시술 시간 - 분
    const time = hour + minute // 시술 시간
    const [price, setPrice] = useState(""); // 시술 가격
    const hourOption = [
        { value: 0, label: "0시간" },
        { value: 60, label: "1시간" },
        { value: 120, label: "2시간" },
        { value: 180, label: "3시간" },
        { value: 240, label: "4시간" },
        { value: 300, label: "5시간" },
        { value: 360, label: "6시간" },
        { value: 420, label: "7시간" },
        { value: 480, label: "8시간" }
    ];

    const minuteOption = [
        { value: 0, label: "0분" },
        // { value: 15, label: "15분" },
        { value: 30, label: "30분" },
        // { value: 45, label: "45분" },
    ];

    const nameRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLInputElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);

    const route = useRouter(); // 시술 메뉴 관리 페이지로 이동
    const accessToken = useAuthStore.getState().access_token;

    // 메뉴 리스트
    const [menuList, setMenuList] = useState<Group[]>([]);

    // 검색 중복 방지
    const debouncedGroup = useDebounce(menu, 300);
    const [showMenuList, setShowmenuList] = useState(false);

    // 그룹 검색
    const searchMenu = async () => {
        const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatment-menus`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const data = await res.json()
        const items = data.items
        const mappingData = items.map((item: any) => ({name: item.name, id: item.id}))
        setMenuList(mappingData);
    }

    useEffect(() => {
        if (debouncedGroup !== "") {
            searchMenu();
        }
    }, [debouncedGroup]);

    // 1. 신규 시술 메뉴 등록
    // const newMenu = async () => {
    //     try {            
    //         // input required 충족 안될 때
    //         // menu 없을 때
    //         if(menu === "") {
    //             menuRef.current?.focus()
    //             return;
    //         }            
    //         const response = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatment-menus`, {
    //             method: "POST",
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${accessToken}`,
    //             },
    //             body: JSON.stringify({
    //                 "name" : menu,
    //             })            
    //         })
            
    //         if(response.status === 201) {
    //             const res = await response.json();
    //             setMenuId(res.id);
    //             return;
    //         }

    //         if(response.status === 422) {
    //             const errorMsg = response.json();
    //             errorMsg.then((res) => alert(res.detail[0].message));
    //         }
    //         if(response.status === 409) {
    //             const errorMsg = response.json();
    //             errorMsg.then((res) => alert(res.detail[0].message));
    //         }
    //     }catch(e){
    //         console.error(e)
    //         alert('고객 추가 등록 중 오류가 발생했습니다. 다시 등록해주세요.')
    //     }
    // }

    // 2. 시술 메뉴 등록 후 시술 종류 등록
    const newTreatment = async () => {
    try {
        if (menu === "") {
            menuRef.current?.focus();
            return;
        }

        // menuId가 없다면 → 기존 목록에서 찾거나 새로 등록
        let resolvedMenuId = menuId;

        if (!resolvedMenuId) {
            const existing = menuList.find((item) => item.name === menu);

            if (existing) {
                resolvedMenuId = existing.id;
            } else {
                const response = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatment-menus`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ name: menu }),
                });

                if (response.status === 201) {
                    const res = await response.json();
                    resolvedMenuId = res.id;
                } else if (response.status === 409 || response.status === 422) {
                    const errorMsg = await response.json();
                    alert(errorMsg.detail[0]?.message || "시술 메뉴 등록 오류");
                    return;
                } else {
                    alert("시술 메뉴 생성 중 오류가 발생했습니다.");
                    return;
                }
            }
        }

        // 필수값 유효성 체크
        if (name === "") {
            nameRef.current?.focus();
            return;
        }
        if (time === 0) {
            timeRef.current?.focus();
            return;
        }
        if (price === "") {
            priceRef.current?.focus();
            return;
        }

        // 시술 종류 등록
        const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatment-menus/${resolvedMenuId}/details`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                name,
                duration_min: time,
                base_price: price,
            }),
        });

        if (res.status === 201) {
            route.push("/store/treatment");
        } else {
            const err = await res.json();
            alert(err.detail?.[0]?.message || "시술 등록 실패");
        }

    } catch (e) {
        console.error(e);
        alert("시술 등록 중 오류가 발생했습니다.");
    }
};


    return (
        <div className="min-h-screen h-full py-6 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto h-full bg-white rounded-2xl flex flex-col justify-between">
                <div className="grow">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">
                        시술 메뉴 등록
                    </h1>
                    <p className="mb-8">가게의 시술 메뉴를 등록하실 수 있습니다.</p>

                    <section className="space-y-10 rounded-2xl shadow-sm p-6 h-full max-h-[600px]">
                        <div className="space-y-1 relative">
                            <label className="block text-sm font-medium text-gray-700">
                                시술 메뉴<span className="text-red-600 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="예: 눈썹"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                value={menu}
                                onChange={(e) => setMenu(e.target.value)}
                                onFocus={() => setShowmenuList(true)}
                                ref={menuRef}
                            />

                            {
                                showMenuList && (
                                    <ul className="absolute z-10 bg-white w-full border-l border-r border-t border-gray-400 max-h-40 overflow-y-auto p-0" onMouseDown={(e) => e.stopPropagation()}>
                                        {
                                            menuList.map((menu, index) => (
                                                <li
                                                    key={index}
                                                    className="text-sm text-gray-800 cursor-pointer hover:text-violet-500 h-[35px] border-b border-gray-400 flex items-center pl-2"
                                                    onClick={() => {
                                                        setMenu(menu.name);
                                                        setMenuId(menu.id);
                                                        setMenuList([]);
                                                        setShowmenuList(false);                                        
                                                    }}
                                                >
                                                    {menu.name}
                                                </li>
                                            ))
                                        }   
                                    </ul>
                                )
                            }
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                시술 이름<span className="text-red-600 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="예: 콤보 눈썹"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onFocus={() => setShowmenuList(false)}
                                ref={nameRef}   
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                시술 소요 시간<span className="text-red-600 ml-1">*</span>
                            </label>
                            <div className="flex gap-2">
                                <CustomSelect
                                    value={hour}
                                    onChange={setHour}
                                    onFocus={() => setShowmenuList(false)}
                                    options={hourOption}
                                    placeholder="예약 시간을 선택하세요."
                                />
                                {/* <select 
                                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                    value={hour}
                                    onChange={(e) => setHour(Number(e.target.value))}
                                    onFocus={() => setShowmenuList(false)}
                                >
                                    <option value={0}>0시간</option>
                                    <option value={60}>1시간</option>
                                    <option value={120}>2시간</option>
                                    <option value={180}>3시간</option>
                                    <option value={240}>4시간</option>
                                    <option value={300}>5시간</option>
                                    <option value={360}>6시간</option>
                                    <option value={420}>7시간 이상</option>
                                </select> */}
                                <CustomSelect 
                                    value={minute}
                                    onChange={setMinute}
                                    onFocus={() => setShowmenuList(false)}
                                    placeholder="0분"
                                    options={minuteOption}
                                />
                                {/* <select 
                                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                    value={minute}
                                    onChange={(e) => setMinute(Number(e.target.value))}
                                    onFocus={() => setShowmenuList(false)}
                                >
                                    <option selected value={0}>0분</option>
                                    <option value={15}>15분</option>
                                    <option value={30}>30분</option>
                                    <option value={45}>45분</option>
                                    <option value={60}>60분</option>
                                </select> */}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                가격<span className="text-red-600 ml-1">*</span>
                            </label>
                            <input
                                type="number"
                                min={0}
                                required
                                placeholder="시술 가격을 입력해주세요."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                onFocus={() => setShowmenuList(false)}
                                ref={priceRef}
                            />
                        </div>
                    </section>
                </div>


                <div className="pt-5 mb-5 flex items-center space-x-3">
                    <button 
                        type="button"
                        className="w-full h-[40px] cursor-pointer border border-gray-300 box-border"
                        onClick={() => {
                            if(name === "" && menu === "" && time === 0 && price === "" ) {
                                route.push('/store/treatment');
                            }else {
                                if(confirm('작성된 정보가 있습니다. 정말 취소하시겠습니까?')) {
                                    route.push('/store/treatment')
                                }
                            }
                        }}
                    >
                        등록 취소
                    </button>
                    <Button
                        type="submit"
                        className="w-full h-[40px] bg-violet-400 hover:bg-violet-500 text-white font-semibold py-2 px-4"
                        onClick={() => {newTreatment()}}
                    >
                        시술 추가
                    </Button>
                </div>
            </div>
        </div>
    );
}
