// 'use client'

import { EventApi } from "@fullcalendar/core";
import Link from "next/link";
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
            <h1 className="text-xl font-bold text-gray-800 mb-4">시술 일정 확인</h1>

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
                <p className="text-sm text-gray-600">
                    결제 방식: <span className="font-medium text-gray-800">
                        {event.extendedProps.payment_method_label || "방식이 선택되지 않았습니다."}
                    </span>
                </p>
                {
                    event.extendedProps.memo ? (
                        <p className="text-sm text-gray-600">
                            메모: <span className="font-medium text-gray-800">{event.extendedProps.memo}</span>
                        </p>

                    ) : null
                }

                {event.extendedProps.treatment_items.length > 0 ? (
                    <ul className="mt-3 space-y-1">
                        <p>시술 항목:</p>
                        {event.extendedProps.treatment_items.map((item, index) => (
                            <li
                            key={index}
                            className="text-sm text-gray-700 bg-gray-50 rounded px-3 py-2 border border-gray-200"
                            >
                             <span className="font-medium">{item.name} [{item.session_no}차]</span>
                        </li>
                        ))}
                    </ul>
                    ) : (
                        <p className="text-sm text-gray-400 mt-2">시술 정보가 없습니다.</p>
                )}
            </div>
            <div className="flex items-center justify-end gap-2 mt-8">
                <Link href={`booking/detail/${encodeURIComponent(event.id)}`} className="rounded bg-violet-400 text-white px-4 py-2 hover:bg-blue-700 transition-colors">
                    수정
                </Link>
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