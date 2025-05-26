'use client';

import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { faCheckToSlot, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Charts from "@/app/components/Charts";
import MainSkeleton from "@/app/components/skeleton/main-skeleton";

type Treatment = {
        status: string;
        reserved_at: string;
        [key: string]: any;
};

export default function Page() {
    dayjs.extend(utc);
    
    const date = new Date()
    const today = dayjs(date).format("YYYY-MM-DD")
    // const todayUTC = dayjs(date).utc().format("YYYY-MM-DD");
    
    const [loading, setLoading] = useState(true) // 로딩 상태

    const borderColors = ["border-blue-400", "border-green-400", "border-pink-400"]; // 예약 표기 시 1/3 컬러가 바뀜
    const [treatmentItems, setTreatmentItems] = useState([]) // 오늘 예약된 시술 아이템들
    const [todayStatus, setTodayStatus] = useState<Treatment[]>([]); // 오늘의 예약 상태

    // 아직 api가 따로 없어서 프론트단에서 처리
    const fetchTreatments = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatments`, { // ?start_date=${todayUTC}&end_date=${todayUTC}
                method: "GET",
                headers: {
                    "Content-Type" : 'application/json'
                }
            })
            const data = await res.json();

            if(res.status === 200) {
                const filteredItems = data.items.filter((item) => item.reserved_at.slice(0,10) === today);
                const treatmentItems = filteredItems.map((item) => ({
                    id: item.id,
                    status: item.status,
                    treatment_items: item.treatment_items.map((treatment) => ({
                        id: treatment.id,
                        menu_detail: treatment.menu_detail
                    }))
                }));
                setTodayStatus(filteredItems)
                setTreatmentItems(treatmentItems);
            }
        }catch(e) {
            console.error(e)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTreatments();
    }, [])

    // 데이터를 Recharts 형식으로 변환
    // 시술별 예상 매출
    function getChartDataByExpected(data: Treatment[]) {
        const map = new Map<string, number>();

        data.forEach((treatment) => {
            treatment.treatment_items.forEach((item) => {
            const name = item.menu_detail.name;
            const price = item.menu_detail.base_price;

            map.set(name, (map.get(name) || 0) + price);
            });
        });

        return Array.from(map, ([name, expected]) => ({ name, expected }));
    }

    // 확정 매출
    function getChartDataByTotal(data: Treatment[]) {
        const map = new Map<string, number>();

        data.forEach((treatment) => {
            treatment.treatment_items.forEach((item) => {
                if (treatment.status !== "COMPLETED") return;

                const name = item.menu_detail.name;
                const price = item.menu_detail.base_price;
                map.set(name, (map.get(name) || 0) + price);
            });
        });

        return Array.from(map, ([name, total]) => ({ name, total }));
    }

    // 시술 건수
    function getChartDataByCount(data: Treatment[]) {
        const map = new Map<string, number>();

        data.forEach((treatment) => {
            treatment.treatment_items.forEach((item) => {
                const name = item.menu_detail.name;
                map.set(name, (map.get(name) || 0) + 1);
            });
        });

        return Array.from(map, ([name, count]) => ({ name, count }));
    }


    const expectedRevenueData = getChartDataByExpected(treatmentItems);
    const totalRevenueData = getChartDataByTotal(treatmentItems);
    const countData = getChartDataByCount(treatmentItems);

    return (
        <div className="w-full min-h-full p-6 bg-[#f8f9fb]">
            {/* <MainSkeleton />  */}
            {
                loading ? <MainSkeleton /> : (
                    <div>
                        <header className="mb-6">
                            <h1 className="text-2xl font-bold">금일 현황</h1>
                            <p className="text-sm font-bold text-gray-500">{today}</p>
                        </header>

                        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="bg-gradient-to-r from-purple-300 to-purple-500 text-white rounded-lg p-4 shadow">
                                <h3 className="text-sm font-medium">오늘 예약 수</h3>
                                <p className="text-3xl font-bold mt-1">{todayStatus.length}건</p>
                            </div>
                            <div className="bg-gradient-to-r from-green-300 to-green-500 text-white rounded-lg p-4 shadow">
                                <h3 className="text-sm font-medium">완료된 시술</h3>
                                <p className="text-3xl font-bold mt-1">{todayStatus.filter((v) => v.status === "COMPLETED").length}건</p>
                            </div>
                            <div className="bg-gradient-to-r from-red-300 to-red-500 text-white rounded-lg p-4 shadow">
                                <h3 className="text-sm font-medium">노쇼 수</h3>
                                <p className="text-3xl font-bold mt-1">
                                    {(todayStatus.filter((v) => v.status === "NO_SHOW").length > 0) ? todayStatus.filter((v) => v.status === "NO_SHOW").length : "0"}건
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
                                        todayStatus.map((item, index) => (
                                            <ul key={index} className="space-y-3 text-sm max-h-[200px] overflow-y-auto">
                                                <li className={`border-l-4 ${borderColors[index % borderColors.length]} pl-2 mb-4`}>
                                                    <p className="font-semibold">{item.phonebook.name}</p>
                                                    <p className="text-gray-500">
                                                        {item.treatment_items.map((treatment, idx) => (
                                                            <span key={idx} className="inline-block mr-1">
                                                                {treatment.menu_detail.name}
                                                            </span>
                                                        ))}
                                                    </p>
                                                </li> 
                                            </ul>
                                        ))
                                    }
                                </div>

                                <div className="h-full bg-white rounded-xl p-4 shadow lg:col-span-2">
                                    <h3 className="text-lg font-semibold mb-3">
                                        <FontAwesomeIcon icon={faCheckToSlot} className="text-violet-400 mr-2"/> 
                                        작업 완료 내역
                                    </h3>
                                    {
                                        todayStatus.filter((v) => v.status === "COMPLETED").length > 0 ? 
                                        todayStatus.filter((v) => v.status === "COMPLETED").map((item, index) => (
                                            <div key={index} className="border-b border-gray-200 py-2">
                                                <p className="font-semibold">{item.phonebook.name}</p>
                                                <p className="text-gray-500">
                                                    {item.treatment_items.map((treatment, idx) => (
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
                            <Charts title="시술별 예상 매출 [예약 + 외상 포함]" data={expectedRevenueData} dataKey="expected" type="bar"/>
                            <Charts title="시술별 매출 [결제 완료 건]" data={totalRevenueData} dataKey="total" type="bar"/>
                            <Charts title="시술별 건수" data={countData} dataKey="count" type="pie"/>
                        </section>
                    </div>
                )
            }
        </div>
    );
}
