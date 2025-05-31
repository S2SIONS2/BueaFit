'use client'

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/store/useModalStore";

dayjs.extend(utc);
dayjs.extend(timezone);

interface PropsType {
    list: CustomerSummary
}

interface CustomerSummary {
    id: number;
    status: string;
    customer_name: string;
    treatments: string[];
    reserved_at: string;
    memo: string;
    payment_method: string;
}

export default function ReserveSchedule({ list }: PropsType) {

    const route = useRouter();
    const { closeModal } = useModalStore();

    const time = dayjs.utc(list.reserved_at).tz("Asia/Seoul").format("HH:mm"); 

    // status와 payment_method 라벨링
    const statusLabelMap: Record<string, string> = {
        RESERVED: "예약 완료",
        VISITED: "방문 완료",
        CANCELLED: "예약 취소",
        NO_SHOW: "노쇼",
        COMPLETED: "시술 완료",
    };
    const paymentLabelMap: Record<string, string> = {
        CARD: "카드",
        CASH: "현금",
        UNPAID: "외상",
    };

    // 총 시간 계산
    // const formatDuration = (min: number) => {
    //     const h = Math.floor(min / 60);
    //     const m = min % 60;
    //     return `${h > 0 ? `${h}시간 ` : ""}${m > 0 ? `${m}분` : ""}`.trim() || "0분";
    // };

    return (
        <div className="rounded-xl border border-gray-200 p-6 shadow-md bg-white w-full max-w-md">
            <h1 className="text-xl font-bold text-gray-800 mb-4">시술 일정 확인</h1>

            <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-700">
                    예약자: <span className="text-blue-600">{list.customer_name ?? "이름 없음"}</span>
                </h2>

                <p className="text-sm text-gray-600">
                    예약 시간: <span className="font-medium text-gray-800">{time}</span>
                </p>

                <p className="text-sm text-gray-600">
                    예약 여부:{" "}
                    <span className="font-medium text-gray-800">{statusLabelMap[list.status]}</span>
                </p>

                <p className="text-sm text-gray-600">
                    결제 방식:{" "}
                    <span className="font-medium text-gray-800">
                        {paymentLabelMap[list.payment_method] || "선택되지 않음"}
                    </span>
                </p>

                {list.memo && (
                    <p className="text-sm text-gray-600">
                        메모: <span className="font-medium text-gray-800">{list.memo}</span>
                    </p>
                )}

                {list.treatments.length > 0 ? (
                    <ul className="mt-3 space-y-1">
                        <p className="text-sm font-medium text-gray-700">시술 항목:</p>
                        {list.treatments.map((item, index) => (
                            <li
                                key={index}
                                className="text-sm text-gray-700 bg-gray-50 rounded px-3 py-2 border border-gray-200"
                            >
                                <span className="font-medium">
                                    {item ?? "알 수 없는 시술"} {/*  [{item.session_no}차] - {formatDuration(list.total_duration_min)} */}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-400 mt-2">시술 정보가 없습니다.</p>
                )}
            </div>

            <div className="flex items-center justify-end gap-2 mt-8">
                <Button
                    type="button"
                    onClick={() => {
                        route.push(`booking/detail/${encodeURIComponent(list.id)}`);
                        closeModal();
                    }}
                        className="rounded h-[35px] flex items-center"
                    >
                    수정
                </Button>
            </div>
        </div>
    );
}
