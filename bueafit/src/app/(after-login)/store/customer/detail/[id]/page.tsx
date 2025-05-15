'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchInterceptors } from '@/app/utils/fetchInterceptors';
import LoadingSpinner from '@/app/components/LoadingSpinner';

interface CustomerInfo {
  name: string;
  phone_number: string | number;
  memo?: string;
  group_name?: string;
}

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);

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
  }, [id]);

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
        <h2 className="text-xl font-semibold border-b pb-2 mb-4">고객 정보</h2>

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


      {/* 예약 일정 */}
      <section className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold border-b pb-2 mb-4">예약 일정</h2>
        <div className="text-gray-500">예약 날짜, 시술 명, 시술 차수, 메모 등 표시 예정</div>
      </section>

      {/* 완료 시술 내역 */}
      <section className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-4">완료 시술 내역</h2>
        <div className="text-gray-500">시술 날짜, 시술 명, 시술 차수, 메모 등 표시 예정</div>
      </section>
    </div>
  );
}
