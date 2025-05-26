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

    const [status, setStatus] = useState('RESERVED')
    const statusOptions = [
        { value: "RESERVED", label: "예약"},
        { value: "VISITED", label: "시술 완료"},
        { value: "CANCELLED", label: "예약 취소"},
        { value: "NO_SHOW", label: "노쇼"}
    ]

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
    const [treatmentName, setTreatmentName] = useState(''); // 시술 이름
    const [sessionNo, setSessionNo] = useState(1) // 시술 차수 - default 1차 완료
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

    const [memo, setMemo] = useState(''); // 메모

    // 결제 방식
    const [paymentMethod, setPaymentMethod] = useState(''); // 결제 방식
    const paymentOptions = [
        { value: "CARD", label: "카드" },
        { value: "CASH", label: "현금" },
        { value: "UNPAID", label: "외상" },
    ];

    const nameRef = useRef<HTMLInputElement>(null); // 고객 이름 input ref
    // const statusRef = useRef<HTMLUListElement>(null); // 예약 단계 select ref
    const treatmentNameRef = useRef<HTMLInputElement>(null); // 시술 이름 input ref
    const reserveDateRef = useRef<HTMLInputElement>(null); // 예약 날짜 input ref
    const reserveTimeRef = useRef<HTMLUListElement>(null); // 예약 시간 select ref
    // const treatmentTimeRef = useRef<HTMLUListElement>(null); // 시술 소요 시간 select ref
    // const treatmentPriceRef = useRef<HTMLInputElement>(null); // 시술 가격 input ref
    const sessionRef = useRef<HTMLUListElement>(null); // 차수 select ref
    const sessionOptions = [
        { value: "1", label: "1차" },
        { value: "2", label: "2차" },
        { value: "3", label: "3차" },
        { value: "4", label: "4차" },
        { value: "5", label: "5차" },
        { value: "6", label: "6차" },
        { value: "7", label: "7차" },
        { value: "8", label: "8차" },
        { value: "9", label: "9차" },
        { value: "10", label: "10차" },
    ];

    const [reserveList, setReserveList] = useState<
        {
            menu_detail_id: number;
            name: string; // UI용
            base_price: number;
            duration_min: number;
            session_no: number;
        }[]
    >([]);

    // 예약 시술 리스트 추가
    const addReserveList = (
        detailId: number,
        detailName: string,
        basePrice: number,
        durationMin: number,
        session = 1
    ) => {
        const exists = reserveList.some(item => item.menu_detail_id === detailId);
        if (exists) {
            alert("이미 추가된 시술 항목입니다.");
            return;
        }

        setReserveList(prev => [
            ...prev,
            {
                menu_detail_id: detailId,
                name: detailName,
                base_price: basePrice,
                duration_min: durationMin,
                session_no: session,
            },
        ]);

        setTreatmentName('');
        setSessionNo(1);    
    };

    // 시술 선택 후 총 금액과 시간
    const totalPrice = reserveList.reduce((sum, item) => sum + item.base_price, 0);
    const totalDuration = reserveList.reduce((sum, item) => sum + item.duration_min, 0);
    const hours = Math.floor(totalDuration / 60);
    const minutes = totalDuration % 60;
    const formattedDuration = `${hours}시간 ${minutes}분`;


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
        if (sessionNo === null) {
            sessionRef.current?.focus();
            return;
        }
        if (customerId === null) {
            nameRef.current?.focus();
            alert('고객을 등록해주세요.')
            return;
        }

        if (reserveList.length === 0) {
            alert('등록된 시술 항목이 없습니다.');
            return;
        }

        if (!reserveTime) {
            alert('예약 시간을 선택해주세요.');
            return;
        }


        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    phonebook_id: customerId,
                    reserved_at: `${reserveDate}T${reserveTime}`,
                    status,
                    memo,
                    treatment_items: reserveList.map(({ menu_detail_id, base_price, duration_min, session_no }) => ({
                        menu_detail_id,
                        base_price,
                        duration_min,
                        session_no,
                    }))
                }),
            });

            if (res.status === 201) {
                alert('예약이 등록되었습니다.');
                route.push('/store/booking/calendar');
            } else if (res.status === 422) {
                const errorMsg = await res.json();
                alert(errorMsg.detail[0].msg);
            } else {
                alert('예약 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } catch (e) {
            console.error(e);
            alert('예약 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const [step, setStep] = useState(1); // step 1: 고객 작성 및 고객 등록, step 2: 예약 등록
    // step 1: 고객 작성 및 고객 등록
    const handleStep1 = () => (
        <section className="space-y-6 rounded-2xl flex flex-col justify-between grow"             
        >
            <div className="space-y-1 relative">
                <div className="mb-6">
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

                <label className="block text-sm font-medium text-gray-700">
                    고객 이름<span className="text-red-600 ml-1">*</span>
                </label>
                <p className="font-gray-500 font-xm text-red-400">고객을 선택해주세요.</p>
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
                <label className="block text-sm font-medium text-gray-700 mt-6">
                    예약 단계<span className="text-red-600 ml-1">*</span>
                </label>
                <CustomSelect
                    value={status}
                    onChange={setStatus}
                    options={statusOptions}
                    placeholder="예약"
                    // ref={statusRef}
                />
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
        <section className="space-y-4 rounded-2xl grow flex flex-col justify-between">
            <form className="space-y-3">
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

                <div className="space-y-1 border-b border-gray-300 pb-4">
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
                        <p className="font-gray-500 font-xm text-red-400">시술을 선택해주세요.</p>
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
                                        <p className="text-sm font-bold pl-2 pb-1 mt-3 border-b border-gray-200">
                                            [ {treatment.name} ]
                                        </p>
                                            {
                                                treatment.details.map((detail: any, index: number) => (
                                                    <div key={index} 
                                                        className="flex items-center justify-between mb-1 hover:bg-violet-50 cursor-pointer transition-colors p-3 "
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowTreatmentList(false);
                                                            addReserveList(detail.id, detail.name, detail.base_price, detail.duration_min);
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
                
                {reserveList.map((item, index) => (
                    <div
                        key={index}
                        className="text-sm text-gray-700 border p-4 rounded mb-4 flex flex-col gap-2"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-sm">
                                {item.name}
                            </h3> 
                            <button
                                type="button"
                                onClick={() => setReserveList(reserveList.filter((_, i) => i !== index))}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                            >
                                삭제
                            </button>
                        </div>

                        <div className="flex gap-4 flex-wrap">
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-xs mb-1 text-gray-600">차수</label>
                                <CustomSelect
                                    value={item.session_no.toString()}
                                    onChange={(val) => {
                                        const updated = [...reserveList];
                                        updated[index].session_no = Number(val);
                                        setReserveList(updated);
                                    }}
                                    options={sessionOptions}
                                />
                            </div>

                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-xs mb-1 text-gray-600">소요 시간</label>
                                <CustomSelect
                                    value={item.duration_min.toString()}
                                    onChange={(val) => {
                                        const updated = [...reserveList];
                                        updated[index].duration_min = Number(val);
                                        setReserveList(updated);
                                    }}
                                    options={treatmentTimeOptions}
                                />
                            </div>

                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-xs mb-1 text-gray-600">가격</label>
                                <input
                                    type="number"
                                    className="w-full h-[38px] max-h-60 px-2 ppy-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                    value={item.base_price}
                                    onChange={(e) => {
                                        const updated = [...reserveList];
                                        updated[index].base_price = Number(e.target.value);
                                        setReserveList(updated);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex justify-center gap-4 mt-6">
                    {/* 총 시술 시간 */}
                    <div className="flex-1 bg-white rounded-2xl shadow-md p-4 text-center">
                        <p className="text-sm text-gray-500 mb-1">총 시술 시간</p>
                        <p className="text-lg font-semibold text-gray-800">{formattedDuration}</p>
                    </div>

                    {/* 총 가격 */}
                    <div className="flex-1 bg-white rounded-2xl shadow-md p-4 text-center">
                        <p className="text-sm text-gray-500 mb-1">총 가격</p>
                        <p className="text-lg font-semibold text-gray-800">{totalPrice.toLocaleString()} 원</p>
                    </div>
                </div>

                <div className="space-y-1 mt-6">
                    <label className="block text-sm font-medium text-gray-700">결제 방식</label>
                    <CustomSelect
                        value={paymentMethod}
                        onChange={setPaymentMethod}
                        options={paymentOptions}
                        placeholder="결제 방식을 선택하세요"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">메모</label>
                    <input 
                        type="text" 
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="메모를 입력해주세요."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                </div>

            </form>
            
            <div className="mb-6">
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
            <div className="mx-auto h-full bg-white rounded-2xl flex flex-col">
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
