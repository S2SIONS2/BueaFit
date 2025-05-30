'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchInterceptors } from '@/app/utils/fetchInterceptors';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ModifyCustomerModal from '@/app/modal/modifyCustomer';
import { useModalStore } from '@/store/useModalStore';
import CustomerSchedule from '@/app/components/customer-schedule';

interface CustomerInfo {
  id: number;
  name: string;
  phone_number: string | number;
  memo?: string;
  group_name?: string;
}

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);

  const openModal = useModalStore((state) => state.openModal)

  // 모달 닫힘 체크
  const [checkClose, setCheckClose] = useState(false);
  const handleModalclose = () => {
    setCheckClose(!checkClose);
  };

  useEffect(() => {
    async function fetchCustomer() {
      const res = await fetchInterceptors(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/phonebooks/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setCustomer(data);
    }

    fetchCustomer();
  }, [id, checkClose]);

  if (!customer) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <LoadingSpinner className="w-15 h-15" />
      </div>
    );
  }

  return (
    <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 ">
      <h1 className="text-2xl font-bold mb-2">고객 상세</h1>
      <p className="text-gray-600 mb-8">고객 정보 수정 및 예약 내역, 시술 정보를 확인할 수 있습니다.</p>

      {/* 고객 기본 정보 */}
      <section className="bg-white mb-8">
        <div className='border-b pb-2 mb-4 flex items-center justify-between'>
          <h2 className="text-xl font-semibold">고객 정보</h2>
           {/* 수정 버튼 */}
          <button
            type={'button'} 
            className={'p-2 pl-3 pr-3 cursor-pointer rounded-lg bg-violet-400 hover:bg-violet-600 text-white'} 
            onClick={() => openModal(<ModifyCustomerModal customer={customer} onClose={handleModalclose}/>)}
          >
            수정
          </button>
        </div>

        <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <div className="h-[40px] grid grid-cols-5 border-b border-gray-200 bg-gray-50">
            <div className="p-3 text-sm font-semibold text-gray-700 col-span-1"></div>
            <div className="p-3 text-sm font-semibold text-gray-700 col-span-4"></div>
          </div>

          <div className="grid grid-cols-5 border-b border-gray-100">
            <div className="p-3 text-sm text-gray-500">그룹</div>
            <div className="p-3 col-span-4 text-base font-medium text-gray-800">{customer.group_name || '-'}</div>
          </div>

          <div className="grid grid-cols-5 border-b border-gray-100">
            <div className="p-3 text-sm text-gray-500">이름</div>
            <div className="p-3 col-span-4 text-base font-medium text-gray-800">{customer.name}</div>
          </div>

          <div className="grid grid-cols-5 border-b border-gray-100">
            <div className="p-3 text-sm text-gray-500">전화번호</div>
            <div className="p-3 col-span-4 text-base font-medium text-gray-800">{customer.phone_number}</div>
          </div>

          <div className="grid grid-cols-5">
            <div className="p-3 text-sm text-gray-500">메모</div>
            <div className="p-3 col-span-4 text-base font-medium text-gray-800 whitespace-pre-line">{customer.memo || '-'}</div>
          </div>
        </div>
      </section>

      <CustomerSchedule customerId={customer.id}/>
    </div>
  );
}
