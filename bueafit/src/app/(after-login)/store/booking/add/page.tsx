'use client';

import Button from "@/app/components/Button";
import AddCustomerModal from "@/app/modal/addCustomer";
import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { useModalStore } from "@/store/useModalStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface NewCustomer {
    id: number;
    name: string;
    phone_number: string;
    group_name: string;
    memo: string;
}

export default function Page() {
    // 신규 등록된 고객 리스트
    const [newCustomerList, setNewCustomerList] = useState<NewCustomer[]>([]);
    const handleAddCustomer = (newCustomer: NewCustomer) => {
        setNewCustomerList(prev => [...prev, newCustomer]);
    };
    useEffect(() => {
        setName(newCustomerList[0]?.name || '');
        setCustomerId(newCustomerList[0]?.id || null);
    }, [newCustomerList])
    
    const [name, setName] = useState(''); // 고객 이름
    const [customerId, setCustomerId] = useState<number | null>(null); // 고객 ID
    const [customerList, setCustomerList] = useState<any[]>([]); // 고객 리스트
    const [showCustomerList, setShowCustomerList] = useState(false); // 고객 리스트 노출 여부

    const [reserveDate, setReserveDate] = useState(''); // 예약 날짜
    const [reserveTime, setReserveTime] = useState(''); // 예약 시간

    const [treatmentName, setTreatmentName] = useState(''); // 시술 이름
    const [treatmentTime, setTreatmentTime] = useState(0); // 시술 소요 시간
    const [treatmentPrice, setTreatmentPrice] = useState(0); // 시술 가격

    const [memo, setMemo] = useState(''); // 메모

    const nameRef = useRef<HTMLInputElement>(null); // 고객 이름 input ref
    const treatmentNameRef = useRef<HTMLInputElement>(null); // 시술 이름 input ref
    const reserveDateRef = useRef<HTMLInputElement>(null); // 예약 날짜 input ref
    const reserveTimeRef = useRef<HTMLInputElement>(null); // 예약 시간 input ref
    const treatmentTimeRef = useRef<HTMLSelectElement>(null); // 시술 소요 시간 select ref
    const treatmentPriceRef = useRef<HTMLInputElement>(null); // 시술 가격 input ref

    const route = useRouter();

    // modal control - 신규 고객 등록
    const openModal = useModalStore((state) => state.openModal);
    // 모달 닫힘 체크
    const [checkClose, setCheckClose] = useState(false);
    const handleModalclose = () => {
        setCheckClose(!checkClose);
    };

    // 고객 검색
    const searchCustomer = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/phonebooks`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const data = await res.json();
            if(res.status === 200) {
                const filteredData = data.items.filter((customer: any) => customer.name.includes(name));
                setCustomerList(filteredData);
            }
        }catch(e) {
            console.error(e);
        }
    }

    useEffect(() => {
        searchCustomer();
    }, [name])

    // 예약 등록
    const newReserve = async () => {
        return;
    }

    const [step, setStep] = useState(1); // step 1: 고객 작성 및 고객 등록, step 2: 예약 등록
    // step 1: 고객 작성 및 고객 등록
    const handleStep1 = () => (
        <section className="space-y-6 rounded-2xl mb-8 flex flex-col justify-between">
            <div className="space-y-1 relative">
                <label className="block text-sm font-medium text-gray-700">
                    고객 이름<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                    type="text"
                    required
                    placeholder="고객 이름을 입력해주세요."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setShowCustomerList(true)}
                    ref={nameRef}
                />
                {
                    showCustomerList && (
                        <ul className="absolute z-10 bg-white w-full border-l border-r border-gray-400 max-h-40 overflow-y-auto p-0" onMouseDown={(e) => e.stopPropagation()}>
                            {
                                customerList.map((customer, index) => (
                                    <li
                                        key={index}
                                        className="p-3 border-b border-gray-200 hover:bg-violet-50 cursor-pointer transition-colors"
                                        onClick={() => {
                                            setName(customer.name);
                                            setCustomerId(customer.id);
                                            setShowCustomerList(false);
                                        }}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-800">
                                                {
                                                    customer.group_name && (
                                                        <span>
                                                            [{customer.group_name}]
                                                        </span>        
                                                    )
                                                }
                                                {customer.name}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {customer.phone_number}
                                            </span>
                                        </div>
                                        {customer.memo && (
                                            <div className="text-xs text-gray-600 indent-[10px]">
                                                {customer.memo}
                                            </div>
                                        )}
                                    </li>

                                ))
                            }   
                        </ul>
                    )
                }
                <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-2">
                        * 고객이 등록되어 있지 않다면, 아래 버튼을 클릭하여 신규 고객을 등록해주세요.
                    </p>
                    <button 
                        type="button"
                        className="cursor-pointer text-base text-violet-500 hover:text-violet-600"
                        onClick={() => openModal(<AddCustomerModal onClose={handleModalclose} onAddCustomer={handleAddCustomer}/>)}
                    >
                        + 신규 고객 등록하기
                    </button>

                </div>
            </div>

            <div>
                <div className="pt-5 mt-20 flex items-center space-x-3">
                    <button 
                        type="button"
                        className="w-full h-[40px] cursor-pointer border border-gray-300 box-border"
                        onClick={() => {
                            if(name === "") {
                                route.push('/store/booking/calendar');
                            }else {
                                if(confirm('작성된 정보가 있습니다. 정말 취소하시겠습니까?')) {
                                    // route.push('/store/booking/calendar')
                                }
                            }
                        }}
                    >
                        등록 취소
                    </button>
                    <Button
                        type="submit"
                        className="w-full h-[40px] bg-violet-400 hover:bg-violet-500 text-white font-semibold py-2 px-4"
                        onClick={() => setStep(2)}
                    >
                        다음
                    </Button>
                </div>
            </div>
        </section>
    )
    // step 2: 예약 등록
    const handleStep2 = () => (
        <section className="space-y-6 rounded-2xl mb-8">
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    예약 날짜<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                    type="datepicker"
                    required
                    placeholder="오늘 날짜"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    value={reserveDate}
                    onChange={(e) => setReserveDate(e.target.value)}
                    // onFocus={() => showCustomerList(false)}
                    ref={reserveDateRef}   
                />
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    예약 시간<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                    type="datepicker"
                    required
                    placeholder="오늘 날짜"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    value={reserveTime}
                    onChange={(e) => setReserveTime(e.target.value)}
                    // onFocus={() => showCustomerList(false)}
                    ref={reserveTimeRef}   
                />
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
                    value={treatmentName}
                    onChange={(e) => setTreatmentName(e.target.value)}
                    // onFocus={() => showCustomerList(false)}
                    ref={treatmentNameRef}   
                />
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    시술 소요 시간<span className="text-red-600 ml-1">*</span>
                </label>
                <div className="flex gap-2">
                    <select 
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                        value={treatmentTime}
                        onChange={(e) => setTreatmentTime(Number(e.target.value))}
                        // onFocus={() => showCustomerList(false)}
                        ref={treatmentTimeRef}
                    >
                        <option value={0}>0시간</option>
                        <option value={60}>1시간</option>
                        <option value={120}>2시간</option>
                        <option value={180}>3시간</option>
                        <option value={240}>4시간</option>
                        <option value={300}>5시간</option>
                        <option value={360}>6시간</option>
                        <option value={420}>7시간 이상</option>
                    </select>
                </div>
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    시술 가격<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                    type="number"
                    min={0}
                    required
                    placeholder="시술 가격을 입력해주세요."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    value={treatmentPrice}
                    onChange={(e) => setTreatmentPrice(Number(e.target.value))}
                    // onFocus={() => showCustomerList(false)}
                    ref={treatmentPriceRef}
                />
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    메모
                </label>
                <input
                    type="text"
                    min={0}
                    required
                    placeholder="시술 가격을 입력해주세요."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    // onFocus={() => showCustomerList(false)}                            
                />
            </div>
            
            <div>
                <div className="pt-5 mt-5 flex items-center space-x-3">
                    <button 
                        type="button"
                        className="w-full h-[40px] cursor-pointer border border-gray-300 box-border"
                        onClick={() => setStep(1)}
                    >
                        이전
                    </button>
                    <Button
                        type="submit"
                        className="w-full h-[40px] bg-violet-400 hover:bg-violet-500 text-white font-semibold py-2 px-4"
                        onClick={() => {newReserve()}}
                    >
                    예약 등록
                    </Button>
                </div>
            </div>
        </section>
    )

    return (
        <div className="min-h-screen h-full py-6 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto h-full bg-white rounded-2xl">
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                    예약 등록 
                </h1>
                <p className="mb-8">시술 예약 일정을 등록 하실 수 있습니다..</p>

                {
                    step === 1 && (
                        handleStep1()
                    )
                }
                {
                    step === 2 && (
                        handleStep2()
                    )
                }

            </div>
        </div>
    );
}
