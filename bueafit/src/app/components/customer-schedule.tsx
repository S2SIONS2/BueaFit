'use client';

import { useEffect, useState } from "react";
import { fetchInterceptors } from "../utils/fetchInterceptors";
import LoadingSpinner from "./LoadingSpinner";
import dayjs from "dayjs";

interface customerProps {
    customerId: number;
}

export default function CustomerSchedule({customerId}: customerProps) {
    // 로딩
    const [loading, setLoading] = useState(true)
    // 예약 리스트 불러오기
    const [scheduleList, setScheduleList] = useState<any[]>([]); // 예약 리스트
      
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
                const filteredData = data.items.filter((item) => item.phonebook_id === customerId)
                console.log(filteredData)
                setScheduleList(filteredData);
            }
        } catch (e) {
            console.error(e);
        }finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchScheduleList();
    }, []);

    // 예약 상태 표시
    const STATUS_LABELS: Record<string, string> = {
        RESERVED: " 예약 완료",
        VISITED: " 시술 완료",
        CANCELED: " 취소됨",
        NO_SHOW: " 노쇼",      
    };

    const reservedSchedules = scheduleList.filter((item) => item.status === "RESERVED");
    const completedSchedules = scheduleList.filter((item) => item.status !== "RESERVED");

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <LoadingSpinner className="w-10 h-10"/>
            </div>
        )
    }

    return (
        <div>
            {/* 예약 일정 */}
            <section className="bg-white rounded-2xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold border-b pb-2 mb-4">예약 일정</h2>

                {reservedSchedules.length === 0 ? (
                    <p className="text-gray-400 text-sm">예약된 일정이 없습니다.</p>
                ) : (
                    reservedSchedules.map((item, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
                    >
                        <p className="text-sm text-gray-700 mb-2">
                            <span className="font-semibold">예약 날짜:</span>{" "}
                            {dayjs(item.reserved_at).format("YYYY-MM-DD")}
                        </p>
                        <p className="text-sm text-gray-700 mb-3">
                            <span className="font-semibold">예약 상태:</span>{" "}
                            {STATUS_LABELS[item.status] || "알 수 없음"}
                        </p>

                        <div className="space-y-2 pl-2 border-l-2 border-blue-200">
                            {item.treatment_items.map((treatment, tIndex) => (
                                <div
                                    key={tIndex}
                                    className="text-sm text-gray-600 bg-white rounded p-3 shadow-sm border"
                                >
                                <p>
                                    <span className="font-medium">시술 명:</span>{" "}
                                    {treatment.menu_detail.name}
                                </p>
                                <p>
                                    <span className="font-medium">시술 가격:</span>{" "}
                                    {treatment.menu_detail.base_price.toLocaleString()}원
                                </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    ))
                )}
                </section>

            {/* 완료 시술 내역 */}
            <section className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-semibold border-b pb-2 mb-4">이전 시술 내역</h2>

                {completedSchedules.length === 0 ? (
                    <p className="text-gray-400 text-sm">완료된 일정이 없습니다.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {completedSchedules.map((item, index) => (
                            <li key={index} className="py-4">
                            <div className="text-sm text-gray-800 font-medium mb-1">
                                예약 날짜: {dayjs(item.reserved_at).format("YYYY-MM-DD")} (
                                {STATUS_LABELS[item.status] || "알 수 없음"})
                            </div>
                            <ul className="ml-4 list-disc text-sm text-gray-600">
                                {item.treatment_items.map((treatment, tIndex) => (
                                <li key={tIndex}>
                                    {treatment.menu_detail.name} -{" "}
                                    {treatment.menu_detail.base_price.toLocaleString()}원
                                </li>
                                ))}
                            </ul>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}