'use client';

import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const params = useParams();
    const paramsId = params.id
    const [scheduleList, setScheduleList] = useState<any[]>([]); // 예약 리스트
    // const [name, setName] = useState(scheduleList || '')
      
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
                const filteredData = data.items.filter((item) => item.id === Number(paramsId))
                console.log(filteredData)
                setScheduleList(filteredData);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchScheduleList();
    }, []);
    
    return (
        <div>
            <section>
                <h2>예약 수정</h2>
                {scheduleList}
            </section>
        </div>
    )
}