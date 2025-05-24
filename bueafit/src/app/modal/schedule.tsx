'use client'

import { EventApi } from "@fullcalendar/core";
import { useEffect, useState } from "react";
import { fetchInterceptors } from "../utils/fetchInterceptors";
// import Button from "../components/Button";
// import { useRouter } from "next/navigation";
// import { useModalStore } from "@/store/useModalStore";

interface EventComponentProps {
  event: EventApi;
}

export default function Schedule({event}: EventComponentProps) {
    const time = event.start?.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })

    // const route = useRouter();

    // 모달 닫기
    // const { closeModal } = useModalStore();

    // 스케줄 정보
    const [treatmentList, setTreatmentList] = useState<any[]>([]); // 시술 정보 리스트

    const treatmentMenuId = event.extendedProps?.treatment_menu_id
    const treatmentItemId = event.extendedProps?.treatment_item_id;

    // 시술 리스트 조회
    const fetchTreatment = async () => {
    if (!treatmentMenuId || !treatmentItemId) return;

    try {
        const res = await fetchInterceptors(
        `${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatment-menus/${treatmentMenuId}/details`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        }
        );
        const data = await res.json();

        if (res.status === 200) {
        const filteredData = data.filter(
            (item) => item.id === treatmentItemId
        );
        setTreatmentList(filteredData);
        }
    } catch (e) {
        console.error(e);
    }
    };
    
    useEffect(() => {
    if (treatmentMenuId && treatmentItemId) {
        fetchTreatment();
        console.log(event.extendedProps.treatment_menu_id)
    }
    }, [treatmentItemId]);

    // status 표시
    const STATUS_LABELS: Record<string, string> = {
        RESERVED: " 예약 완료",
        VISITED: " 시술 완료",
        CANCELED: " 취소됨",
        NO_SHOW: " 노쇼",      
    };

    // 수정하기
    // const modifyList = () => {

    //     return;
    // }
    // const deleteList = () => {
    //     return;
    // }


    return (
        <div className="rounded-xl border border-gray-200 p-6 shadow-md bg-white w-full max-w-md">
            <h1 className="text-xl font-bold text-gray-800 mb-4">예약 확인</h1>

            <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-700">
                    예약자: <span className="text-blue-600">{event.title}</span>
                </h2>

                <p className="text-sm text-gray-600">
                    예약 시간: <span className="font-medium text-gray-800">{time}</span>
                </p>

                <p className="text-sm text-gray-600">
                    예약 여부: <span className="font-medium text-gray-800">
                    {STATUS_LABELS[event.extendedProps.status] || "알 수 없음"}
                </span>
                </p>

                {event.extendedProps.treatment_item_name}

                {treatmentList.length > 0 ? (
                    <ul className="mt-3 space-y-1">
                        {treatmentList.map((item) => (
                        <li
                            key={item.id}
                            className="text-sm text-gray-700 bg-gray-50 rounded px-3 py-2 border border-gray-200"
                        >
                            시술 항목: <span className="font-medium">{item.name}</span>
                        </li>
                        ))}
                    </ul>
                    ) : (
                        <p className="text-sm text-gray-400 mt-2">시술 정보가 없습니다.</p>
                )}
            </div>
            <div className="flex items-center justify-end gap-2 mt-8">
                {/* <Button 
                    type="button"
                    onClick={() => {
                        route.push(`detail/${encodeURIComponent(event.id)}`)
                        closeModal();
                    }}
                    className="rounded h-[35px] flex items-center"
                >
                    수정
                </Button> */}
                {/* <button 
                    type="button"
                    onClick={() => deleteList()}
                    className="rounded h-[35px] flex items-center bg-gray-700 py-2 px-4 text-white"
                >
                    삭제
                </button> */}
            </div>
        </div>
    )
}