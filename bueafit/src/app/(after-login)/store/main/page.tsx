import CalendarComponent from "@/app/components/CalendarComponent";

export default function Page(){
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
            {/* 우측: 통계 정보 */}
            <div className="flex flex-col col-span-3 gap-4">
                {/* 직원별 매출 */}
                <div className="bg-white rounded-xl shadow p-4">
                <h3 className="text-md font-semibold mb-2">직원별 매출</h3>
                <div className="h-40 bg-gray-100 rounded">[BarChart]</div>
                </div>

                {/* 시술별 매출 */}
                <div className="bg-white rounded-xl shadow p-4">
                <h3 className="text-md font-semibold mb-2">시술별 매출</h3>
                <div className="h-40 bg-gray-100 rounded">[PieChart]</div>
                </div>

                {/* 시술별 인원 수 */}
                <div className="bg-white rounded-xl shadow p-4">
                <h3 className="text-md font-semibold mb-2">시술별 총 인원</h3>
                <div className="h-40 bg-gray-100 rounded">[BarChart]</div>
                </div>

                {/* 외상 금액 & 완료 수 */}
                <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <h3 className="text-md font-semibold mb-2">금일 외상 금액</h3>
                    <p className="text-2xl font-bold text-red-600">₩123,000</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <h3 className="text-md font-semibold mb-2">작업 완료 수</h3>
                    <p className="text-2xl font-bold text-green-600">15건</p>
                </div>
                </div>

                {/* 작업 완료 내역 */}
                <div className="bg-white rounded-xl shadow p-4">
                <h3 className="text-md font-semibold mb-2">작업 완료 내역</h3>
                <div className="h-32 overflow-y-auto bg-gray-50 rounded p-2">
                    <ul className="text-sm list-disc pl-5 space-y-1">
                    <li>홍길동 - 두피 관리</li>
                    <li>김영희 - 스킨 케어</li>
                    <li>박철수 - 손 마사지</li>
                    {/* ... */}
                    </ul>
                </div>
                </div>
            </div>
            {/* 좌측: FullCalendar Day View */}
            <div className="bg-white rounded-xl col-span-1 shadow p-4 h-full flex flex-col">
                <h2 className="text-xl font-semibold mb-4">오늘의 예약</h2>
                {/* FullCalendar Day View */}
                <div className="grow overflow-y-auto">
                    <CalendarComponent view="day" /> 
                </div>
            </div>
        </div>
    )
}