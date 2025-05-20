'use client';

import Button from "@/app/components/Button";
import CustomSelect from "@/app/components/CustomSelect";
import AddCustomerModal from "@/app/modal/addCustomer";
import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

    // 시술 예약 날짜 기본 값
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;
    
    const [reserveDate, setReserveDate] = useState(todayString || ''); // 예약 날짜
    const [reserveTime, setReserveTime] = useState(''); // 예약 시간
    const timeOptions = [
        { value: "08:00:00", label: "오전 8:00" },
        { value: "08:30:00", label: "오전 8:30" },
        { value: "09:00:00", label: "오전 9:00" },
        { value: "09:30:00", label: "오전 9:30" },
        { value: "10:00:00", label: "오전 10:00" },
        { value: "10:30:00", label: "오전 10:30" },
        { value: "11:00:00", label: "오전 11:00" },
        { value: "11:30:00", label: "오전 11:30" },
        { value: "12:00:00", label: "오후 12:00" },
        { value: "12:30:00", label: "오후 12:30" },
        { value: "13:00:00", label: "오후 1:00" },
        { value: "13:30:00", label: "오후 1:30" },
        { value: "14:00:00", label: "오후 2:00" },
        { value: "14:30:00", label: "오후 2:30" },
        { value: "15:00:00", label: "오후 3:00" },
        { value: "15:30:00", label: "오후 3:30" },
        { value: "16:00:00", label: "오후 4:00" },
        { value: "16:30:00", label: "오후 4:30" },
        { value: "17:00:00", label: "오후 5:00" },
        { value: "17:30:00", label: "오후 5:30" },
        { value: "18:00:00", label: "오후 6.00" },
        { value: "18:30:00", label: "오후 6:30" },
        { value: "19:00:00", label: "오후 7:00" },
        { value: "19:30:00", label: "오후 7:30" },
        { value: "20:00:00", label: "오후 8.00" },
        { value: "20:30:00", label: "오후 8.30" },
        { value: "21:00:00", label: "오후 9.00" },
        { value: "21:30:00", label: "오후 9.30" },
        { value: "22:00:00", label: "오후 10.00" },
        { value: "22:30:00", label: "오후 10.30" },
        { value: "23:00:00", label: "오후 11.00" },
        { value: "23:30:00", label: "오후 11.30" }
    ];

    const [treatmentList, setTreatmentList] = useState<any[]>([]); // 시술 리스트
    const [showTreatmentList, setShowTreatmentList] = useState(false); // 시술 리스트 노출 여부
    const [treatmentId, setTreatmentId] = useState<number | null>(null); // 시술 ID
    const [treatmentName, setTreatmentName] = useState(''); // 시술 이름
    const [treatmentTime, setTreatmentTime] = useState(0); // 시술 소요 시간
    const treatmentTimeOptions = [
        { value: "30", label: "30분" },
        { value: "60", label: "1시간" },
        { value: "90", label: "1시간 30분" },
        { value: "120", label: "2시간" },
        { value: "150", label: "2시간 30분" },
        { value: "180", label: "3시간" },
        { value: "210", label: "3시간 30분" },
        { value: "240", label: "4시간" },
        { value: "270", label: "4시간 30분" },
        { value: "300", label: "5시간" },
        { value: "330", label: "5시간 30분" },
        { value: "360", label: "6시간" },
        { value: "390", label: "6시간 30분" },
        { value: "420", label: "7시간" },
        { value: "450", label: "7시간 30분" },
        { value: "480", label: "8시간" }
    ];
    const [treatmentPrice, setTreatmentPrice] = useState(0); // 시술 가격

    const [memo, setMemo] = useState(''); // 메모

    const nameRef = useRef<HTMLInputElement>(null); // 고객 이름 input ref
    const treatmentNameRef = useRef<HTMLInputElement>(null); // 시술 이름 input ref
    const reserveDateRef = useRef<HTMLInputElement>(null); // 예약 날짜 input ref
    const reserveTimeRef = useRef<HTMLUListElement>(null); // 예약 시간 select ref
    const treatmentTimeRef = useRef<HTMLUListElement>(null); // 시술 소요 시간 select ref
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

    // 시술 검색
    const searchTreatment = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatment-menus`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const data = await res.json();
            if(res.status === 200) {
                const filteredData = data.items.filter((treatment: any) => treatment.name.includes(treatmentName));
                setTreatmentList(filteredData);
            }
        }catch(e) {
            console.error(e);
        }
    }

    useEffect(() => {
        searchTreatment();
    }, [treatmentName])

    const accessToken = useAuthStore.getState().access_token;

    // 예약 등록
    const newReserve = async () => {
        try {
            // 완료 시간 계산
            const finished_at = new Date(
                new Date(`${reserveDate}T${reserveTime}`).getTime() + treatmentTime * 60000
                ).toISOString().slice(0, 19);
                
            // 시술 예약 
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    phonebook_id: customerId,                    
                    reserved_at: reserveDate + 'T' + reserveTime,
                    status: 'RESERVED',
                    finished_at: finished_at,
                    memo: memo,
                    treatment_items: [
                        {   
                            menu_detail_id: treatmentId,                            
                            base_price: treatmentPrice,
                            duration_min: treatmentTime,
                        }
                    ]
                })
            })
            if(res.status === 201) {
                alert('예약이 등록되었습니다.');
                route.push('/store/booking/calendar');
            }else if(res.status === 422) {
                const errorMsg = await res.json();
                alert(errorMsg.detail[0].msg);
            }else {
                alert('예약 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
            }       
        }catch(e) {
            console.error(e);
            alert('예약 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    }

    const [step, setStep] = useState(1); // step 1: 고객 작성 및 고객 등록, step 2: 예약 등록
    // step 1: 고객 작성 및 고객 등록
    const handleStep1 = () => (
        <section className="space-y-6 rounded-2xl mb-8 flex flex-col justify-between"             
        >
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
                            <div className="flex items-center justify-end p-2">
                                <button type="button"
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                    onClick={() => {
                                        setShowCustomerList(false);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faX} />
                                </button>
                            </div>
                            {
                                customerList.map((customer, index) => (
                                    <li
                                        key={index}
                                        className="p-3 border-b border-gray-200 hover:bg-violet-50 cursor-pointer transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation()
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
                                    route.push('/store/booking/calendar')
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
                    type="date"
                    required
                    placeholder="오늘 날짜"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    value={reserveDate}
                    onChange={(e) => setReserveDate(e.target.value)}                    
                    ref={reserveDateRef}   
                />
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    예약 시간<span className="text-red-600 ml-1">*</span>
                </label>
                <CustomSelect
                    value={reserveTime}
                    onChange={setReserveTime}
                    options={timeOptions}
                    placeholder="예약 시간을 선택하세요"
                    ref={reserveTimeRef}
                />
            </div>

            <div className="space-y-1 relative">
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
                    onFocus={() => setShowTreatmentList(true)}
                    ref={treatmentNameRef}   
                />
                {   // 시술 리스트
                    showTreatmentList && (
                        <ul className="absolute z-10 bg-white w-full border-l border-r border-gray-400 max-h-40 overflow-y-auto p-0" onMouseDown={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end p-2">
                                <button type="button"
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                    onClick={() => {
                                        setShowTreatmentList(false);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faX} />
                                </button>
                            </div>
                            {
                                treatmentList.map((treatment, index) => (
                                    <li
                                        key={index}
                                        className="border-b border-gray-200"                                        
                                    >   
                                        {
                                            treatment.details.map((detail: any, index: number) => (
                                                <div key={index} 
                                                    className="flex items-center justify-between mb-1 hover:bg-violet-50 cursor-pointer transition-colors p-3 "
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setTreatmentName(detail.name);
                                                        setTreatmentPrice(detail.base_price);
                                                        setTreatmentTime(detail.duration_min);
                                                        setTreatmentId(detail.id);
                                                        setShowTreatmentList(false);
                                                    }}
                                                >
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {detail.name}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {detail.base_price} 원
                                                    </span>
                                                </div>                                                
                                            ))
                                        }
                                    </li>

                                ))
                            }
                        </ul>
                    )
                }
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    시술 소요 시간<span className="text-red-600 ml-1">*</span>
                </label>
                <div className="flex gap-2">
                    <CustomSelect
                        value={treatmentTime.toString()}
                        onChange={(val) => setTreatmentTime(Number(val))}
                        options={treatmentTimeOptions}
                        placeholder="예약 시간을 선택하세요"
                        ref={treatmentTimeRef}
                    />               
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
                    placeholder="메모를 적어주세요."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}                                             
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
