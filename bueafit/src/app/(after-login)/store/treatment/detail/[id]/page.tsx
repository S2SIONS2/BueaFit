'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchInterceptors } from '@/app/utils/fetchInterceptors';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useModalStore } from '@/store/useModalStore';
import ModifyTreatment from '@/app/modal/modifyTreatment';

interface TreatmentInfo {
  id: number;
  name: string;
  details: TreatmentDetail[];
}

interface TreatmentDetail {
    id: number
    menu_id: number;
    base_price: number;
    duration_min: number;
    name: string;
}

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [treatment, setTreatment] = useState<TreatmentInfo[] | null>(null);

  const openModal = useModalStore((state) => state.openModal)

  // 모달 닫힘 체크
  const [checkClose, setCheckClose] = useState(false);
  const handleModalclose = () => {
    setCheckClose(true);
  };

  useEffect(() => {
    async function fetchCustomer() {
      const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/treatment-menus`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      const items = data.items;
      const filteredData = items.filter((item: TreatmentInfo) => item.id === Number(id));
      setTreatment(filteredData);
      console.log(filteredData);
    }

    fetchCustomer();
  }, [id, checkClose]);

  if (!treatment) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <LoadingSpinner className="w-15 h-15" />
      </div>
    );
  }

  return (
    <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 ">
      <h1 className="text-2xl font-bold mb-2">시술 상세</h1>
      <p className="text-gray-600 mb-8">시술 메뉴 수정 및 시술의 상세 부분을 확인 할 수 있습니다.</p>

      <section className="bg-white mb-8">
        <div className='border-b pb-2 mb-4 flex items-center justify-between'>
          <h2 className="text-xl font-semibold">{treatment[0].name}</h2>           
          <button
            type={'button'} 
            className={'p-2 pl-3 pr-3 cursor-pointer rounded-lg bg-violet-400 hover:bg-violet-600 text-white'} 
            onClick={() => openModal(<ModifyTreatment treatment={treatment} onClose={handleModalclose}/>)}
          >
            수정
          </button>
        </div>
        {
        treatment.map((treatment) => (
            <div
                key={treatment.id}
                className="w-full mb-6 border border-gray-300 rounded-xl p-4 shadow-sm bg-white"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    시술 상세
                </h3>

                <div className="space-y-3">
                    {treatment.details.map((detail: any) => (
                        <div
                            key={detail.id}
                            className="border border-gray-200 rounded-md p-4 bg-gray-50"
                        >
                            <div className="text-sm text-gray-500 mb-1">시술 명</div>
                            <div className="text-base font-medium text-gray-800">{detail.name}</div>

                            <div className="mt-2 text-sm text-gray-600">
                                소요 시간: {
                                    `${Math.floor(detail.duration_min / 60) > 0 ? `${Math.floor(detail.duration_min / 60)}시간 ` : ""}`
                                    + `${detail.duration_min % 60 > 0 ? `${detail.duration_min % 60}분` : ""}`
                                }
                                / 가격: {detail.base_price.toLocaleString()}원
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))
    }
      </section>
    </div>
  );
}
