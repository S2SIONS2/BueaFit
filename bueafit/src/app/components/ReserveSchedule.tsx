'use client'

import { useModalStore } from "@/store/useModalStore";
import { EventApi } from "@fullcalendar/core";
import Schedule from "../modal/schedule";
import { useEffect, useState } from "react";
import { fetchInterceptors } from "../utils/fetchInterceptors";

interface EventComponentProps {
  event: EventApi;
}

export default function ReverseSchedule({ event }: EventComponentProps) {
  const time = event.start?.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // open modal
  const openModal = useModalStore((state) => state.openModal);
  const openState = useModalStore((state) => state.isOpen);

  // 스케줄 정보
  const [treatmentList, setTreatmentList] = useState<any[]>([]); // 시술 정보 리스트

  const treatmentItemId = event.extendedProps?.treatment_item_id;

  // 시술 리스트 조회
  const fetchTreatment = async () => {
    if (!treatmentItemId) return;

    try {
      const res = await fetchInterceptors(
        `${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatments-menus/${treatmentItemId}/details`, // ← 여긴 확실히 ID에 맞는 URL 확인 필요
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.status === 200 && Array.isArray(data.items)) {
        const filteredData = data.items.filter(
          (item) => item.id === treatmentItemId
        );
        setTreatmentList(filteredData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTreatment();
  }, [openState]);

  return (
    <div
      style={{ fontSize: "12px", padding: "2px" }}
      onClick={() => openModal(<Schedule event={event} />)}
    >
      <h2 className="font-bold">{event.title}</h2>
      <p >예약 시간: {time}</p>

      {treatmentList.map((item) => (
        <div key={item.id} className="text-xs text-gray-600">
          시술 항목: {item.name}
        </div>
      ))}
    </div>
  );
}
