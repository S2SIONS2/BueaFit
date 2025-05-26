'use client';

import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { faCheckToSlot, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function Page() {
    const date = new Date()
    const today = dayjs(date).format("YYYY-MM-DD")
    
    const [loading, setLoading] = useState(true)
    const [todayStatus, setTodayStatus] = useState([]);
    // 아직 api가 따로 없어서 프론트단에서 처리
    const fetchTreatments = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatments?start_date=${today}&end_date=${today}`, {
                method: "GET",
                headers: {
                    "Content-Type" : 'application/json'
                }
            })
            const data = await res.json();

            if(res.status === 200) {
                setTodayStatus(data.items)
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

    useEffect(() => {
        console.log(todayStatus)
    }, [todayStatus])

    if(loading) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <LoadingSpinner className="w-10 h-10"/>
            </div>
        )
    }

    return (
        <div className="w-full p-6 bg-[#f8f9fb]">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">금일 현황</h1>
                <p className="text-sm text-gray-500">{today}</p>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-r from-purple-300 to-purple-500 text-white rounded-lg p-4 shadow">
                    <h3 className="text-sm font-medium">오늘 예약 수</h3>
                    <p className="text-3xl font-bold mt-1">8건</p>
                </div>
                <div className="bg-gradient-to-r from-green-300 to-green-500 text-white rounded-lg p-4 shadow">
                    <h3 className="text-sm font-medium">완료된 시술</h3>
                    <p className="text-3xl font-bold mt-1">6건</p>
                </div>
                <div className="bg-gradient-to-r from-red-300 to-red-500 text-white rounded-lg p-4 shadow">
                    <h3 className="text-sm font-medium">노쇼 수</h3>
                    <p className="text-3xl font-bold mt-1">2건</p>
                </div>
            </section>

            <section className="gap-6 mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 space-y-6 gap-4">
                    <div className="h-full bg-white rounded-xl p-4 shadow">
                        <h3 className="text-lg font-semibold mb-3 lg:col-span-1">
                            <FontAwesomeIcon icon={faClipboardList} className="text-violet-400 mr-2" />
                            예약 내역
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li className="border-l-4 border-blue-400 pl-3">
                                <p className="font-semibold">10:00 이준영</p>
                                <p className="text-gray-500">두피 관리</p>
                            </li>
                            <li className="border-l-4 border-green-400 pl-3">
                                <p className="font-semibold">11:30 김영희</p>
                                <p className="text-gray-500">스킨 케어</p>
                            </li>
                            <li className="border-l-4 border-pink-400 pl-3">
                                <p className="font-semibold">13:00 박철수</p>
                                <p className="text-gray-500">손 마사지</p>
                            </li>
                        </ul>
                    </div>

                    <div className="h-full bg-white rounded-xl p-4 shadow lg:col-span-2">
                        <h3 className="text-lg font-semibold mb-3">
                            <FontAwesomeIcon icon={faCheckToSlot} className="text-violet-400 mr-2"/> 
                            작업 완료 내역
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            <li>홍길동 - 두피 관리</li>
                            <li>김영희 - 스킨 케어</li>
                            <li>박철수 - 손 마사지</li>
                        </ul>
                    </div>
                </div>

            </section>
            <section className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-xl p-4 shadow">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">직원별 매출</h3>
                    <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">[BarChart]</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">시술별 매출</h3>
                    <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">[PieChart]</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">시술별 인원</h3>
                    <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">[BarChart]</div>
                </div>
            </section>
        </div>
    );
}
