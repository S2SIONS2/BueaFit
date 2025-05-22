import { EventApi } from "@fullcalendar/core";

interface EventComponentProps {
  event: EventApi;
}

export default function Schedule({event}: EventComponentProps) {
    const time = event.start?.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
    return (
        <div>
            <h1>예약 확인</h1>
            <h2>
                예약자: {event.title}
            </h2>
            <p>
                예약 시간: {time}
            </p>
        </div>
    )
}