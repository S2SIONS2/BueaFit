'use client';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ReverseSchedule from "./ReserveSchedule";
import { useEffect, useMemo, useState } from "react";
import { fetchInterceptors } from "../utils/fetchInterceptors";
import "./calendar.css"

interface EventInput {
  title: string;
  start: string | Date;
  end?: string | Date;
  extendedProps?: Record<string, any>;
}

interface CalendarProps {
  view?: 'all' | 'month' | 'week' | 'day';
}

export default function CalendarComponent({view = 'all'}: CalendarProps) {
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
        setScheduleList(data.items);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchScheduleList();
  }, []);

  // events 변환 로직
  const mappedEvents: EventInput[] = useMemo(() => {
    return scheduleList.map((item) => {
      const phonebook = item.phonebook;

      return {
        title: phonebook?.name || "예약",
        id: item.id,
        start: item.reserved_at,
        end: item.finished_at,
        extendedProps: {
          phonebook_id: item.phonebook_id,
          phone: phonebook?.phone_number,
          group: phonebook?.group_name,
          status: item.status,
          memo: item.memo,
          treatment_items: item.treatment_items.map((t) => ({
            treatment_id: t.treatment_id,
            menu_detail_id: t.menu_detail_id,
            name: t.menu_detail.name,
            duration: t.duration_min,
            price: t.base_price,
            session_no: t.session_no,
          })),
        },
      };
    });
  }, [scheduleList]);

  // 🔧 뷰 설정
  const viewOptions = {
    all: {
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      allDaySlot: true
    },
    month: {
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth",
      },
      allDaySlot: true
    },
    week: {
      initialView: "timeGridWeek",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "timeGridWeek",
      },
      allDaySlot: true
    },
    day: {
      initialView: "timeGridDay",
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      headerToolbar: false as false,
      allDaySlot: false
    },
  };

  const selectedView = viewOptions[view];

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={selectedView.initialView}
      headerToolbar={selectedView.headerToolbar}
      allDaySlot={selectedView.allDaySlot}
      editable={true}
      events={mappedEvents}
      eventContent={(arg) => <ReverseSchedule event={arg.event} />}
    />
  );
}
