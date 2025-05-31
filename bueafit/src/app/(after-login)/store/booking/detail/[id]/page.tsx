'use client';

import LoadingSpinner from "@/app/components/LoadingSpinner";
import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomSelect from "@/app/components/CustomSelect";
import Button from "@/app/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";

interface TreatmentsList {
    id: number,
    reserved_at: string,
    payment_method: string,
    payment_method_label: string,
    status: string,
    status_label: string,
    phonebook: PhoneBook,
    staff_user: StaffInfo,
    staff_user_id: number,
    memo: string,
    treatment_items: TreatmentItems[]
}
interface StaffInfo {
    name: string
    id: number
}
interface PhoneBook {
    id: number,
    name: string
}
interface TreatmentItems {
    id: number,
    base_price: number,
    duration_min: number,
    menu_detail: TreatmentItemsDetail,
    session_no: number,
}
interface TreatmentItemsDetail{
    menu_id: number,
    duration_min: number,
    name: string,
    base_price: number
}

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Page() {
    const params = useParams();
    const paramsId = params.id
    const route = useRouter();

    const [loading, setLoading] = useState(true)
    const [scheduleList, setScheduleList] = useState<TreatmentsList[]>([]); // 예약 리스트

    // 예약 리스트
    const [name, setName] = useState('') // 이름
    const [reserveTime, setReserveTime] = useState('') // 예약 시간
    const [reserveDate, setReserveDate] = useState(''); // 예약 날짜
    const [status, setStatus] = useState('') // 예약 상태
    const [paymentMethod, setPaymentMethod] = useState('') // 결제 방법
    const [employeeId, setEmployeeId] = useState(0) // 직원 id
    const [memo, setMemo] = useState('') // 메모
    // const [shopId, setShopId] = useState(); // 검색할 shop id
    
    // 시술 항목
    const [sessionNo, setSessionNo] = useState(1) // 시술 차수 - default 1차 완료

    // 추가 시술 항목
    const [treatmentName, setTreatmentName] = useState('')

    // custom select option
    const statusOptions = [
        { value: "RESERVED", label: "예약 완료" },
        { value: "VISITED", label: "방문 완료" },
        { value: "CANCELLED", label: "예약 취소" },
        { value: "NO_SHOW", label: "노쇼" },
        { value: "COMPLETED", label: "시술 완료" },
    ]
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
    const paymentOptions = [
        { value: "CARD", label: "카드" },
        { value: "CASH", label: "현금" },
        { value: "UNPAID", label: "외상" },
    ];
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
    const [employeeList, setEmployeeList] = useState([])
      
    // 예약 조회
    const fetchScheduleList = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatments`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await res.json();
            
            if (res.status === 200) {
                const filteredData = data.items.filter((item) => item.id === Number(paramsId))
                setScheduleList(filteredData);
            }
        } catch (e) {
            console.error(e);
        }finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchScheduleList();
    }, []);

    // 전화번호부 가져오기
    const [customerId, setCustomerId] = useState<number | null>(null); // 고객 ID
    const [customerList, setCustomerList] = useState<any[]>([]); // 고객 리스트
    const [showCustomerList, setShowCustomerList] = useState(false); // 고객 리스트 노출 여부
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

    // 검색 할 때마다 리스트 재 호출
    useEffect(() => {
        searchCustomer();
    }, [name])

    // 시술 추가 및 수정
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

    // // 1단계: shop 정보 가져오기
    const [shopId, setShopId] = useState(null)
    useEffect(() => {
        const fetchShopInfo = async () => {
            try {
                const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops/selected`, {
                    method: "GET",
                    headers: {
                        "Content-Type" : "application/json"
                    }
                });
                const data = await res.json();
                if (res.status === 200) {
                    setShopId(data.id);
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchShopInfo();
    }, []);

    // 2단계: shopId가 설정된 후 직원 목록 호출
    useEffect(() => {
        if (!shopId) return;

        const fetchEmployee = async () => {
            try {
                const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops/${shopId}/users`, {
                    method: "GET",
                    headers: {
                        "Content-Type" : "application/json"
                    }
                });
                const data = await res.json();
                if (res.status === 200) {
                    const mappingData = data.map((item) => ({
                        value: item.user.id,
                        label: item.user.name
                    }));
                    setEmployeeList(mappingData);
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchEmployee();
    }, [shopId]);

    // 시술 리스트 검색
    const [treatmentList, setTreatmentList] = useState<{ name: string; details: any[] }[]>([]);
    const [showTreatmentList, setShowTreatmentList] = useState(false)
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
    }, [])

    // 스케줄 불러 온 후 기본 값 set
    useEffect(() => {
        if (scheduleList.length > 0) {
            const first = scheduleList[0];
            const reservedAtKoreaTime = dayjs(first.reserved_at).tz("Asia/Seoul");

            setReserveDate(reservedAtKoreaTime.format("YYYY-MM-DD")); 
            setReserveTime(reservedAtKoreaTime.format("HH:mm:ss"));
            setName(first.phonebook?.name ?? '');
            setStatus(first.status);
            setEmployeeId(first.staff_user_id ?? null)
            setMemo(first.memo || '');
            setPaymentMethod(first.payment_method);
            setCustomerId(first.phonebook.id);
            setSessionNo(first.treatment_items[0].session_no || 1);
        }
    }, [scheduleList]);

    // 수정
    const modifyTreatment = async () => {
        const existingItems = scheduleList.flatMap(item => item.treatment_items);
        const itemsToSend = reserveList.length > 0
            ? [...existingItems, ...reserveList].filter(Boolean)
            : existingItems;

        // 예약 시간 (KST → UTC ISO 변환)
        const reservedKst = dayjs.tz(`${reserveDate} ${reserveTime}`, "Asia/Seoul"); // KST
        // const reservedKst = dayjs.tz(`${reserveDate} ${reserveTime}`, "UTC"); // UTC
        const reservedUtc = reservedKst.utc().toISOString(); // UTC ISO

        const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatments/${paramsId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                phonebook_id: customerId,
                reserved_at: reservedUtc, // 예: "2025-06-02T09:30:00Z"
                memo: memo,
                status : status,
                staff_user_id: employeeId,
                payment_method: paymentMethod,
                treatment_items: itemsToSend,
            }),
        });

        if (res.status === 200) {
            route.back()
        }
    };

    // data 로딩중에
    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <LoadingSpinner className="w-12 h-12" />
            </div>
        )
    }
    
    return (
        <div className="overflow-auto min-h-[100vh] p-6 bg-white rounded-xl shadow flex">
            <div className="flex flex-col justify-between">
                <article className="space-y-6">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800">예약 수정</h2>
                    </section>
                    <section className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">예약자 성함</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onFocus={() => setShowCustomerList(true)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="이름"
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
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">예약 상태</label>
                                <CustomSelect
                                    value={status}
                                    onChange={setStatus}
                                    options={statusOptions}
                                    onFocus={() => setShowCustomerList(false)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">예약 날짜</label>
                                <input type="date" 
                                    value={reserveDate}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    onChange={(e) => setReserveDate(e.target.value)}
                                    onFocus={() => setShowCustomerList(false)}
                                    placeholder={reserveDate}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">예약 시간</label>
                                <CustomSelect
                                    value={reserveTime}
                                    onChange={setReserveTime}
                                    options={timeOptions}
                                    onFocus={() => setShowCustomerList(false)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">결제 방식</label>
                                <CustomSelect
                                    value={paymentMethod}
                                    onChange={setPaymentMethod}
                                    options={paymentOptions}
                                    onFocus={() => setShowCustomerList(false)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
                                <CustomSelect
                                    value={employeeId}
                                    onChange={setEmployeeId}
                                    options={employeeList}
                                    onFocus={() => setShowCustomerList(false)}
                                    placeholder={scheduleList[0].staff_user?.name ? scheduleList[0].staff_user?.name : '선택된 담당자 없음'}
                                /> 
                            </div>
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
                            <input
                                type="text"
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                onFocus={() => setShowCustomerList(false)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                placeholder="메모를 작성해주세요."
                            />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex justify-between items-center">
                            시술 항목
                        </h3>
                        {scheduleList.map((item, itemIdx) =>
                            item.treatment_items.map((treatment, tIdx) => (
                            <div key={treatment.id} className="p-4 border border-gray-200 rounded-lg bg-white space-y-3 flex gap-3">
                                <div className="grow-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">시술명</label>
                                    <input
                                        type="text"
                                        value={treatment.menu_detail.name}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            const updated = [...scheduleList];
                                            updated[itemIdx].treatment_items[tIdx].menu_detail.name = newValue;
                                            setScheduleList(updated);
                                        }}
                                        onFocus={() => setShowCustomerList(false)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                </div>

                                <div className="grow-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">가격 (원)</label>
                                    <input
                                        type="number"
                                        value={treatment.base_price}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        onChange={(e) => {
                                            const newValue = Number(e.target.value);
                                            const updated = [...scheduleList];
                                            updated[itemIdx].treatment_items[tIdx].base_price = newValue;
                                            setScheduleList(updated);
                                        }}
                                        onFocus={() => setShowCustomerList(false)}
                                    />
                                </div>

                                <div className="grow-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">소요 시간 (분)</label>
                                    <input
                                        type="number"
                                        value={treatment.duration_min}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        onChange={(e) => {
                                            const newValue = Number(e.target.value);
                                            const updated = [...scheduleList];
                                            updated[itemIdx].treatment_items[tIdx].duration_min = newValue;
                                            setScheduleList(updated);
                                        }}
                                    />
                                </div>

                                <div className="grow-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">차수</label>
                                    <input
                                        type="number"
                                        value={sessionNo}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        onChange={(e) => setSessionNo(Number(e.target.value))}
                                        onFocus={() => setShowCustomerList(false)}
                                    />
                                </div>
                            </div>
                            ))
                        )}
                    </section>
                    <section className="space-y-1 relative pb-[130px]">
                        <details className="space-y-4 border-b border-gray-300 pb-2">
                            <summary className="text-lg font-semibold text-gray-800 flex justify-between items-center cursor-pointer">
                                시술 추가
                                <FontAwesomeIcon icon={faPlus} />
                            </summary>
                            <label className="block font-medium text-gray-700">
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
                        </details>
                    </section>
                    
                </article>
                <section className="flex items-center justify-end w-full gap-2">
                    <button 
                        type="button"
                        onClick={() => route.back()}
                        className="border border-gray-400 w-full h-[40px] rounded cursor-pointer"
                    >
                        닫기
                    </button>
                    <Button 
                        type="button"
                        onClick={modifyTreatment}
                        className="rounded w-full"
                    >
                        수정
                    </Button>
                </section>
            </div>
        </div>
    );
}