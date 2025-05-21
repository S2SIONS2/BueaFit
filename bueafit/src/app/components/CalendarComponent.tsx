'use client';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // 드래그 등
import ReverseSchedule from "./ReserveSchedule";
import { useEffect, useState } from "react";
import { fetchInterceptors } from "../utils/fetchInterceptors";

export default function CalendarComponent() {
    const [scheduleList, setScheduleList] = useState([]);

    // 예약 조회
    const fetchScheduleList = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatments`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const data = await res.json();

            if(res.status === 200) {
                setScheduleList(data);
            }
        }catch(e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchScheduleList();
        console.log(scheduleList)
    }, [])

    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}
            editable={true}
            events={[
            {
                title: "회의",
                start: "2025-05-22",
                description: "회의실 A에서",
            },
            {
                title: "진료 예약",
                start: "2025-05-24",
                description: "병원 방문",
            },
            ]}
            eventContent={(arg) => <ReverseSchedule event={arg.event} />}
        />
    );
}
