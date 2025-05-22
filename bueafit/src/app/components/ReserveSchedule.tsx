import { useModalStore } from "@/store/useModalStore";
import { EventApi } from "@fullcalendar/core";
import Schedule from "../modal/schedule";

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
  
  return (
    <div
      style={{ fontSize: "12px", padding: "2px" }}
      onClick={() => openModal(<Schedule event={event}/>)}
    >
      <h2 className="font-bold">{event.title}</h2>
      <p >예약 시간: {time}</p>
    </div>
  );
}
