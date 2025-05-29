'use client';

import Button from "@/app/components/Button";
import { fetchInterceptors } from "@/app/utils/fetchInterceptors";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

dayjs.extend(utc);
dayjs.extend(timezone);

interface ManagerList {
    shop_id: number,
    user_id: number,
    user: ManagerUserList
}
interface ManagerUserList {
    id: number,
    email: string,
    name: string
    created_at: string
}

export default function Page() {
    const params = useParams();
    const shopId = params.id; // shop id
    const [inviteCode, setInviteCode] = useState('');
    const [expired, setExpired] = useState('');

    const [managerList, setManagerList] = useState<ManagerList[]>([]) // 직원 목록

    // 직원 목록 조회
    const fetchManagers = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops/${shopId}/users`, {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json"
                }
            })
            const data = await res.json()
            if(res.status === 200) {
                // 사장님 제외 직원만 값에 담기
                const filteredData = data.filter((item) => item.user.role === "MANAGER");
                setManagerList(filteredData);
            }

        }catch(e){
            console.error(e)
        }
    }

    // 초대 코드 생성
    const createCode = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops/${shopId}/invites`, {
                method: "POST",
            });

            if (res.ok) {
                fetchCode(); // 새로 생성 후 다시 불러오기
            }
        } catch (e) {
            console.error(e);
        }
    };

    // 초대 코드 조회
    const fetchCode = async () => {
        try {
            const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops/${shopId}/invites`, {
                method: "GET",
            });

            const data = await res.json();
            if (res.status === 200) {
                setInviteCode(data.invite_code);
                setExpired(dayjs.utc(data.expired_at).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'));
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchManagers()
        fetchCode();
    }, []);

    return (
        <div className="h-full p-4 sm:p-6 flex flex-col space-y-6 bg-white">
            <section className="flex flex-col sm:gap-2 pb-2 sm:pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">직원 관리</h2>
                <p className="mb-1">직원 정보를 확인 및 관리 하실 수 있습니다.</p>
            </section>

            {/* 초대 코드 생성 */}
            <section className="bg-white rounded-xl shadow p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-1 text-lg font-semibold text-gray-800">
                        초대 코드 생성
                        <span className="relative w-[20px] h-[20px] flex items-center justify-center bg-stone-200 rounded-full cursor-pointer group">
                            <FontAwesomeIcon icon={faQuestion} />
                            <div className="absolute top-2 left-6 whitespace-nowrap p-2 bg-stone-200 rounded-sm text-xs shadow-md hidden group-hover:block z-10">
                                초대 코드를 생성하여 가게 직원을 추가 하실 수 있습니다.
                            </div>
                        </span>
                    </h2>
                    <Button
                        type="button"
                        className="rounded-sm"
                        onClick={createCode}
                    >
                        코드 생성
                    </Button>
                </div>
                <ul className="text-sm text-gray-700">
                    <li>직원 등록은 회원가입 시 초대코드를 등록하면 입사가 완료됩니다.</li>
                </ul>


                <div className="mt-4 text-sm space-y-3 text-gray-800">
                    <p>
                        <span className="font-bold">초대 코드:</span> {inviteCode || '없음'}
                        {
                            inviteCode != '' ? (
                                <span className="ml-2">
                                    <button
                                        type="button"
                                        className="text-violet-500 cursor-pointer"
                                        onClick={() => {
                                            if (!inviteCode) return;
                                                navigator.clipboard.writeText(inviteCode).then(() => {
                                                toast.success('초대 코드가 복사되었습니다!');
                                            }).catch(() => {
                                                toast.error('복사에 실패했습니다.');
                                            });
                                        }}
                                    >
                                        복사하기
                                    </button>
                                </span>
                            ) : ( null )
                        }
                    </p>
                    <p>
                        <span className="font-bold">코드 만료 시간:</span> {expired || '없음'}
                    </p>
                </div>
            </section>

            <section className="bg-white rounded-xl shadow p-4 space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">직원 목록</h2>
                {
                    managerList.length === 0 ? (
                    <p className="text-gray-500">등록된 직원이 없습니다.</p>
                    ) : (
                    managerList.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-2 hover:shadow-sm transition-shadow">
                            <div className="flex items-center justify-between">
                                <p className="text-base font-semibold text-gray-800">{item.user.name}</p>
                                <span className="text-xs text-gray-400">{new Date(item.user.created_at).toLocaleDateString('ko-KR')}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p><span className="font-medium text-gray-700">이메일:</span> {item.user.email}</p>
                            </div>
                        </div>
                    ))
                    )
                }
                </section>
        </div>
    );
}
