import { EventApi } from "@fullcalendar/core";

interface EventComponentProps {
  event: EventApi;
}

export default function ReverseSchedule({ event }: EventComponentProps) {
  return (
    <div style={{ fontSize: "12px", padding: "2px" }}>
      <strong>{event.title}</strong>
      <div>{event.extendedProps?.description}</div>
    </div>
  );
}