'use client'

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/store/useModalStore";

dayjs.extend(utc);
dayjs.extend(timezone);

interface PropsType {
    list: Treatment
}

export interface Treatment {
    id: number;
    shop_id: number;
    phonebook_id: number;
    phonebook: Phonebook;
    reserved_at: string;
    finished_at: string;
    status: "RESERVED" | "VISITED" | "CANCELLED" | "NO_SHOW" | "COMPLETED";
    status_label: string;
    payment_method: "CARD" | "CASH" | "UNPAID";
    payment_method_label: string;
    memo: string;
    staff_user_id: number | null;
    created_at: string;
    updated_at: string;
    created_user_id: number;
    treatment_items: TreatmentItem[];
}

export interface Phonebook {
    id: number;
    name: string;
    phone_number: string;
    group_name: string;
    memo: string;
    shop_id: number;
    created_at: string;
    updated_at: string;
}

export interface TreatmentItem {
    id: number;
    treatment_id: number;
    menu_detail_id: number;
    base_price: number;
    duration_min: number;
    session_no: number;
    created_at: string;
    updated_at: string;
    menu_detail?: MenuDetail;
}

export interface MenuDetail {
    menu_id: number;
    name: string;
    duration_min: number;
    base_price: number;
}

const formatDuration = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h > 0 ? `${h}시간 ` : ""}${m > 0 ? `${m}분` : ""}`.trim() || "0분";
};

export default function ReserveSchedule({ list }: PropsType) {
  const route = useRouter();
  const { closeModal } = useModalStore();

  const time = dayjs(list.reserved_at)
    .tz("Asia/Seoul")
    .format("HH:mm");

  return (
    <div className="rounded-xl border border-gray-200 p-6 shadow-md bg-white w-full max-w-md">
        <h1 className="text-xl font-bold text-gray-800 mb-4">시술 일정 확인</h1>

        <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">
                예약자: <span className="text-blue-600">{list.phonebook?.name ?? "이름 없음"}</span>
            </h2>

            <p className="text-sm text-gray-600">
                예약 시간: <span className="font-medium text-gray-800">{time}</span>
            </p>

            <p className="text-sm text-gray-600">
                예약 여부:{" "}
                <span className="font-medium text-gray-800">{list.status_label}</span>
            </p>

            <p className="text-sm text-gray-600">
                결제 방식:{" "}
                <span className="font-medium text-gray-800">
                    {list.payment_method_label || "선택되지 않음"}
                </span>
            </p>

            {list.memo && (
                <p className="text-sm text-gray-600">
                    메모: <span className="font-medium text-gray-800">{list.memo}</span>
                </p>
            )}

            {list.treatment_items.length > 0 ? (
            <ul className="mt-3 space-y-1">
                <p className="text-sm font-medium text-gray-700">시술 항목:</p>
                {list.treatment_items.map((item, index) => (
                    <li
                        key={index}
                        className="text-sm text-gray-700 bg-gray-50 rounded px-3 py-2 border border-gray-200"
                    >
                        <span className="font-medium">
                        {item.menu_detail?.name ?? "알 수 없는 시술"} [{item.session_no}차] - {formatDuration(item.duration_min)}
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
