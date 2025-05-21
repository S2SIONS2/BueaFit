'use client'

import { useState } from "react";
import { fetchInterceptors } from "../utils/fetchInterceptors";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "../components/Button";
import { useModalStore } from "@/store/useModalStore";
// import CustomSelect from "../components/CustomSelect";

interface ModifyProps {
    detail: DetailInfo;
    onClose: () => void;
}
interface DetailInfo {
    id: number;
    menu_id: number;
    base_price: number;
    duration_min: number;
    name: string;
}

export default function ModifyTreatmentDetail({ detail, onClose }: ModifyProps) {
    const [modifyName, setModifyName] = useState(detail.name || '');
    const [modifyPrice, setModifyPrice] = useState(detail.base_price || 0);

    // 시술 시간 계산
    const initialHour = Math.floor(detail.duration_min / 60) * 60;
    const initialMinute = detail.duration_min % 60;
    
    const [hour, setHour] = useState(initialHour || 0);
    const [minute, setMinute] = useState(initialMinute || 0);
    const time = hour + minute
    // const hourOption = [
    //     { value: 0, label: "0시간" },
    //     { value: 60, label: "1시간" },
    //     { value: 120, label: "2시간" },
    //     { value: 180, label: "3시간" },
    //     { value: 240, label: "4시간" },
    //     { value: 300, label: "5시간" },
    //     { value: 360, label: "6시간" },
    //     { value: 420, label: "7시간" },
    //     { value: 480, label: "8시간" }
    // ];

    // const minuteOption = [
    //     { value: 0, label: "0분" },
    //     { value: 15, label: "15분" },
    //     { value: 30, label: "30분" },
    //     { value: 45, label: "45분" },
    // ];

    const accessToken = useAuthStore.getState().access_token;
    const { closeModal } = useModalStore.getState();

    const modify = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatment-menus/${detail.menu_id}/details/${detail.id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    name: modifyName,
                    base_price: modifyPrice,
                    duration_min: time,
                }),
            });

            if (res.status === 200) {
                onClose();
                closeModal();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteTreatment = async () => {
        try {
            if (!confirm('정보는 삭제한 뒤 복구할 수 없습니다. 정말 삭제하시겠습니까?')) {
                return;
            }

            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatment-menus/${detail.menu_id}/details/${detail.id}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 204) {
                onClose();
                closeModal();
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <section className="p-2 bg-white rounded-2xl w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">시술 수정</h1>
            <form className="space-y-4 w-full">
                <label className="relative w-full">
                    <p className="text-sm font-medium text-gray-700 mb-1">시술 이름</p>
                    <input
                        type="text"
                        value={modifyName}
                        onChange={(e) => setModifyName(e.target.value)}
                        placeholder={detail.name}
                        className="w-full py-2 border-b border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 mb-4"
                    />
                </label>

                <label className="relative w-full">
                    <p className="text-sm font-medium text-gray-700 mb-1">시술 가격</p>
                    <input
                        type="number"
                        value={modifyPrice}
                        onChange={(e) => setModifyPrice(Number(e.target.value))}
                        placeholder={detail.base_price.toString()}
                        className="w-full py-2 border-b border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 mb-4"
                    />
                </label>

                <label className="relative w-full">
                    <p className="text-sm font-medium text-gray-700 mb-1">시술 시간</p>
                    <div className="flex gap-2">
                        {/* <CustomSelect
                            key="hour-select"
                            value={hour}
                            onChange={setHour}
                            placeholder="0시간"
                            options={hourOption}
                        />
                        <CustomSelect
                            key="minute-select"
                            value={minute}
                            onChange={setMinute}
                            placeholder="0분"
                            options={minuteOption}
                        /> */}
                        <select
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 mb-4 focus:outline-none"
                            value={hour}
                            onChange={(e) => setHour(Number(e.target.value))}
                        >
                            <option value={0}>0시간</option>
                            <option value={60}>1시간</option>
                            <option value={120}>2시간</option>
                            <option value={180}>3시간</option>
                            <option value={240}>4시간</option>
                            <option value={300}>5시간</option>
                            <option value={360}>6시간</option>
                            <option value={420}>7시간 이상</option>
                        </select>
                        <select
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 mb-4 focus:outline-none"
                            value={minute}
                            onChange={(e) => setMinute(Number(e.target.value))}
                        >
                            <option value={0}>0분</option>
                            <option value={15}>15분</option>
                            <option value={30}>30분</option>
                            <option value={45}>45분</option>                            
                        </select>
                    </div>
                </label>

                <div className="flex justify-center mt-6 gap-2">
                    <Button
                        type="submit"
                        className="cursor-pointer rounded-sm border border-gary-500 pt-1 pb-1 pl-4 pr-4 w-auto"
                        onClick={modify}
                    >
                        수정
                    </Button>
                    <button
                        type="button"
                        className="cursor-pointer rounded-sm border border-gary-500 pt-1 pb-1 pl-4 pr-4 bg-gray-500 text-white"
                        onClick={deleteTreatment}
                    >
                        삭제
                    </button>
                </div>
            </form>
        </section>
    );
}
