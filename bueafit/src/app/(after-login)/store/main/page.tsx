'use client';

import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { faCheckToSlot, faClipboardList, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Charts from "@/app/components/Charts";
import MainSkeleton from "@/app/components/skeleton/main-skeleton";
import { useModalStore } from "@/store/useModalStore";
import ReserveSchedule from "@/app/modal/ReserveSchedule";
// import { useAuthStore } from "@/store/useAuthStore";

// type Treatment = {
//     id: number;
//     shop_id: number;
//     phonebook_id: number;
//     phonebook: Phonebook;
//     reserved_at: string;
//     finished_at: string;
//     status: "RESERVED" | "VISITED" | "CANCELLED" | "NO_SHOW" | "COMPLETED";
//     status_label: string;
//     payment_method: "CARD" | "CASH" | "UNPAID";
//     payment_method_label: string;
//     memo: string;
//     staff_user: StaffInfo;
//     staff_user_id: number | null;
//     created_at: string;
//     updated_at: string;
//     created_user_id: number;
//     treatment_items: TreatmentItem[];
// };

// interface StaffInfo {
//     name: string
// }

// interface Phonebook {
//     id: number;
//     name: string;
//     phone_number: string;
//     group_name: string;
//     memo: string;
//     shop_id: number;
//     created_at: string;
//     updated_at: string;
// }

// interface TreatmentItem {
//     id: number;
//     treatment_id: number;
//     menu_detail_id: number;
//     base_price: number;
//     duration_min: number;
//     session_no: number;
//     created_at: string;
//     updated_at: string;
//     menu_detail?: MenuDetail;
// }

// interface MenuDetail {
//     menu_id: number;
//     name: string;
//     duration_min: number;
//     base_price: number;
// }

interface CustomerSummary {
  id: number;
  status: string;
  customer_name: string;
  treatments: TreatmentItem[];
  reserved_at: string;
  memo: string;
  payment_method: string;
  total_duration_min: number;
}

interface TreatmentItem {
  session_no: number;
  menu_detail: TreatmentMenuDetail;
}

interface TreatmentMenuDetail {
  name: string;
  duration_min: number;
  base_price: number;
}


export default function Page() {
    dayjs.extend(utc);
    dayjs.extend(timezone);

    // 스케줄 모달 오픈
    const openModal = useModalStore((state) => state.openModal)
    
    const date = new Date()
    const today = dayjs(date).tz("Asia/Seoul").format("YYYY-MM-DD") // kst today date
    // const ISO_today = dayjs(date).toISOString()
    
    const [loading, setLoading] = useState(true) // 로딩 상태

    const borderColors = ["border-blue-400", "border-green-400", "border-pink-400"]; // 예약 표기 시 1/3 컬러가 바뀜
    // const [todayStatus, setTodayStatus] = useState<Treatment[]>([]); // 오늘의 예약 상태
    const [customerSummary, setCustomerSummary] = useState<CustomerSummary[]>([]) // 고객 서머리
    const [salesSummary, setSalesSummary] = useState([]) // 판매 서머리
    const [EmployeeSummary, setEmployeeSummary] = useState([]) // 직원 서머리

    // 통계 api 호출
    const fetchSummary = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/summary/dashboard?target_date=${today}&force_refresh=false`, {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json"
                }
            })
            const data = await res.json();
            if(res.status === 200){
                // setTodayStatus(data)
                setCustomerSummary(data.customer_insights)
                setSalesSummary(data.sales.target_date)
                setEmployeeSummary(data.staff_summary.target_date)
            }
        }catch(e){
            console.error(e)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSummary()
    }, [])

    // 통계 api 새로 호출
    const reloadData = async () => {
        setLoading(true)
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/summary/dashboard?target_date=${today}&force_refresh=true`, {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json"
                }
            })
            const data = await res.json();
            console.log(data)
            if(res.status === 200){
                // setTodayStatus(data)
                console.log(data)
                setCustomerSummary(data.customer_insights)
            }
        }catch(e){
            console.error(e)
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="w-full min-h-full p-6 bg-[#f8f9fb]">
            {
                loading ? <MainSkeleton /> : (
                    <div>
                        <header className="mb-6">
                            <h1 className="text-2xl font-bold flex items-center gap-1">
                                금일 현황
                                <button type="button"
                                    onClick={() => reloadData()}
                                    className="cursor-pointer text-sm bg-violet-400 p-1 rounded text-white hover:bg-violet-500"
                                >
                                    <FontAwesomeIcon icon={faRotateRight} />
                                </button>
                            </h1>
                            <p className="text-sm font-bold text-gray-500">{today}</p>
                        </header>

                        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="bg-gradient-to-r from-purple-300 to-purple-500 text-white rounded-lg p-4 shadow">
                                <h3 className="text-sm font-medium">오늘 예약 수</h3>
                                <p className="text-3xl font-bold mt-1">{customerSummary.length}건</p>
                            </div>
                            <div className="bg-gradient-to-r from-green-300 to-green-500 text-white rounded-lg p-4 shadow">
                                <h3 className="text-sm font-medium">완료된 시술</h3>
                                <p className="text-3xl font-bold mt-1">{customerSummary.filter((v) => v.status === "COMPLETED").length}건</p>
                            </div>
                            <div className="bg-gradient-to-r from-red-300 to-red-500 text-white rounded-lg p-4 shadow">
                                <h3 className="text-sm font-medium">노쇼 수</h3>
                                <p className="text-3xl font-bold mt-1">
                                    {(customerSummary.filter((v) => v.status === "NO_SHOW").length > 0) ? customerSummary.filter((v) => v.status === "NO_SHOW").length : "0"}건
                                </p>
                            </div>
                        </section>

                        <section className="gap-6 mb-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 space-y-6 gap-4">
                                <div className="h-full bg-white rounded-xl p-4 shadow">
                                    <h3 className="text-lg font-semibold mb-3 lg:col-span-1">
                                        <FontAwesomeIcon icon={faClipboardList} className="text-violet-400 mr-2" />
                                        예약 내역
                                    </h3>
                                    {
                                        customerSummary.length > 0 ? (
                                            customerSummary.map((item, index) => (
                                                <ul key={index} className="space-y-3 text-sm max-h-[200px] overflow-y-auto">
                                                    <li 
                                                        className={`border-l-4 ${borderColors[index % borderColors.length]} pl-2 pt-1 pb-1 mb-3 cursor-pointer hover:bg-gray-100`}
                                                        onClick={() => openModal(<ReserveSchedule list={customerSummary[index]} />)}
                                                    >
                                                        <p className="font-semibold">{item.customer_name}</p>
                                                        <p className="text-gray-500">
                                                            {item.treatments.map((treatment, idx) => (
                                                                <span key={idx} className="inline-block mr-1">
                                                                    [{idx + 1}].{treatment.menu_detail.name}
                                                                </span>
                                                            ))}
                                                        </p>
                                                    </li> 
                                                </ul>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">금일 예약이 없습니다.</p>   
                                        )
                                    }
                                    
                                </div>

                                <div className="h-full bg-white rounded-xl p-4 shadow lg:col-span-2">
                                    <h3 className="text-lg font-semibold mb-3">
                                        <FontAwesomeIcon icon={faCheckToSlot} className="text-violet-400 mr-2"/> 
                                        작업 완료 내역
                                    </h3>
                                    {
                                        customerSummary.filter((v) => v.status === "COMPLETED").length > 0 ? 
                                        customerSummary.filter((v) => v.status === "COMPLETED").map((item, index) => (
                                            <div key={index} className="border-b border-gray-200 py-2">
                                                <p className="font-semibold">{item.customer_name}</p>
                                                <p className="text-gray-500">
                                                    {item.treatments.map((treatment, idx) => (
                                                        <span key={idx} className="inline-block mr-1">
                                                            {treatment.menu_detail.name}
                                                        </span>
                                                    ))}
                                                </p>
                                            </div>
                                        )) : 
                                        <p className="text-gray-500">오늘 완료된 작업이 없습니다.</p>   
                                    }
                                </div>
                            </div>
                        </section>
                        <section className="lg:col-span-3 space-y-6">
                            {/* <div className="bg-white rounded-xl p-4 shadow">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">직원별 매출</h3>
                                <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">[BarChart]</div>
                                </div> */}
                            <Charts title="시술별 예상 매출 [예약 + 외상 포함]" data={salesSummary} dataKey="expected_price" type="bar"/>
                            <Charts title="시술별 매출 [결제 완료 건]" data={salesSummary} dataKey="actual_price" type="bar"/>
                            <Charts title="직원별 시술 건수" data={EmployeeSummary} dataKey="count" type="pie" />
                            <Charts title="시술별 건수" data={salesSummary} dataKey="count" type="pie"/>
                        </section>
                    </div>
                )
            }
        </div>
    );
}
